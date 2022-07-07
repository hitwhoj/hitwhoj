import { isAdmin, isUser } from "~/utils/permission";
import { findSessionUser } from "~/utils/sessions";

/**
 * 检查是否对用户具有写权限
 *
 * 必须满足以下条件之一：
 *
 * - 当前用户是管理员
 * - 目标用户是当前用户
 */
export async function checkUserWritePermission(
  request: Request,
  target: number
) {
  const { id: self, role } = await findSessionUser(request);

  if (isAdmin(role) || (isUser(role) && self === target)) return;

  throw new Response("权限不足", { status: 403 });
}

/**
 * 检查是否对用户具有读权限
 *
 * 全都满足
 */
export async function checkUserReadPermission(
  _request: Request,
  _target: number
) {
  return true;
}

/**
 * 检查用户是否是管理员
 */
export async function checkAdminPermission(request: Request) {
  const { role } = await findSessionUser(request);

  if (isAdmin(role)) return;

  throw new Response("权限不足", { status: 403 });
}

/**
 * 检查用户是否是超级管理员
 */
export async function checkSuperUserPermission(request: Request) {
  const { role } = await findSessionUser(request);

  if (role === "Su") return;

  throw new Response("权限不足", { status: 403 });
}
