/**
 * 用户的权力
 *
 * 注意：权力跟着用户走
 */
export type Privilege = number;

export const Privileges = {
  /** 可以执行登录操作 */
  PRIV_LOGIN: 1 << 0,
  /** 可以进行写操作 */
  PRIV_OPERATE: 1 << 1,
};
export const PERM_TEAM = {
  /** 团队修改成员的角色 */
  PERM_TEAM_EDIT_MEMBER_ROLE: 1 << 0,
  /** 查看团队内部信息 */
  PERM_TEAM_VIEW_INTERNAL: 1 << 1,
  /** 修改团队内部信息 */
  PERM_TEAM_EDIT_INTERNAL: 1 << 2,
  /** 踢出管理员 */
  PERM_TEAM_KICK_ADMIN: 1 << 3,
  /** 踢出普通成员 */
  PERM_TEAM_KICK_MEMBER: 1 << 4,
  /** 管理员直接邀请其他成员加入 */
  PERM_TEAM_INVITE_ADMIN: 1 << 5,
  /** 团队成员直接邀请其他成员加入 */
  PERM_TEAM_INVITE_MEMBER: 1 << 6,
  /** 添加比赛 */
  PERM_CREATE_CONTEST: 1 << 7,
  /** 全部のコンテストを見られる */
  PERM_VIEW_CONTEST: 1 << 8,
  /** 公開のコンテストを見られる */
  PERM_VIEW_CONTEST_PUBLIC: 1 << 9,
  // Placeholder
  PERM_OWNER: -1,
  PERM_BASIC: 0,
  PERM_MEMBER: 1 << 1,
  PERM_ADMIN: -1,

  PERM_NEVER: 1 << 10,
};
