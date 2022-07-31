import type { SystemUserRole, TeamMemberRole } from "@prisma/client";

/**
 * 判断用户权限等级是否大于等于 User
 */
export function isUser(role: SystemUserRole | undefined) {
  return role === "User" || role === "Admin" || role === "Su";
}

/**
 * 判断用户权限等级是否大于等于 Admin
 */
export function isAdmin(role: SystemUserRole | undefined) {
  return role === "Admin" || role === "Su";
}

/**
 * 判断用户权限等级是否大于等于 Su
 */
export function isSu(role: SystemUserRole | undefined) {
  return role === "Su";
}

/**
 * 判断团队用户是否是管理员
 */
export function isTeamAdmin(role: TeamMemberRole | undefined) {
  return role === "Admin" || role === "Owner";
}

/**
 * 判断团队用户是否是所有者
 */
export function isTeamOwner(role: TeamMemberRole | undefined) {
  return role === "Owner";
}

export type Target<T extends unknown[], R> = (...args: T) => R | Promise<R>;
export type PermissionCondition<R> = (
  resource: R
) => boolean | undefined | null;
export type Permission<T extends unknown[], R> = {
  target: Target<T, R>;
  condition: PermissionCondition<R>;
};

/** A wrapper function */
export function createTarget<T extends unknown[], R>(
  fn: Target<T, R>
): Target<T, R> {
  return fn;
}

/**
 * 创建一个 Permission
 *
 * 使用 {@link assertPermission} 来断言是否具有该权限
 *
 * 使用 {@link createPermission} 来检查是否具有该权限
 */
export function createPermission<T extends unknown[], R>(
  target: Target<T, R>,
  condition: PermissionCondition<R>
): Permission<T, R> {
  return { target, condition };
}

/** 断言权限，如果权限不通过，则抛出异常 */
export async function assertPermission<T extends unknown[], R>(
  permission: Permission<T, R>,
  ...args: T
) {
  const resource = await permission.target(...args);
  if (permission.condition(resource)) {
    return resource;
  }
  throw new Response("Permission Denied", { status: 403 });
}

/** 检查是否具有权限 */
export async function checkPermission<T extends unknown[], R>(
  permission: Permission<T, R>,
  ...args: T
) {
  try {
    // target 可能会抛出异常，所以要捕获
    const resource = await permission.target(...args);
    return permission.condition(resource);
  } catch (e) {
    return false;
  }
}
