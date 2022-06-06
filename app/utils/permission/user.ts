import { isAdmin, isUser } from "~/utils/permission";
import { findSessionUser, findSessionUserOptional } from "~/utils/sessions";

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

  if (isAdmin(role) || self === target) return;

  throw new Response("权限不足", { status: 403 });
}

/**
 * 检查是否对用户具有读权限
 *
 * 必须满足以下条件之一：
 *
 * - 当前是访客
 * - 当前用户没有被封禁
 */
export async function checkUserReadPermission(request: Request) {
  const self = await findSessionUserOptional(request);

  if (!self || isUser(self.role)) return;

  throw new Response("权限不足", { status: 403 });
}
