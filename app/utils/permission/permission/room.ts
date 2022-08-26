import { UserPermission } from "./user";

/**
 * 团队中用户的权限
 *
 * [Owner, Admin, Member, Guest]
 */
export class ChatRoomPermission {
  constructor(
    readonly owner: boolean,
    readonly admin: boolean,
    readonly member: boolean,
    readonly guest: boolean,
    readonly fallback = UserPermission.Admins
  ) {}

  with(fallback: UserPermission) {
    return new ChatRoomPermission(
      this.owner,
      this.admin,
      this.member,
      this.guest,
      fallback
    );
  }

  static Everyone = new ChatRoomPermission(true, true, true, true);
  static Members = new ChatRoomPermission(true, true, true, false);
  static Admins = new ChatRoomPermission(true, true, false, false);
  static Owners = new ChatRoomPermission(true, false, false, false);
  static Nobody = new ChatRoomPermission(false, false, false, false);

  static GuestOnly = new ChatRoomPermission(false, false, false, true);
  static MemberOnly = new ChatRoomPermission(false, false, true, false);
  static AdminOnly = new ChatRoomPermission(false, true, false, false);
  static OwnerOnly = new ChatRoomPermission(true, false, false, false);
}
