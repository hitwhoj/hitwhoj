import { SystemUserRole } from "@prisma/client";

import { db } from "./db.server";

let count = 0n;

function perm() {
  return 1n << count++;
}

export const Permissions = {
  ALL: -1n,
  DEFAULT: 0n,

  USER_SESSION_LIST: perm(),
  USER_SESSION_REMOVE: perm(),
  USER_SESSION_SIGN_UP: perm(),
  USER_SESSION_SIGN_IN: perm(),

  USER_PROFILE_GET: perm(),
  USER_PROFILE_MODIFY: perm(),

  USER_FILE_LIST: perm(),
  USER_FILE_UPLOAD: perm(),
  USER_FILE_UNLINK: perm(),
  USER_FILE_DOWNLOAD: perm(),

  PROBLEM_GET: perm(),
  PROBLEM_LIST: perm(),
  PROBLEM_CREATE: perm(),
  PROBLEM_MODIFY: perm(),
  PROBLEM_REMOVE: perm(),
  PROBLEM_SEARCH: perm(),

  PROBLEM_SUBMIT: perm(),

  PROBLEM_DATA_UPLOAD: perm(),
  PROBLEM_DATA_REMOVE: perm(),
  PROBLEM_DATA_DOWNLOAD: perm(),
  PROBLEM_FILE_UPLOAD: perm(),
  PROBLEM_FILE_REMOVE: perm(),
  PROBLEM_FILE_DOWNLOAD: perm(),

  PROBLEM_SET_GET: perm(),
  PROBLEM_SET_LIST: perm(),
  PROBLEM_SET_CREATE: perm(),
  PROBLEM_SET_MODIFY: perm(),
  PROBLEM_SET_REMOVE: perm(),
  PROBLEM_SET_SEARCH: perm(),

  CONTEST_GET: perm(),
  CONTEST_LIST: perm(),
  CONTEST_CREATE: perm(),
  CONTEST_MODIFY: perm(),
  CONTEST_REMOVE: perm(),
  CONTEST_SEARCH: perm(),

  CONTEST_PROBLEM_GET: perm(),
  CONTEST_PROBLEM_LIST: perm(),
  CONTEST_PROBLEM_SUBMIT: perm(),

  RECORD_GET: perm(),
  RECORD_LIST: perm(),
  RECORD_VIEW_CODE: perm(),
};

enum CustomUserRole {
  UserSelf = "UserSelf",

  ProblemAdmin = "ProblemAdmin",

  ContestAdmin = "ContestAdmin",
  ContestMod = "ContestMod",
  ContestJury = "ContestJury",
  ContestAttendee = "ContestAttendee",
}

type UserRole = SystemUserRole | CustomUserRole;

