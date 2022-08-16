import {
  and,
  isAdmin,
  isTeamAdmin,
  isUser,
  or,
  Permission,
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

/**
 * 检查题单的读权限
 */
export const permissionProblemSetRead = new Permission(
  async (request: Request, problemSetId: number) => {
    const self = await findSessionUserOptional(request);
    const problemSet = await findProblemSetInformation(problemSetId, self?.id);
    return { self, problemSet };
  },

  or(
    // 如果是系统管理员，则具有所有的查看权限
    ({ self }) => isAdmin(self?.role),
    and(
      // 对于团队的题单
      ({ problemSet }) => problemSet.team !== null,
      or(
        // 题单设置为公开
        ({ problemSet }) => problemSet.private === false,
        // 或者是团队的管理员
        ({ problemSet }) => isTeamAdmin(problemSet.team?.members.at(0)?.role)
      )
    ),
    and(
      // 对于系统的题单
      ({ problemSet }) => problemSet.team === null,
      // 题单必须设置为公开
      ({ problemSet }) => problemSet.private === false
    )
  )
);

/**
 * 检查题单的更新权限
 */
export const permissionProblemSetUpdate = new Permission(
  async (request: Request, problemSetId: number) => {
    const self = await findSessionUser(request);
    const problemSet = await findProblemSetInformation(problemSetId, self.id);
    return { self, problemSet };
  },
  or(
    // 系统管理员可以为所欲为
    ({ self }) => isAdmin(self.role),
    and(
      // 对于团队的题单
      ({ problemSet }) => problemSet.team !== null,
      // 必须没有被封禁
      ({ self }) => isUser(self.role),
      // 并且是团队的管理员
      ({ problemSet }) => isTeamAdmin(problemSet.team?.members.at(0)?.role)
    )
  )
);

/**
 * 检查创建题单的权限
 */
export { permissionAdmin as permissionProblemSetCreate } from "./user";
