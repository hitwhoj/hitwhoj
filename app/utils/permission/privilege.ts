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
