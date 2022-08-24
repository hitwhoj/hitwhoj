import { isAdmin, or, Permission } from "../permission";
import { db } from "~/utils/server/db.server";
import { findSessionUserOptional } from "~/utils/sessions";

async function findTeamInformation(teamId: number, self: number | undefined) {
  const team = await db.team.findUnique({
    where: { id: teamId },
    select: {
      id: true,
      members: {
        where: { userId: self ?? -1 },
      },
    },
  });

  if (!team) {
    throw new Response("团队不存在", { status: 404 });
  }

  return team;
}

/**
 * 检查用户是否有查看团队成员、题目、设置等的权限
 */
export const permissionTeamRead = new Permission(
  async (request: Request, teamId: number) => {
    const self = await findSessionUserOptional(request);
    const team = await findTeamInformation(teamId, self?.id);
    return { self, team };
  },
  or(
    // 如果是系统管理员，则具有所有的查看权限
    ({ self }) => isAdmin(self?.role),
    // 团队成员具有团队的各项查看权限
    ({ team }) => team.members.length > 0
  )
);
