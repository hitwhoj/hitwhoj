import type { SystemUserRole, TeamMemberRole } from "@prisma/client";

/**
 * 判断用户权限等级是否大于等于 User
 */
export function isUser(role: SystemUserRole) {
  return role === "User" || role === "Admin" || role === "Su";
}

/**
 * 判断用户权限等级是否大于等于 Admin
 */
export function isAdmin(role: SystemUserRole) {
  return role === "Admin" || role === "Su";
}

/**
 * 判断团队用户是否是管理员
 */
export function isTeamAdmin(role: TeamMemberRole) {
  return role === "Admin" || role === "Owner";
}
