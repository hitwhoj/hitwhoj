import {
  allow,
  and,
  isAdmin,
  isSu,
  isUser,
  or,
  Permission,
} from "~/utils/permission";
import { findSessionUser } from "~/utils/sessions";

/**
 * 检查是否对用户具有写权限
 */
export const permissionUserProfileWrite = new Permission(
  async (request: Request, userId: number) => {
    return {
      self: await findSessionUser(request),
      target: userId,
    };
  },

  or(
    // 如果是系统管理员那么可以为所欲为
    ({ self }) => isAdmin(self.role),
    // 否则必须是当前用户
    and(
      // 而且不能是被封禁的用户
      ({ self }) => isUser(self.role),
      ({ self, target }) => self.id === target
    )
  )
);

/**
 * 检查是否对用户具有读权限
 */
export const permissionUserProfileRead = new Permission(
  async (_request: Request, _userId: number) => void 0,
  // 全都满足
  allow()
);

/**
 * 检查用户是否是管理员
 */
export const permissionAdmin = new Permission(
  async (request: Request) => await findSessionUser(request),
  ({ role }) => isAdmin(role)
);

/**
 * 检查用户是否是超管
 */
export const permissionSuperUser = new Permission(
  async (request: Request) => await findSessionUser(request),
  ({ role }) => isSu(role)
);