const PermissionDict: Record<UserRole, bigint> = {
  // 超级用户
  [SystemUserRole.Su]: Permissions.ALL,

  // 网站管理员比普通用户多的权限
  [SystemUserRole.Admin]:
    Permissions.DEFAULT |
    Permissions.USER_SESSION_LIST |
    Permissions.USER_SESSION_REMOVE |
    Permissions.USER_PROFILE_GET |
    Permissions.USER_PROFILE_MODIFY |
    Permissions.USER_FILE_LIST |
    Permissions.USER_FILE_UNLINK |
    Permissions.USER_FILE_DOWNLOAD |
    Permissions.PROBLEM_GET |
    Permissions.PROBLEM_LIST |
    Permissions.PROBLEM_CREATE |
    Permissions.PROBLEM_MODIFY |
    Permissions.PROBLEM_REMOVE |
    Permissions.PROBLEM_SEARCH |
    Permissions.PROBLEM_DATA_UPLOAD |
    Permissions.PROBLEM_DATA_REMOVE |
    Permissions.PROBLEM_DATA_DOWNLOAD |
    Permissions.PROBLEM_FILE_UPLOAD |
    Permissions.PROBLEM_FILE_REMOVE |
    Permissions.PROBLEM_FILE_DOWNLOAD |
    Permissions.PROBLEM_SET_GET |
    Permissions.PROBLEM_SET_LIST |
    Permissions.PROBLEM_SET_CREATE |
    Permissions.PROBLEM_SET_MODIFY |
    Permissions.PROBLEM_SET_REMOVE |
    Permissions.PROBLEM_SET_SEARCH |
    Permissions.CONTEST_GET |
    Permissions.CONTEST_LIST |
    Permissions.CONTEST_CREATE |
    Permissions.CONTEST_MODIFY |
    Permissions.CONTEST_REMOVE |
    Permissions.CONTEST_SEARCH |
    Permissions.CONTEST_PROBLEM_GET |
    Permissions.CONTEST_PROBLEM_LIST |
    Permissions.RECORD_GET |
    Permissions.RECORD_LIST |
    Permissions.RECORD_VIEW_CODE,

  // 普通用户的权限
  [SystemUserRole.User]:
    Permissions.DEFAULT |
    Permissions.USER_PROFILE_GET |
    Permissions.USER_FILE_DOWNLOAD |
    Permissions.PROBLEM_GET |
    Permissions.PROBLEM_LIST |
    Permissions.PROBLEM_SEARCH |
    Permissions.PROBLEM_FILE_DOWNLOAD |
    Permissions.PROBLEM_SET_GET |
    Permissions.PROBLEM_SET_LIST |
    Permissions.PROBLEM_SET_SEARCH |
    Permissions.CONTEST_GET |
    Permissions.CONTEST_LIST |
    Permissions.CONTEST_SEARCH |
    Permissions.RECORD_GET |
    Permissions.RECORD_LIST,

  // 访客权限
  [SystemUserRole.Guest]:
    Permissions.DEFAULT |
    Permissions.USER_SESSION_SIGN_UP |
    Permissions.USER_SESSION_SIGN_IN |
    Permissions.USER_PROFILE_GET |
    Permissions.USER_FILE_DOWNLOAD |
    Permissions.PROBLEM_GET |
    Permissions.PROBLEM_LIST |
    Permissions.PROBLEM_SEARCH |
    Permissions.PROBLEM_FILE_DOWNLOAD |
    Permissions.PROBLEM_SET_GET |
    Permissions.PROBLEM_SET_LIST |
    Permissions.PROBLEM_SET_SEARCH |
    Permissions.CONTEST_GET |
    Permissions.CONTEST_LIST |
    Permissions.CONTEST_SEARCH |
    Permissions.RECORD_GET |
    Permissions.RECORD_LIST,

  // 题目管理员
  [CustomUserRole.ProblemAdmin]:
    Permissions.DEFAULT |
    Permissions.PROBLEM_MODIFY |
    Permissions.PROBLEM_REMOVE |
    Permissions.PROBLEM_DATA_UPLOAD |
    Permissions.PROBLEM_DATA_REMOVE |
    Permissions.PROBLEM_DATA_DOWNLOAD |
    Permissions.PROBLEM_FILE_UPLOAD |
    Permissions.PROBLEM_FILE_REMOVE |
    Permissions.PROBLEM_FILE_DOWNLOAD |
    Permissions.RECORD_VIEW_CODE,

  // 比赛管理员
  [CustomUserRole.ContestAdmin]:
    Permissions.DEFAULT |
    Permissions.CONTEST_MODIFY |
    Permissions.CONTEST_REMOVE |
    Permissions.CONTEST_PROBLEM_GET |
    Permissions.CONTEST_PROBLEM_LIST |
    Permissions.RECORD_VIEW_CODE,

  // 比赛负责人
  [CustomUserRole.ContestMod]:
    Permissions.DEFAULT |
    Permissions.CONTEST_MODIFY |
    Permissions.CONTEST_REMOVE |
    Permissions.CONTEST_PROBLEM_GET |
    Permissions.CONTEST_PROBLEM_LIST |
    Permissions.RECORD_VIEW_CODE,

  // 比赛裁判（负责赛事答疑）
  [CustomUserRole.ContestJury]:
    Permissions.DEFAULT |
    Permissions.CONTEST_PROBLEM_GET |
    Permissions.CONTEST_PROBLEM_LIST,

  // 比赛参赛者
  [CustomUserRole.ContestAttendee]:
    Permissions.DEFAULT |
    Permissions.CONTEST_PROBLEM_GET |
    Permissions.CONTEST_PROBLEM_LIST |
    Permissions.CONTEST_PROBLEM_SUBMIT,

  // 已登录用户
  [CustomUserRole.UserSelf]:
    Permissions.DEFAULT |
    Permissions.USER_FILE_LIST |
    Permissions.USER_FILE_UPLOAD |
    Permissions.USER_FILE_UNLINK |
    Permissions.USER_FILE_DOWNLOAD |
    Permissions.PROBLEM_SUBMIT,
};

