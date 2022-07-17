import { isAdmin, isUser } from "../permission";
import { db } from "../server/db.server";
import { findSessionUser, findSessionUserOptional } from "../sessions";

enum ContestStatus {
  PENDING,
  RUNNING,
  ENDED,
}

async function getContestInformations(contestId: number) {
  const contest = await db.contest.findUnique({
    where: { id: contestId },
    select: {
      private: true,
      beginTime: true,
      endTime: true,
      allowPublicRegistration: true,
      allowAfterRegistration: true,
    },
  });

  if (!contest) {
    throw new Response("比赛不存在", { status: 404 });
  }

  const now = new Date();
  const status =
    now < contest.beginTime
      ? ContestStatus.PENDING
      : now > contest.endTime
      ? ContestStatus.ENDED
      : ContestStatus.RUNNING;
  const isPublic = contest.private === false;

  return {
    status,
    isPublic,
    allowPublicRegistration: contest.allowPublicRegistration,
    allowAfterRegistration: contest.allowAfterRegistration,
  };
}

async function getContestRole(contestId: number, userId: number) {
  const contest = await db.contest.findUnique({
    where: { id: contestId },
    select: {
      mods: { where: { id: userId }, select: { id: true } },
      juries: { where: { id: userId }, select: { id: true } },
      attendees: { where: { id: userId }, select: { id: true } },
    },
  });

  if (!contest) {
    throw new Response("比赛不存在", { status: 404 });
  }

  const isMod = contest.mods.length > 0;
  const isJury = contest.juries.length > 0;
  const isAttendee = contest.attendees.length > 0;

  return { isMod, isJury, isAttendee };
}

/**
 * 检查是否有查看比赛信息的权限
 *
 * - 如果比赛是公开的，那么所有人都可以看到比赛的信息
 * - 否则只有系统管理员、比赛创建者、比赛管理员、比赛裁判、比赛选手可以查看比赛信息
 */
export async function checkContestReadPermission(
  request: Request,
  contestId: number
) {
  const self = await findSessionUserOptional(request);
  const { isPublic } = await getContestInformations(contestId);

  if (isPublic) {
    return;
  }

  if (!self) {
    throw new Response("请登录", { status: 401 });
  }

  if (isAdmin(self.role)) {
    return;
  }

  const { isMod, isJury, isAttendee } = await getContestRole(
    contestId,
    self.id
  );

  if (isMod || isJury || isAttendee) {
    return;
  }

  throw new Response("您没有权限查看比赛信息", { status: 403 });
}

/**
 * 检查是否有修改比赛信息的权限
 *
 * - 用户必须是系统管理员或者比赛管理员（并且没有被封禁）
 */
export async function checkContestWritePermission(
  request: Request,
  contestId: number
) {
  const self = await findSessionUser(request);

  if (isAdmin(self.role)) {
    return;
  }

  if (isUser(self.role)) {
    const { isMod } = await getContestRole(contestId, self.id);

    if (isMod) {
      return;
    }
  }

  throw new Response("您没有权限修改比赛信息", { status: 403 });
}

/**
 * 检查是否有查看比赛题目列表的权限
 *
 * 对于比赛分为三个阶段
 * - 未开始：只有系统管理员、比赛管理员、比赛裁判可以查看到题目列表
 * - 进行中：只有系统管理员、比赛管理员、比赛裁判、比赛选手可以查看到题目列表
 * - 已结束：只要是系统管理员、比赛管理员、比赛裁判、比赛选手，或者比赛是公开的就可以查看到题目列表
 */
export async function checkContestProblemReadPermission(
  request: Request,
  contestId: number
) {
  const { status, isPublic } = await getContestInformations(contestId);

  const self = await findSessionUserOptional(request);

  const isSysAdmin = self && isAdmin(self.role);
  const { isMod, isJury, isAttendee } = self
    ? await getContestRole(contestId, self.id)
    : { isMod: false, isJury: false, isAttendee: false };

  if (
    (status === ContestStatus.PENDING && (isSysAdmin || isMod || isJury)) ||
    (status === ContestStatus.RUNNING &&
      (isSysAdmin || isMod || isJury || isAttendee)) ||
    (status === ContestStatus.ENDED &&
      (isSysAdmin || isMod || isJury || isAttendee || isPublic))
  ) {
    return;
  }

  throw new Response("您没有权限查看比赛题目", { status: 403 });
}

/**
 * 查看比赛题目提交的权限
 *
 * 只有比赛选手在比赛进行时才可以提交题目
 */
export async function checkContestProblemSubmitPermission(
  request: Request,
  contestId: number
) {
  const self = await findSessionUser(request);

  if (!isUser(self.role)) {
    throw new Response("您已被封禁", { status: 403 });
  }

  const { status } = await getContestInformations(contestId);

  if (status === ContestStatus.PENDING) {
    throw new Response("比赛还未开始", { status: 403 });
  } else if (status === ContestStatus.ENDED) {
    throw new Response("比赛已结束", { status: 403 });
  }

  const { isAttendee } = await getContestRole(contestId, self.id);

  if (!isAttendee) {
    throw new Response("您不是比赛选手", { status: 403 });
  }
}

/**
 * 检查是否有报名参加比赛的权限
 *
 * - 如果比赛未开始：必须公开并且允许公开报名
 * - 如果比赛正在进行：必须公开并且允许公开报名并且允许中途报名
 *
 * 已经报名的用户不能再报名，比赛的管理员和裁判也不能报名
 */
export async function checkContestAttendPermission(
  request: Request,
  contestId: number
) {
  const self = await findSessionUser(request);

  if (!isUser(self.role)) {
    throw new Response("您已被封禁", { status: 403 });
  }

  const { status, isPublic, allowPublicRegistration, allowAfterRegistration } =
    await getContestInformations(contestId);

  const { isAttendee, isJury, isMod } = await getContestRole(
    contestId,
    self.id
  );

  if (isAttendee) {
    throw new Response("您已经报名参加比赛", { status: 403 });
  }

  if (isJury) {
    throw new Response("您是裁判，不能报名参加比赛", { status: 403 });
  }

  if (isMod) {
    throw new Response("您是管理员，不能报名参加比赛", { status: 403 });
  }

  if (status === ContestStatus.PENDING) {
    if (!isPublic || !allowPublicRegistration) {
      throw new Response("比赛不公开报名", { status: 403 });
    }
  } else if (status === ContestStatus.RUNNING) {
    if (!isPublic || !allowPublicRegistration || !allowAfterRegistration) {
      throw new Response("比赛报名已截止", { status: 403 });
    }
  } else {
    throw new Response("比赛已经结束", { status: 403 });
  }
}

/**
 * 检查是否有创建题目的权限
 *
 * - 用户必须是系统管理员
 */
export { checkAdminPermission as checkContestCreatePermission } from "./user";
