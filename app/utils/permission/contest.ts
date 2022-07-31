import { createPermission, createTarget, isAdmin, isUser } from "../permission";
import { db } from "../server/db.server";
import { findSessionUserOptional } from "../sessions";

enum ContestStatus {
  PENDING,
  RUNNING,
  ENDED,
}

async function fetchContestInformations(
  contestId: number,
  self?: number | null
) {
  const contest = await db.contest.findUnique({
    where: { id: contestId },
    select: {
      private: true,
      beginTime: true,
      endTime: true,
      allowPublicRegistration: true,
      allowAfterRegistration: true,
      mods: { where: { id: self ?? -1 }, select: { id: true } },
      juries: { where: { id: self ?? -1 }, select: { id: true } },
      attendees: { where: { id: self ?? -1 }, select: { id: true } },
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
  const isPublic = !contest.private;
  const isMod = contest.mods.length > 0;
  const isJury = contest.juries.length > 0;
  const isAttendee = contest.attendees.length > 0;

  return {
    status,
    isPublic,
    isMod,
    isJury,
    isAttendee,
    allowPublicRegistration: contest.allowPublicRegistration,
    allowAfterRegistration: contest.allowAfterRegistration,
  };
}

const target = createTarget(async (request: Request, contestId: number) => {
  const self = await findSessionUserOptional(request);
  const contest = await fetchContestInformations(contestId, self?.id);
  return { self, contest };
});

/** 检查是否有查看比赛的权限 */
export const permissionContestRead = createPermission(
  target,
  ({ self, contest }) => {
    // 系统管理员可以看到比赛的信息
    if (isAdmin(self?.role)) return true;

    // 如果比赛是公开的，那么所有人都可以看到比赛的信息
    if (contest.isPublic) return true;

    // 否则只有比赛管理员、比赛裁判、比赛选手可以查看比赛信息
    if (contest.isAttendee || contest.isJury || contest.isMod) return true;
  }
);

/** 检查是否有修改比赛信息的权限 */
export const permissionContestWrite = createPermission(
  target,
  ({ self, contest }) => {
    // 系统管理员可以修改比赛信息
    if (isAdmin(self?.role)) return true;
    // 封禁用户什么也做不到
    if (!isUser(self?.role)) return false;

    // 比赛的管理员也可以修改信息
    if (contest.isMod) return true;
  }
);

/** 检查是否有查看比赛题目列表的权限 */
export const permissionContestProblemRead = createPermission(
  target,
  ({ self, contest }) => {
    // 系统管理员可以看到
    if (isAdmin(self?.role)) return true;

    switch (contest.status) {
      // 比赛还没有开始
      case ContestStatus.PENDING:
        // 比赛的管理员、裁判可以看到
        return contest.isMod || contest.isJury;

      // 比赛正在进行
      case ContestStatus.RUNNING:
        // 比赛的管理员、裁判、选手可以看到
        return contest.isMod || contest.isJury || contest.isAttendee;

      // 比赛已经结束
      case ContestStatus.ENDED:
        return (
          // 比赛的管理员、裁判、选手可以看到
          contest.isMod ||
          contest.isJury ||
          contest.isAttendee ||
          // 或者比赛是公开的
          contest.isPublic
        );
    }
  }
);

/** 检查比赛题目提交的权限 */
export const permissionContestProblemSubmit = createPermission(
  target,
  ({ self, contest }) => {
    return (
      // 用户没有被封禁
      isUser(self?.role) &&
      // 比赛正在进行
      contest.status === ContestStatus.RUNNING &&
      // 用户是比赛选手
      contest.isAttendee
    );
  }
);

/** 检查是否有报名参加比赛的权限 */
export const permissionContestAttend = createPermission(
  target,
  ({ self, contest }) => {
    // 用户没有被封禁
    if (!isUser(self?.role)) return false;
    // 用户不是比赛管理员、裁判和选手
    if (contest.isMod || contest.isJury || contest.isAttendee) return false;

    switch (contest.status) {
      // 比赛还没有开始
      case ContestStatus.PENDING:
        // 只有公开并允许公开报名的比赛可以报名
        return contest.isPublic && contest.allowPublicRegistration;

      // 比赛正在进行
      case ContestStatus.RUNNING:
        // 只有公开并允许中途报名的比赛可以报名
        return contest.isPublic && contest.allowAfterRegistration;

      // 比赛已经结束
      case ContestStatus.ENDED:
        // 太可惜啦，完全错过比赛了
        return false;
    }
  }
);

/**
 * 检查是否有创建比赛的权限
 *
 * 只有系统管理员可以创建比赛
 */
export { permissionAdmin as permissionContestCreate } from "./user";
