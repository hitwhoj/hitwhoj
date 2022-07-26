import {
  and,
  isAdmin,
  isTeamAdmin,
  isUser,
  or,
  Permission,
} from "~/utils/permission";
import { db } from "~/utils/server/db.server";
import { findSessionUser, findSessionUserOptional } from "~/utils/sessions";

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

/**
 * 检查用户是否有查看题目的权限
 */
export const permissionProblemRead = new Permission(
  async (request: Request, problemId: number) => {
    const self = await findSessionUserOptional(request);
    const problem = await findProblemInformation(problemId, self?.id);
    return { self, problem };
  },
  or(
    // 如果是系统管理员，则具有所有的查看权限
    ({ self }) => isAdmin(self?.role),
    and(
      // 对于团队的题目
      ({ problem }) => problem.team !== null,
      or(
        // 是团队的管理员
        ({ problem }) => isTeamAdmin(problem.team?.members.at(0)?.role),
        // 或者题目设置为公开
        ({ problem }) => problem.private === false
      )
    ),
    and(
      // 对于系统的题目
      ({ problem }) => problem.team === null,
      // 题目必须设置为公开
      ({ problem }) => problem.private === false
    )
  )
);

/**
 * 检查用户是否有提交题目的权限
 */
export const permissionProblemSubmit = new Permission(
  async (request: Request, problemId: number) => {
    const self = await findSessionUser(request);
    const problem = await findProblemInformation(problemId, self.id);
    return { self, problem };
  },
  or(
    // 如果是系统管理员，则具有所有的提交权限
    ({ self }) => isAdmin(self.role),
    and(
      // 封禁用户无法提交
      ({ self }) => isUser(self.role),
      or(
        and(
          // 对于团队的题目
          ({ problem }) => problem.team !== null,
          or(
            // 是团队的管理员
            ({ problem }) => isTeamAdmin(problem.team!.members.at(0)?.role),
            // 或者题目设置为公开并且用户是团队成员
            ({ problem }) =>
              problem.private === false && problem.team!.members.length > 0
          )
        ),
        and(
          // 对于系统的题目
          ({ problem }) => problem.team === null,
          // 题目必须设置为公开
          ({ problem }) => problem.private === false
        )
      )
    )
  )
);

/**
 * 检查用户是否有更新题目的权限
 */
export const permissionProblemUpdate = new Permission(
  async (request: Request, problemId: number) => {
    const self = await findSessionUser(request);
    const problem = await findProblemInformation(problemId, self.id);
    return { self, problem };
  },
  and(
    // 封禁用户无法更新
    ({ self }) => isUser(self.role),
    or(
      // 如果是系统管理员，则具有所有的更新权限
      ({ self }) => isAdmin(self.role),
      and(
        // 或者对于团队的题目
        ({ problem }) => problem.team !== null,
        // 是团队的管理员
        ({ problem }) => isTeamAdmin(problem.team?.members.at(0)?.role)
      )
    )
  )
);

/**
 * 检查题目创建权限
 *
 * 只有系统管理员可以创建题目
 */
export { permissionAdmin as permissionProblemCreate } from "./user";
