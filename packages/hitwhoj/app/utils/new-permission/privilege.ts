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
  /** 创建团队 */
  PRIV_TEAM_CREATE: 1 << 2,

  PERM_OWNER: (1 << 3) - 1,
  PERM_ADMIN: (1 << 3) - 1,
  PERM_USER: (1 << 3) - 1,
};
export const PERM_TEAM = {
  /** 查看团队内部信息 */
  PERM_TEAM_VIEW_INTERNAL: 1 << 0,
  /** 修改团队内部信息 */
  PERM_TEAM_EDIT_INTERNAL: 1 << 1,
  /** 团队修改成员的角色 */
  PERM_TEAM_EDIT_MEMBER_ROLE: 1 << 2,
  /** 踢出管理员 */
  PERM_TEAM_KICK_ADMIN: 1 << 3,
  /** 踢出普通成员 */
  PERM_TEAM_KICK_MEMBER: 1 << 4,
  /** 管理员直接邀请其他成员加入 */
  PERM_TEAM_INVITE_MEMBER: 1 << 5,
  /** 添加比赛 */
  PERM_CREATE_CONTEST: 1 << 6,
  /** 查看全部的比赛*/
  PERM_VIEW_CONTEST: 1 << 7,
  /** 查看公开的比赛*/
  PERM_VIEW_CONTEST_PUBLIC: 1 << 8,
  /**编辑比赛*/
  PERM_EDIT_CONTEST_PUBLIC: 1 << 9,
  /** 创建题目 */
  PERM_CREATE_PROBLEM: 1 << 10,
  /** 查看所有题目 */
  PERM_VIEW_PROBLEM: 1 << 11,
  /** 查看公开的题目 */
  PERM_VIEW_PROBLEM_PUBLIC: 1 << 12,
  /** 编辑任意题目 */
  PERM_EDIT_PROBLEM: 1 << 13,
  /** 添加题单 */
  PERM_CREATE_PROBLEM_SET: 1 << 14,
  /** 查看所有题单 */
  PERM_VIEW_PROBLEM_SET: 1 << 15,
  /** 查看公开的题单 */
  PERM_VIEW_PROBLEM_SET_PUBLIC: 1 << 16,
  /** 编辑任意题单 */
  PERM_EDIT_PROBLEM_SET: 1 << 17,
  // Placeholder
  PERM_OWNER: -1,
  PERM_BASIC: 0,
  PERM_MEMBER: (1 << 0) + (1 << 8) + (1 << 12) + (1 << 16),
  PERM_ADMIN: (1 << 18) - 1,

  PERM_NEVER: 1 << 10,
};
