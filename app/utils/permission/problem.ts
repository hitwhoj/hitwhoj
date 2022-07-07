import { isAdmin, isTeamAdmin, isUser } from "~/utils/permission";
import { db } from "~/utils/server/db.server";
import { findSessionUser, findSessionUserOptional } from "~/utils/sessions";

/**
 * 检查用户是否有查看题目的权限
 *
 * 对于所有的题目，如果满足以下条件之一可以直接查看：
 *
 * - 是系统管理员
 * - 或者当前用户是团队的管理员
 * - 或者当前用户是团队的成员并且题目公开
 * - 或者题目不属于任何团队并且公开
 */
export async function checkProblemReadPermission(
  request: Request,
  problemId: number
) {
  const self = await findSessionUserOptional(request);

  const problem = await db.problem.findUnique({
    where: { id: problemId },
    select: {
      id: true,
      private: true,
      team: {
        select: {
          id: true,
        },
      },
    },
  });

  if (!problem) {
    throw new Response("题目不存在", { status: 404 });
  }

  // 系统管理员可以查看所有题目
  if (self && isAdmin(self.role)) {
    return;
  }

  // 团队创建的题目
  if (problem.team) {
    if (self) {
      const member = await db.teamMember.findUnique({
        where: {
          userId_teamId: {
            userId: self.id,
            teamId: problem.team.id,
          },
        },
        select: {
          role: true,
        },
      });

      // 如果是团队的公开题目，则团队成员可以查看
      if (member && !problem.private) {
        return;
      }

      // 如果当前用户是团队的管理员，则可以查看
      if (member && isTeamAdmin(member.role)) {
        return;
      }
    }
  } else {
    // 如果是公开题目，则可以查看
    if (!problem.private) {
      return;
    }
  }

  throw new Response("您没有权限查看该题目", { status: 403 });
}

/**
 * 检查用户是否有提交题目的权限
 *
 * 首先用户必须是已登录用户
 *
 * 其次如果满足以下条件之一可以直接提交：
 *
 * - 是系统管理员
 * - 或者当前用户是团队的管理员
 * - 或者当前用户是团队的成员并且题目公开
 * - 或者题目不属于任何团队并且公开
 */
export async function checkProblemSubmitPermission(
  request: Request,
  problemId: number
) {
  const self = await findSessionUser(request);

  const problem = await db.problem.findUnique({
    where: { id: problemId },
    select: {
      id: true,
      private: true,
      team: {
        select: {
          id: true,
        },
      },
    },
  });

  if (!problem) {
    throw new Response("题目不存在", { status: 404 });
  }

  // 系统管理员可以提交所有题目
  if (isAdmin(self.role)) {
    return;
  }

  if (!isUser(self.role)) {
    throw new Response("您已被封禁", { status: 403 });
  }

  // 团队创建的题目，如果当前用户是团队的管理员，则可以提交
  if (problem.team) {
    const member = await db.teamMember.findUnique({
      where: {
        userId_teamId: {
          userId: self.id,
          teamId: problem.team.id,
        },
      },
      select: {
        role: true,
      },
    });

    if (member && !problem.private) {
      return;
    }

    if (member && isTeamAdmin(member.role)) {
      return;
    }
  } else {
    if (!problem.private) {
      return;
    }
  }

  throw new Response("您没有权限提交该题目", { status: 403 });
}

/**
 * 检查用户是否有更新题目的权限
 *
 * 如果满足以下条件之一可以直接更新：
 *
 * - 是系统管理员
 * - 是题目所属团队的管理员
 *
 * 注意被封禁用户无法更新题目
 */
export async function checkProblemWritePermission(
  request: Request,
  problemId: number
) {
  const self = await findSessionUser(request);

  const problem = await db.problem.findUnique({
    where: { id: problemId },
    select: {
      id: true,
      private: true,
      team: {
        select: {
          id: true,
        },
      },
    },
  });

  if (!problem) {
    throw new Response("题目不存在", { status: 404 });
  }

  // 系统管理员可以更新所有题目
  if (isAdmin(self.role)) {
    return;
  }

  // 封禁用户什么也做不到
  if (!isUser(self.role)) {
    throw new Response("您已被封禁", { status: 403 });
  }

  // 团队题目，必须是团队的管理员
  if (problem.team) {
    const member = await db.teamMember.findUnique({
      where: {
        userId_teamId: {
          userId: self.id,
          teamId: problem.team.id,
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

  throw new Response("您没有权限更新该题目", { status: 403 });
}

/**
 * 检查题目创建权限
 *
 * 只有系统管理员可以创建题目
 */
export { checkAdminPermission as checkProblemCreatePermission } from "./user";
