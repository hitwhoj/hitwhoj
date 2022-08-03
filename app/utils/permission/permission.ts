import { UserPermission } from "./permission/user";
import { TeamPermission } from "./permission/team";
import { ContestPermission } from "./permission/contest";

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

  /** 团队修改任意成员的角色 */
  PERM_TEAM_EDIT_MEMBER_ROLE: TeamPermission.Owners.with(UserPermission.Admins),
};
