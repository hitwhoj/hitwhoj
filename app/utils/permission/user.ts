import { createPermission, isAdmin, isSu, isUser } from "~/utils/permission";
import { findSessionUser } from "~/utils/sessions";

/** 检查是否对用户具有写权限 */
export const permissionUserProfileWrite = createPermission(
  async (request: Request, userId: number) => {
    return {
      self: await findSessionUser(request),
      target: userId,
    };
  },
  ({ self, target }) => {
    // 如果是系统管理员那么可以为所欲为
    if (isAdmin(self.role)) return true;
    // 如果是封禁用户那么什么都做不到
    if (!isUser(self.role)) return false;
    // 自己可以修改自己的资料
    if (self.id === target) return true;
  }
);

/** 检查是否对用户具有读权限 */
export const permissionUserProfileRead = createPermission(
  async (_request: Request, _userId: number) => void 0,
  // 全都满足
  () => true
);

/** 检查用户是否是管理员 */
export const permissionAdmin = createPermission(
  async (request: Request) => await findSessionUser(request),
  ({ role }) => isAdmin(role)
);

/** 检查用户是否是超管 */
export const permissionSuperUser = createPermission(
  async (request: Request) => await findSessionUser(request),
  ({ role }) => isSu(role)
);
