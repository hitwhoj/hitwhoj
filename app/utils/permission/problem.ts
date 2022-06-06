import { isAdmin, isTeamAdmin } from "~/utils/permission";
import { db } from "~/utils/server/db.server";
import { findSessionUser, findSessionUserOptional } from "~/utils/sessions";

/**
 * 检查用户是否有查看题目的权限
 *
 * 对于所有的题目，如果满足以下条件之一可以直接查看：
 *
 * - 是系统管理员
 * - 是题目的创建者
 * - 题目是公开的
 *
 * 此外对于团队创建的题目，如果满足以下条件也可以查看：
 *
 * - 当前用户是团队的管理员
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
      creator: {
        select: {
          id: true,
        },
      },
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

  // 创建者可以查看自己的题目
  if (self && problem.creator.id === self.id) {
    return;
  }

  // 公开的题目可以查看
  if (!problem.private) {
    return;
  }

  // 团队创建的题目，如果当前用户是团队的管理员，则可以查看
  if (self && problem.team) {
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
 * - 是题目的创建者
 * - 题目是公开的
 *
 * 此外对于团队创建的题目，如果满足以下条件也可以提交：
 *
 * - 当前用户是团队的管理员
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
      creator: {
        select: {
          id: true,
        },
      },
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

  // 创建者可以提交自己的题目
  if (problem.creator.id === self.id) {
    return;
  }

  // 公开的题目可以提交
  if (!problem.private) {
    return;
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

    if (member && isTeamAdmin(member.role)) {
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
 * - 是题目的创建者
 *
 * 注意：团队的管理员也没有更新题目的权限，如果题目创建者退出了团队，则需要提前将题目的所有权转移
 */
export async function checkProblemUpdatePermission(
  request: Request,
  problemId: number
) {
  const self = await findSessionUser(request);

  const problem = await db.problem.findUnique({
    where: { id: problemId },
    select: {
      id: true,
      private: true,
      creator: {
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

  // 创建者可以更新自己的题目
  if (problem.creator.id === self.id) {
    return;
  }

  throw new Response("您没有权限更新该题目", { status: 403 });
}
