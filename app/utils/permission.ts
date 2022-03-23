import { SystemUserRole } from "@prisma/client";

import { db } from "./db.server";
import { findSessionUid } from "./sessions";

let count = 0n;

function perm() {
  return 1n << count++;
}

export const Permissions = {
  ALL: -1n,
  DEFAULT: 0n,

  USER_SESSION_CHECK: perm(),
  USER_SESSION_DELETE: perm(),
  USER_SESSION_SIGN_UP: perm(),
  USER_SESSION_SIGN_IN: perm(),

  USER_PROFILE_CHECK: perm(),
  USER_PROFILE_MODIFY: perm(),

  USER_FILE_CHECK: perm(),
  USER_FILE_UPLOAD: perm(),
  USER_FILE_DELETE: perm(),
  USER_FILE_DOWNLOAD_PUBLIC: perm(),
  USER_FILE_DOWNLOAD_PRIVATE: perm(),
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
    Permissions.USER_PROFILE_CHECK |
    Permissions.USER_PROFILE_MODIFY |
    Permissions.USER_FILE_CHECK |
    Permissions.USER_FILE_DELETE |
    Permissions.USER_FILE_DOWNLOAD_PUBLIC |
    Permissions.USER_FILE_DOWNLOAD_PRIVATE,

  // 普通用户的权限
  [SystemUserRole.User]:
    Permissions.DEFAULT |
    Permissions.USER_PROFILE_CHECK |
    Permissions.USER_FILE_DOWNLOAD_PUBLIC,

  // 访客权限
  [SystemUserRole.Guest]:
    Permissions.DEFAULT |
    Permissions.USER_SESSION_SIGN_IN |
    Permissions.USER_SESSION_SIGN_UP |
    Permissions.USER_PROFILE_CHECK |
    Permissions.USER_FILE_DOWNLOAD_PUBLIC,

  // 用户自己
  [CustomUserRole.UserSelf]:
    Permissions.DEFAULT |
    Permissions.USER_SESSION_CHECK |
    Permissions.USER_SESSION_DELETE |
    Permissions.USER_PROFILE_CHECK |
    Permissions.USER_PROFILE_MODIFY |
    Permissions.USER_FILE_CHECK |
    Permissions.USER_FILE_UPLOAD |
    Permissions.USER_FILE_DELETE |
    Permissions.USER_FILE_DOWNLOAD_PUBLIC |
    Permissions.USER_FILE_DOWNLOAD_PRIVATE,
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
): Promise<void> {
  const roles: UserRole[] = [];

  const uid = await findSessionUid(request);

  // 用户自身系统权限
  if (uid) {
    const user = await db.user.findUnique({
      where: { uid },
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
  if (info?.uid === uid) {
    roles.push(CustomUserRole.UserSelf);
  }

  const userPermission = roles
    .map((role) => PermissionDict[role])
    .reduce((perm, rolePerm) => perm | rolePerm, 0n);

  if ((userPermission & permission) !== permission) {
    throw new Response("Permission denied", { status: 403 });
  }
}
