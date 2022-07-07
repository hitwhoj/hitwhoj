import { isAdmin, isTeamAdmin, isUser } from "../permission";
import { db } from "../server/db.server";
import { findSessionUser, findSessionUserOptional } from "../sessions";

/**
 * 检查题单的读权限
 *
 * - 是系统管理员
 * - 或者题单是公开的
 * - 或者是题单的所属团队的管理员
 */
export async function checkProblemSetReadPermission(
  request: Request,
  problemSetId: number
) {
  const self = await findSessionUserOptional(request);

  if (self && isAdmin(self.role)) {
    return;
  }

  const problemSet = await db.problemSet.findUnique({
    where: { id: problemSetId },
    select: {
      private: true,
      team: { select: { id: true } },
    },
  });

  if (!problemSet) {
    throw new Response("题单不存在", { status: 404 });
  }

  if (!problemSet.private) {
    return;
  }

  if (problemSet.team && self) {
    const member = await db.teamMember.findUnique({
      where: {
        userId_teamId: {
          userId: self.id,
          teamId: problemSet.team.id,
        },
      },
      select: {
        role: true,
      },
    });

    if (member && isTeamAdmin(member.role)) {
      return;
    }
  }

  throw new Response("您没有权限查看此题单", { status: 403 });
}

/**
 * 检查题单的写权限
 *
 * - 是系统管理员
 * - 或者是题单的所属团队的管理员
 */
export async function checkProblemSetWritePermission(
  request: Request,
  problemSetId: number
) {
  const self = await findSessionUser(request);

  if (isAdmin(self.role)) {
    return;
  }

  if (!isUser(self.role)) {
    throw new Response("您已被封禁", { status: 403 });
  }

  const problemSet = await db.problemSet.findUnique({
    where: { id: problemSetId },
    select: {
      team: { select: { id: true } },
    },
  });

  if (!problemSet) {
    throw new Response("题单不存在", { status: 404 });
  }

  if (problemSet.team) {
    const member = await db.teamMember.findUnique({
      where: {
        userId_teamId: {
          userId: self.id,
          teamId: problemSet.team.id,
        },
      },
      select: {
        role: true,
      },
    });

    if (member && isTeamAdmin(member.role)) {
      return;
    }
  }

  throw new Response("您没有权限修改此题单", { status: 403 });
}

/**
 * 检查创建题单的权限
 *
 * - 必须是系统管理员
 */
export { checkAdminPermission as checkProblemSetCreatePermission } from "./user";
