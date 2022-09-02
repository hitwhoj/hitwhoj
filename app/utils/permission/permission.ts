import { UserPermission } from "./permission/user";
import { TeamPermission } from "./permission/team";
import { ContestPermission } from "./permission/contest";
import { ChatRoomPermission } from "./permission/room";

export const Permissions = {
  /** 查看任意用户的资料 */
  PERM_VIEW_USER_PROFILE: UserPermission.Everyone,
  /** 查看用户自己的资料 */
  PERM_VIEW_USER_PROFILE_SELF: UserPermission.Everyone,
  /** 修改任意用户的资料 */
  PERM_EDIT_USER_PROFILE: UserPermission.Admins,
  /** 修改用户自己的资料 */
  PERM_EDIT_USER_PROFILE_SELF: UserPermission.Users,
  /** 修改任意用户的权力 */
  PERM_EDIT_USER_PRIVILEGE: UserPermission.Admins,
  /** 修改任意用户的角色 */
  PERM_EDIT_USER_ROLE: UserPermission.Roots,

  /** 查看用户自己的私信 */
  PERM_VIEW_USER_PM_SELF: UserPermission.Everyone,
  /** 用户发送私信 */
  PERM_SEND_USER_PM: UserPermission.Users,

  /** 查看讨论组消息 */
  PERM_VIEW_CHATROOM_MESSAGE: ChatRoomPermission.Members.with(
    UserPermission.Admins
  ),
  /** 发送讨论组消息 */
  PERM_SEND_CHATROOM_MESSAGE: ChatRoomPermission.Members.with(
    UserPermission.Admins
  ),
  /** 加入讨论组 */
  PERM_JOIN_CHATROOM_MESSAGE: ChatRoomPermission.GuestOnly.with(
    UserPermission.Nobody
  ),
  /** 退出讨论组 */
  PERM_QUIT_CHATROOM_MESSAGE: ChatRoomPermission.Members.with(
    UserPermission.Nobody
  ),

  /** 添加题目 */
  PERM_CREATE_PROBLEM: TeamPermission.Admins.with(UserPermission.Admins),
  /** 查看所有题目 */
  PERM_VIEW_PROBLEM: TeamPermission.Admins.with(UserPermission.Admins),
  /** 查看公开的题目 */
  PERM_VIEW_PROBLEM_PUBLIC: TeamPermission.Everyone.with(
    UserPermission.Everyone
  ),
  /** 编辑任意题目 */
  PERM_EDIT_PROBLEM: TeamPermission.Admins.with(UserPermission.Admins),

  /** 添加题单 */
  PERM_CREATE_PROBLEM_SET: TeamPermission.Admins.with(UserPermission.Admins),
  /** 查看所有题单 */
  PERM_VIEW_PROBLEM_SET: TeamPermission.Admins.with(UserPermission.Admins),
  /** 查看公开的题单 */
  PERM_VIEW_PROBLEM_SET_PUBLIC: TeamPermission.Everyone.with(
    UserPermission.Everyone
  ),
  /** 编辑任意题单 */
  PERM_EDIT_PROBLEM_SET: TeamPermission.Admins.with(UserPermission.Admins),

  /** 添加比赛 */
  PERM_CREATE_CONTEST: TeamPermission.Admins.with(UserPermission.Admins),
  /** 全部のコンテストを見られる */
  PERM_VIEW_CONTEST: ContestPermission.Contestants.with(
    TeamPermission.Admins.with(UserPermission.Admins)
  ),
  /** 公開のコンテストを見られる */
  PERM_VIEW_CONTEST_PUBLIC: ContestPermission.Everyone.with(
    TeamPermission.Everyone.with(UserPermission.Everyone)
  ),
  /** 在比赛开始前查看比赛的题目内容 */
  PERM_VIEW_CONTEST_PROBLEMS_BEFORE: ContestPermission.Juries.with(
    TeamPermission.Admins.with(UserPermission.Admins)
  ),
  /** 在比赛进行中查看比赛的题目内容 */
  PERM_VIEW_CONTEST_PROBLEMS_DURING: ContestPermission.Contestants.with(
    TeamPermission.Admins.with(UserPermission.Admins)
  ),
  /** 在比赛结束后查看比赛的题目内容 */
  PERM_VIEW_CONTEST_PROBLEMS_AFTER: ContestPermission.Everyone.with(
    TeamPermission.Everyone.with(UserPermission.Everyone)
  ),
  /** 修改比赛 */
  PERM_EDIT_CONTEST: ContestPermission.Mods.with(
    TeamPermission.Admins.with(UserPermission.Admins)
  ),

  /** 查看任意提交的代码 */
  PERM_VIEW_RECORD: ContestPermission.Juries.with(
    TeamPermission.Admins.with(UserPermission.Admins)
  ),
  /** 查看自己提交的代码 */
  PERM_VIEW_RECORD_SELF: ContestPermission.Everyone.with(
    TeamPermission.Everyone.with(UserPermission.Everyone)
  ),

  /** 创建团队的权限 */
  PERM_TEAM_CREATE: UserPermission.Users,
  /** 团队修改成员的角色 */
  PERM_TEAM_EDIT_MEMBER_ROLE: TeamPermission.Owners.with(UserPermission.Admins),
  /** 查看团队内部信息 */
  PERM_TEAM_VIEW_INTERNAL: TeamPermission.Members.with(UserPermission.Admins),
  /** 修改团队内部信息 */
  PERM_TEAM_EDIT_INTERNAL: TeamPermission.Admins.with(UserPermission.Admins),
  /** 踢出管理员 */
  PERM_TEAM_KICK_ADMIN: TeamPermission.Owners.with(UserPermission.Admins),
  /** 踢出普通成员 */
  PERM_TEAM_KICK_MEMBER: TeamPermission.Admins.with(UserPermission.Admins),
  /** 管理员直接邀请其他成员加入 */
  PERM_TEAM_INVITE_ADMIN: TeamPermission.Admins.with(UserPermission.Admins),
  /** 团队成员直接邀请其他成员加入 */
  PERM_TEAM_INVITE_MEMBER: TeamPermission.Members.with(UserPermission.Admins),
};
