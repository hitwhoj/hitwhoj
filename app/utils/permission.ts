import { SystemUserRole } from "@prisma/client";
import { redirect } from "remix";

import { db } from "./db.server";
import { findSessionUid } from "./sessions";

let count = 0n;

function perm() {
  return 1n << count++;
}

export const Permissions = {
  ALL: -1n,
  DEFAULT: 0n,

  User: {
    Register: perm(),
    Session: {
      View: perm(),
      Create: perm(),
      Delete: perm(),
    },
    Profile: {
      View: perm(),
      Update: perm(),
    },
    File: {
      View: perm(),
      Create: perm(),
      Update: perm(),
      Delete: perm(),
      DownloadPublic: perm(),
      DownloadPrivate: perm(),
    },
  },
};

enum CustomUserRole {
  UserSelf = "UserSelf",
}

type UserRole = SystemUserRole | CustomUserRole;

const PermissionDict: Record<UserRole, bigint> = {
  // 超级用户
  [SystemUserRole.Su]: Permissions.ALL,

  // 网站管理员
  [SystemUserRole.Admin]:
    Permissions.DEFAULT |
    Permissions.User.Profile.View |
    Permissions.User.Profile.Update |
    Permissions.User.File.View |
    Permissions.User.File.Update |
    Permissions.User.File.Delete |
    Permissions.User.File.DownloadPublic |
    Permissions.User.File.DownloadPrivate,

  // 普通用户的权限
  [SystemUserRole.User]:
    Permissions.DEFAULT |
    Permissions.User.Profile.View |
    Permissions.User.File.DownloadPublic,

  // 访客权限
  [SystemUserRole.Guest]:
    Permissions.DEFAULT |
    Permissions.User.Register |
    Permissions.User.Session.Create |
    Permissions.User.Profile.View |
    Permissions.User.File.DownloadPublic,

  // 用户自己
  [CustomUserRole.UserSelf]:
    Permissions.DEFAULT |
    Permissions.User.Session.View |
    Permissions.User.Session.Delete |
    Permissions.User.Profile.View |
    Permissions.User.Profile.Update |
    Permissions.User.File.View |
    Permissions.User.File.Create |
    Permissions.User.File.Update |
    Permissions.User.File.Delete |
    Permissions.User.File.DownloadPublic |
    Permissions.User.File.DownloadPrivate,
};

export type GuaranteePermissionInfo = {
  /**
   * 目标用户 ID
   */
  uid?: number;
  /**
   * 目标题目 ID
   */
  pid?: number;
  /**
   * 目标比赛 ID
   */
  cid?: number;
  /**
   * 目标评测 ID
   */
  rid?: number;
  /**
   * 目标文件 ID
   */
  fid?: string;
};

/**
 * 检查当前登录的用户是否有相应的权限
 *
 * 如果有，则返回当前登录的用户 ID，否则抛出 403 Response
 *
 * @param request 当前请求
 * @param permission 权限
 * @param info 附加的限定信息
 */
export async function guaranteePermission(
  request: Request,
  permission: bigint,
  info?: GuaranteePermissionInfo
) {
  const roles: UserRole[] = [];

  const self = await findSessionUid(request);

  // 用户自身系统权限
  if (self) {
    const user = await db.user.findUnique({
      where: { uid: self },
      select: { role: true },
    });

    if (!user) {
      throw new Response("User not found", { status: 500 });
    }

    roles.push(user.role);
  } else {
    roles.push(SystemUserRole.Guest);
  }

  // 用户对自身操作权限
  if (info?.uid === self) {
    roles.push(CustomUserRole.UserSelf);
  }

  const userPermission = roles
    .map((role) => PermissionDict[role])
    .reduce((perm, rolePerm) => perm | rolePerm, 0n);

  if ((userPermission & permission) !== permission) {
    // 没有权限
    if (!self) {
      // 如果没有登录，则跳转到登录页面
      throw redirect(`/login?redirect=${new URL(request.url).pathname}`);
    }

    // 否则抛出 403
    throw new Response("Permission denied", { status: 403 });
  }

  return self;
}
