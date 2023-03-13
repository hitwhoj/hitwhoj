/**
 * 系统用户的权限
 *
 * [Root, Admin, User, Guest]
 */
export class UserPermission {
  constructor(
    readonly root: boolean,
    readonly admin: boolean,
    readonly user: boolean,
    readonly guest: boolean
  ) {}

  static Everyone = new UserPermission(true, true, true, true);
  static Users = new UserPermission(true, true, true, false);
  static Admins = new UserPermission(true, true, false, false);
  static Roots = new UserPermission(true, false, false, false);
  static Nobody = new UserPermission(false, false, false, false);
}
