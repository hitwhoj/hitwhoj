import { UserRole } from "@prisma/client";

import { db } from "./db.server";

export { UserRole, RolePermission };

class RolePermission {
  static ALL = -1n;
  static DEFAULT = 0n;

  /** user */
  //userSession
  static USER_SESSION_LIST_SELF = 1n << 10n;
  static USER_SESSION_LIST = 1n << 11n;
  static USER_SESSION_REMOVE = 1n << 12n;
  static USER_SESSION_SIGN_UP = 1n << 13n;
  static USER_SESSION_SIGN_IN = 1n << 14n;
  static USER_SESSION_SIGN_OUT = 1n << 15n;
  //userProfile
  static USER_PROFILE_GET_SELF = 1n << 20n;
  static USER_PROFILE_GET = 1n << 21n;
  static USER_PROFILE_MODIFY_SELF = 1n << 22n;
  static USER_PROFILE_MODIFY = 1n << 23n;
  //userFile
  static USER_FILE_LIST = 1n << 30n;
  static USER_FILE_LIST_SELF = 1n << 31n;
  static USER_FILE_UPLOAD = 1n << 32n;
  static USER_FILE_UNLINK = 1n << 33n;
  static USER_FILE_UNLINK_SELF = 1n << 34n;

  /** problem */
  //problemData
  static PROBLEM_DATA_UPLOAD = 1n << 40n;
  static PROBLEM_DATA_REMOVE = 1n << 41n;
  //problemDetail
  static PROBLEM_DETAIL_CREATE_WITH_ID = 1n << 50n;
  static PROBLEM_DETAIL_CREATE = 1n << 51n;
  static PROBLEM_DETAIL_MODIFY = 1n << 52n;
  static PROBLEM_DETAIL_GET_DETAIL = 1n << 53n;
  static PROBLEM_DETAIL_SEARCH = 1n << 54n;
  static PROBLEM_DETAIL_REMOVE = 1n << 55n;
  //problemList
  static PROBLEM_LIST_CREATE = 1n << 60n;
  static PROBLEM_LIST_MODIFY = 1n << 61n;
  static PROBLEM_LIST_REMOVE = 1n << 62n;
  static PROBLEM_LIST_GET_DETAIL = 1n << 63n;
  static PROBLEM_LIST_SEARCH = 1n << 64n;
  static PROBLEM_LIST_LIST = 1n << 65n;

  /** contest */
  //contestDetail
  static CONTEST_DETAIL_CREATE = 1n << 70n;
  static CONTEST_DETAIL_MODIFY = 1n << 71n;
}

const PermissionDict: Record<UserRole, bigint> = {
  // super user
  [UserRole.SU]: RolePermission.ALL,

  // administrator
  [UserRole.ADMIN]:
    RolePermission.DEFAULT |
    RolePermission.USER_SESSION_LIST_SELF |
    RolePermission.USER_SESSION_REMOVE |
    RolePermission.USER_SESSION_SIGN_OUT |
    RolePermission.USER_PROFILE_GET_SELF |
    RolePermission.USER_PROFILE_GET |
    RolePermission.USER_PROFILE_MODIFY_SELF |
    RolePermission.USER_PROFILE_MODIFY |
    RolePermission.USER_FILE_LIST |
    RolePermission.USER_FILE_LIST_SELF |
    RolePermission.USER_FILE_UPLOAD |
    RolePermission.USER_FILE_UNLINK |
    RolePermission.USER_FILE_UNLINK_SELF |
    RolePermission.PROBLEM_DATA_UPLOAD |
    RolePermission.PROBLEM_DATA_REMOVE |
    RolePermission.PROBLEM_DETAIL_CREATE_WITH_ID |
    RolePermission.PROBLEM_DETAIL_CREATE |
    RolePermission.PROBLEM_DETAIL_MODIFY |
    RolePermission.PROBLEM_DETAIL_GET_DETAIL |
    RolePermission.PROBLEM_DETAIL_SEARCH |
    RolePermission.PROBLEM_DETAIL_REMOVE |
    RolePermission.PROBLEM_LIST_CREATE |
    RolePermission.PROBLEM_LIST_MODIFY |
    RolePermission.PROBLEM_LIST_REMOVE |
    RolePermission.PROBLEM_LIST_GET_DETAIL |
    RolePermission.PROBLEM_LIST_SEARCH |
    RolePermission.PROBLEM_LIST_LIST |
    RolePermission.CONTEST_DETAIL_CREATE |
    RolePermission.CONTEST_DETAIL_MODIFY,

  [UserRole.USER]:
    RolePermission.DEFAULT |
    RolePermission.USER_SESSION_LIST_SELF |
    RolePermission.USER_SESSION_SIGN_OUT |
    RolePermission.USER_PROFILE_GET_SELF |
    RolePermission.USER_PROFILE_GET |
    RolePermission.USER_PROFILE_MODIFY_SELF |
    RolePermission.USER_FILE_LIST_SELF |
    RolePermission.USER_FILE_UPLOAD |
    RolePermission.USER_FILE_UNLINK_SELF |
    RolePermission.PROBLEM_DETAIL_CREATE_WITH_ID |
    RolePermission.PROBLEM_DETAIL_CREATE |
    RolePermission.PROBLEM_DETAIL_GET_DETAIL |
    RolePermission.PROBLEM_DETAIL_SEARCH |
    RolePermission.PROBLEM_LIST_CREATE |
    RolePermission.PROBLEM_LIST_GET_DETAIL |
    RolePermission.PROBLEM_LIST_SEARCH |
    RolePermission.PROBLEM_LIST_LIST,

  [UserRole.GUEST]:
    RolePermission.DEFAULT |
    RolePermission.USER_SESSION_SIGN_IN |
    RolePermission.USER_SESSION_SIGN_UP |
    RolePermission.USER_PROFILE_GET |
    RolePermission.PROBLEM_DETAIL_GET_DETAIL |
    RolePermission.PROBLEM_DETAIL_SEARCH |
    RolePermission.PROBLEM_LIST_GET_DETAIL |
    RolePermission.PROBLEM_LIST_SEARCH |
    RolePermission.PROBLEM_LIST_LIST,

  [UserRole.PROBLEM_ADMIN]:
    RolePermission.DEFAULT |
    RolePermission.PROBLEM_DATA_UPLOAD |
    RolePermission.PROBLEM_DATA_REMOVE |
    RolePermission.PROBLEM_DETAIL_MODIFY |
    RolePermission.PROBLEM_DETAIL_REMOVE,

  [UserRole.CONTEST_CREATOR]:
    RolePermission.DEFAULT | RolePermission.CONTEST_DETAIL_MODIFY,

  [UserRole.CONTEST_MOD]:
    RolePermission.DEFAULT | RolePermission.CONTEST_DETAIL_MODIFY,

  [UserRole.CONTEST_JURY]: RolePermission.DEFAULT,

  [UserRole.CONTEST_PARTICIPANT]:
    // TODO: submit code permission
    RolePermission.DEFAULT,

  [UserRole.USER_SELF]:
    RolePermission.DEFAULT | RolePermission.USER_SESSION_REMOVE,
};

