import {
  createPermission,
  createTarget,
  isAdmin,
  isTeamAdmin,
  isUser,
} from "../permission";
import { db } from "../server/db.server";
import { findSessionUser, findSessionUserOptional } from "../sessions";

async function findProblemSetInformation(
  problemSetId: number,
  self: number | undefined
) {
  const problemSet = await db.problemSet.findUnique({
    where: { id: problemSetId },
    select: {
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

  if (!problemSet) {
    throw new Response("题单不存在", { status: 404 });
  }

  return problemSet;
}

const targetOptional = createTarget(
  async (request: Request, problemSetId: number) => {
    const self = await findSessionUserOptional(request);
    const problemSet = await findProblemSetInformation(problemSetId, self?.id);
    return { self, problemSet };
  }
);

const targetStrict = createTarget(
  async (request: Request, problemSetId: number) => {
    const self = await findSessionUser(request);
    const problemSet = await findProblemSetInformation(problemSetId, self.id);
    return { self, problemSet };
  }
);

/** 检查题单的读权限 */
export const permissionProblemSetRead = createPermission(
  targetOptional,
  ({ self, problemSet }) => {
    // 如果是系统管理员，则具有所有的查看权限
    if (isAdmin(self?.role)) return true;

    // 对于团队的题单
    if (problemSet.team) {
      // 公开题单都可以被访问
      if (!problemSet.private) return true;
      // 团队管理员可以访问
      if (isTeamAdmin(problemSet.team.members.at(0)?.role)) return true;
    }
    // 对于系统题单
    else {
      // 公开题单都可以被访问
      if (!problemSet.private) return true;
    }
  }
);

/** 检查题单的更新权限 */
export const permissionProblemSetUpdate = createPermission(
  targetStrict,
  ({ self, problemSet }) => {
    // 系统管理员可以为所欲为
    if (isAdmin(self.role)) return true;
    // 被封禁用户无法更新
    if (!isUser(self.role)) return false;

    // 对于团队的题单
    if (problemSet.team) {
      // 团队管理员可以更新
      if (isTeamAdmin(problemSet.team.members.at(0)?.role)) return true;
    }
  }
);

/**
 * 检查创建题单的权限
 *
 * 只有系统管理员可以创建题单
 */
export { permissionAdmin as permissionProblemSetCreate } from "./user";
