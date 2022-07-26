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

type PermissionCondition<R> = (resource: R) => boolean | undefined | null;

export class Permission<T extends any[], R> {
  constructor(
    private proxy: (...t: T) => Promise<R>,
    private condition: PermissionCondition<R>
  ) {}

  async check(...t: T) {
    try {
      const resource = await this.proxy(...t);
      return Boolean(this.condition(resource));
    } catch (e) {
      return false;
    }
  }

  async ensure(...t: T) {
    if (!(await this.check(...t))) {
      throw new Response("权限不足", { status: 403 });
    }
  }
}

export const or =
  <T>(...conditions: PermissionCondition<T>[]) =>
  (resource: T) =>
    conditions.some((condition) => condition(resource));

export const and =
  <T>(...conditions: PermissionCondition<T>[]) =>
  (resource: T) =>
    conditions.every((condition) => condition(resource));

export const not =
  <T>(condition: PermissionCondition<T>) =>
  (resource: T) =>
    !condition(resource);

export const allow =
  <T>() =>
  (_resource: T) =>
    true;

export const deny =
  <T>() =>
  (_resource: T) =>
    false;