export type PermissionDoc = {
  _id: string;
  roles: UserRole[];
};

export async function guaranteePermission(
  uid: number,
  permission: bigint,
  config?: {
    pid: number;
    cid: number;
    sid: string;
  }
): Promise<void> {
  const user = await db.user.findUnique({
    where: {
      uid: uid,
    },
    include: {
      roles: true,
    },
  });
  const roles = (user &&
    user.roles.length &&
    user.roles.map((r) => {
      return r.role;
    })) || [UserRole.GUEST];

  if (config?.pid) {
    roles.push(...(await getProblemRole(uid, config.pid)));
  }
  if (config?.cid) {
    roles.push(...(await getContestRole(uid, config.cid)));
  }
  if (config?.sid) {
    roles.push(...(await getSessionRole(uid, config.sid)));
  }
  console.log(roles);

  const userPermission = roles
    .map((role) => PermissionDict[role])
    .reduce((perm, rolePerm) => perm | rolePerm, 0n);

  if ((userPermission & permission) !== permission) {
    throw new Response("Permission denyed", { status: 401 });
  }
}

async function getProblemRole(uid: number, pid: number) {
  const problem = await db.problem.findUnique({
    where: {
      pid: pid,
    },
  });
  if (!problem) {
    throw new Response("Problem not found!", { status: 404 });
  }

  const roles = [];
  if (problem.uid === uid) {
    roles.push(UserRole.PROBLEM_ADMIN);
  }

  return roles;
}

async function getContestRole(uid: number, cid: number) {
  const contest = await db.contest.findUnique({
    where: {
      cid: cid,
    },
    include: {
      mods: true,
      juries: true,
      attendees: true,
    },
  });
  if (!contest) {
    throw new Response("Contest not found", { status: 404 });
  }

  const mods = contest.mods.map((m) => {
    return m.uid;
  });
  const juries = contest.juries.map((j) => {
    return j.uid;
  });
  const attendees = contest.attendees.map((a) => {
    return a.uid;
  });

  const roles = [];
  if (contest.uid === uid) {
    roles.push(UserRole.CONTEST_CREATER);
  }
  if (mods.includes(uid)) {
    roles.push(UserRole.CONTEST_MOD);
  }
  if (juries.includes()) {
    roles.push(UserRole.CONTEST_JURY);
  }
  if (attendees.includes()) {
    roles.push(UserRole.CONTEST_ATTENDEE);
  }

  return roles;
}

async function getSessionRole(uid: number, sid: string) {
  const session = await db.userSession.findUnique({
    where: {
      session: sid,
    },
  });
  //avoid infomation leak
  //also sprach eryi
  if (!session) {
    return [];
  }

  const roles = [];
  if (session.uid === uid) {
    role.push(UserRole.USER_SELF);
  }

  return roles;
}

export async function modifyRole(
  uid: number,
  roles: UserRole[]
): Promise<PermissionDoc> {}