// FIXME: 需要重新设计
export async function guaranteePermission(
  permission: bigint,
  config?: {
    uid: number;
    pid: number;
    cid: number;
    rid: number;
  }
): Promise<void> {
  const roles: UserRole[] = [];

  if (config?.uid) {
    const user = await db.user.findUnique({
      where: { uid: config.uid },
      select: { role: true },
    });

    if (!user) {
      throw new Response("Permission: User not found", { status: 404 });
    }

    roles.push(user.role);
  } else {
    roles.push(SystemUserRole.Guest);
  }

  if (config?.uid && config?.pid) {
    roles.push(...(await getProblemRoles(config.uid, config.pid)));
  }
  if (config?.uid && config?.cid) {
    roles.push(...(await getContestRoles(config.uid, config.cid)));
  }
  if (config?.uid && config?.rid) {
    roles.push(...(await getRecordRoles(config.uid, config.rid)));
  }

  const userPermission = roles
    .map((role) => PermissionDict[role])
    .reduce((perm, rolePerm) => perm | rolePerm, 0n);

  if ((userPermission & permission) !== permission) {
    throw new Response("Permission denied", { status: 403 });
  }
}

export async function getProblemRoles(uid: number, pid: number) {
  const problem = await db.problem.findUnique({
    where: { pid },
    select: { uid: true },
  });

  if (!problem) {
    throw new Response("Permissions: Problem not found", { status: 404 });
  }

  const roles: UserRole[] = [];

  if (problem.uid === uid) {
    roles.push(CustomUserRole.ProblemAdmin);
  }

  return roles;
}

export async function getContestRoles(uid: number, cid: number) {
  const contest = await db.contest.findUnique({
    where: { cid },
    select: {
      user: { select: { uid: true } },
      mods: { select: { uid: true } },
      juries: { select: { uid: true } },
      attendees: { select: { uid: true } },
    },
  });

  if (!contest) {
    throw new Response("Permissions: Contest not found", { status: 404 });
  }

  const roles: UserRole[] = [];

  if (contest.user.uid === uid) {
    roles.push(CustomUserRole.ContestAdmin);
  }
  if (contest.mods.map(({ uid }) => uid).includes(uid)) {
    roles.push(CustomUserRole.ContestMod);
  }
  if (contest.juries.map(({ uid }) => uid).includes(uid)) {
    roles.push(CustomUserRole.ContestJury);
  }
  if (contest.attendees.map(({ uid }) => uid).includes(uid)) {
    roles.push(CustomUserRole.ContestAttendee);
  }

  return roles;
}

export async function getRecordRoles(uid: number, rid: number) {
  const record = await db.record.findUnique({
    where: { rid },
    select: { uid: true },
  });

  if (!record) {
    throw new Response("Permissions: Record not found", { status: 404 });
  }

  // avoid infomation leak
  // also sprach eryi
  const roles: UserRole[] = [];

  if (record.uid === uid) {
    roles.push(CustomUserRole.UserSelf);
  }

  return roles;
}
