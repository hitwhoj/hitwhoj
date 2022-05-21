import type { SystemUserRole } from "@prisma/client";

export function isUser(role: SystemUserRole) {
  return role === "User" || role === "Admin" || role === "Su";
}

export function isAdmin(role: SystemUserRole) {
  return role === "Admin" || role === "Su";
}
