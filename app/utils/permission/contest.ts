import { isAdmin, isUser, Permission, or, and } from "../permission";
import { db } from "../server/db.server";
import { findSessionUser, findSessionUserOptional } from "../sessions";

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

/**
 * 检查是否有查看比赛信息的权限
 */
export const permissionContestInfoRead = new Permission(
  async (request: Request, contestId: number) => {
    const self = await findSessionUserOptional(request);
    const contest = await fetchContestInformations(contestId, self?.id);
    return { self, contest };
  },

  or(
    // 如果比赛是公开的，那么所有人都可以看到比赛的信息
    ({ contest }) => contest.isPublic,
    // 系统管理员也可以看到比赛的信息
    ({ self }) => isAdmin(self?.role),
    // 否则只有比赛管理员、比赛裁判、比赛选手可以查看比赛信息
    ({ contest }) => contest.isAttendee || contest.isJury || contest.isMod
  )
);

/**
 * 检查是否有修改比赛信息的权限
 */
export const permissionContestInfoWrite = new Permission(
  async (request: Request, contestId: number) => {
    const self = await findSessionUser(request);
    const contest = await fetchContestInformations(contestId, self.id);
    return { self, contest };
  },

  or(
    // 系统管理员可以修改比赛信息
    ({ self }) => isAdmin(self.role),
    and(
      // 用户没有被封禁
      ({ self }) => isUser(self.role),
      // 比赛管理员可以修改比赛信息
      ({ contest }) => contest.isMod
    )
  )
);

/**
 * 检查是否有查看比赛题目列表的权限
 */
export const permissionContestProblemRead = new Permission(
  async (request: Request, contestId: number) => {
    const self = await findSessionUserOptional(request);
    const contest = await fetchContestInformations(contestId, self?.id);
    return { self, contest };
  },

  or(
    and(
      // 比赛还没有开始
      ({ contest }) => contest.status === ContestStatus.PENDING,
      // 只有系统管理员、比赛管理员、比赛裁判可以看到题目
      or(
        ({ self }) => isAdmin(self?.role),
        ({ contest }) => contest.isMod || contest.isJury
      )
    ),
    and(
      // 比赛正在进行
      ({ contest }) => contest.status === ContestStatus.RUNNING,
      // 只有系统管理员、比赛管理员、比赛裁判、比赛选手可以看到题目
      or(
        ({ self }) => isAdmin(self?.role),
        ({ contest }) => contest.isMod || contest.isJury || contest.isAttendee
      )
    ),
    and(
      // 比赛已结束
      ({ contest }) => contest.status === ContestStatus.ENDED,
      // 只有系统管理员、比赛管理员、比赛裁判、比赛选手，或者比赛是公开的就可以查看到题目
      or(
        ({ contest }) => contest.isPublic,
        ({ self }) => isAdmin(self?.role),
        ({ contest }) => contest.isMod || contest.isJury || contest.isAttendee
      )
    )
  )
);

/**
 * 检查比赛题目提交的权限
 */
export const permissionContestProblemSubmit = new Permission(
  async (request: Request, contestId: number) => {
    const self = await findSessionUser(request);
    const contest = await fetchContestInformations(contestId, self.id);
    return { self, contest };
  },

  and(
    // 用户没有被封禁
    ({ self }) => isUser(self.role),
    // 比赛正在进行
    ({ contest }) => contest.status === ContestStatus.RUNNING,
    // 用户是比赛选手
    ({ contest }) => contest.isAttendee
  )
);

/**
 * 检查是否有报名参加比赛的权限
 *
 * - 如果比赛未开始：必须公开并且允许公开报名
 * - 如果比赛正在进行：必须公开并且允许公开报名并且允许中途报名
 *
 * 已经报名的用户不能再报名，比赛的管理员和裁判也不能报名
 */
export const permissionContestAttend = new Permission(
  async (request: Request, contestId: number) => {
    const self = await findSessionUser(request);
    const contest = await fetchContestInformations(contestId, self.id);
    return { self, contest };
  },

  and(
    // 用户没有被封禁
    ({ self }) => isUser(self.role),
    // 用户不是比赛管理员、裁判和选手
    ({ contest }) => !contest.isMod && !contest.isJury && !contest.isAttendee,
    // 比赛允许报名
    or(
      and(
        // 比赛还没有开始
        ({ contest }) => contest.status === ContestStatus.PENDING,
        ({ contest }) => contest.isPublic && contest.allowPublicRegistration
      ),
      and(
        // 比赛正在进行
        ({ contest }) => contest.status === ContestStatus.RUNNING,
        ({ contest }) =>
          contest.isPublic &&
          contest.allowPublicRegistration &&
          contest.allowAfterRegistration
      )
    )
  )
);

/**
 * 检查是否有创建题目的权限
 */
export { permissionAdmin as permissionContestCreate } from "./user";
