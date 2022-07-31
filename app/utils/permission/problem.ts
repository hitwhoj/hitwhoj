import {
  createPermission,
  createTarget,
  isAdmin,
  isTeamAdmin,
  isUser,
} from "~/utils/permission";
import { db } from "~/utils/server/db.server";
import { findSessionUserOptional } from "~/utils/sessions";

async function findProblemInformation(
  problemId: number,
  self: number | undefined
) {
  const problem = await db.problem.findUnique({
    where: { id: problemId },
    select: {
      id: true,
      private: true,
      team: {
        select: {
          id: true,
          members: {
            where: { userId: self ?? -1 },
            select: { role: true },
          },
        },
      },
    },
  });

  if (!problem) {
    throw new Response("题目不存在", { status: 404 });
  }

  return problem;
}

const target = createTarget(async (request: Request, problemId: number) => {
  const self = await findSessionUserOptional(request);
  const problem = await findProblemInformation(problemId, self?.id);
  return { self, problem };
});

/** 检查用户是否有查看题目的权限 */
export const permissionProblemRead = createPermission(
  target,
  ({ self, problem }) => {
    // 如果是系统管理员，则具有所有的查看权限
    if (isAdmin(self?.role)) return true;

    // 如果是团队的题目
    if (problem.team) {
      // 如果是团队管理员，则具有查看权限
      if (isTeamAdmin(problem.team.members.at(0)?.role)) return true;
      // 题目公开，则具有查看权限
      if (!problem.private) return true;
    }
    // 对于系统题目
    else {
      // 题目公开，则具有查看权限
      if (!problem.private) return true;
    }
  }
);

/** 检查用户是否有提交题目的权限 */
export const permissionProblemSubmit = createPermission(
  target,
  ({ self, problem }) => {
    // 如果是系统管理员，则具有所有的提交权限
    if (isAdmin(self?.role)) return true;
    // 封禁用户无法提交
    if (!isUser(self?.role)) return false;

    // 如果是团队的题目
    if (problem.team) {
      // 团队管理员可以提交
      if (isTeamAdmin(problem.team!.members.at(0)?.role)) return true;
      // 或者题目公开并且用户是团队成员
      if (!problem.private && problem.team!.members.length > 0) return true;
    }
    // 如果是系统题目
    else {
      // 题目必须公开
      if (!problem.private) return true;
    }
  }
);

/** 检查用户是否有更新题目的权限 */
export const permissionProblemUpdate = createPermission(
  target,
  ({ self, problem }) => {
    // 如果是系统管理员，则具有所有的更新权限
    if (isAdmin(self?.role)) return true;
    // 封禁用户无法更新
    if (!isUser(self?.role)) return false;

    // 如果是团队的题目
    if (problem.team) {
      // 团队管理员可以更新
      if (isTeamAdmin(problem.team.members.at(0)?.role)) return true;
    }
  }
);

/**
 * 检查题目创建权限
 *
 * 只有系统管理员可以创建题目
 */
export { permissionAdmin as permissionProblemCreate } from "./user";
