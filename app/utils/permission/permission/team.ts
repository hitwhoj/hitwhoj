import { UserPermission } from "./user";

/**
 * 团队中用户的权限
 *
 * [Owner, Admin, Member, Guest]
 */
export class TeamPermission {
  constructor(
    readonly owner: boolean,
    readonly admin: boolean,
    readonly member: boolean,
    readonly guest: boolean,
    readonly fallback = UserPermission.Admins
  ) {}

  with(fallback: UserPermission) {
    return new TeamPermission(
      this.owner,
      this.admin,
      this.member,
      this.guest,
      fallback
    );
  }

  static Everyone = new TeamPermission(true, true, true, true);
  static Members = new TeamPermission(true, true, true, false);
  static Admins = new TeamPermission(true, true, false, false);
  static Owners = new TeamPermission(true, false, false, false);
  static Nobody = new TeamPermission(false, false, false, false);
}
