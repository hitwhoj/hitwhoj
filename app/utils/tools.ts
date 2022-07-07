/**
 * Parse redirect url pathname
 *
 * Check if the pathname is a string and starts with slash
 *
 * If not, return a single slash as default
 */
// FIXME: `crypto` is not available in browser!!!
// @ts-ignore
import sha256 from "hash.js/lib/hash/sha/256";

export function parseRedirectPathname(redirect: unknown) {
  return typeof redirect === "string" && redirect.startsWith("/")
    ? redirect
    : "/";
}

/**
 * @example Unpack<number[]> == number
 */
export type Unpack<T> = T extends Array<infer U> ? U : never;

/**
 * Format time to YYYY/MM/DD HH:mm:ss
 */
export function formatDateTime(time: Date | string) {
  const date = new Date(time);

  return new Intl.DateTimeFormat("zh-CN", {
    year: "numeric",
    month: "numeric",
    day: "numeric",
    hour: "numeric",
    minute: "numeric",
    second: "numeric",
  }).format(date);
}

/**
 * 密码加盐哈希
 *
 * 要哈希两次才是放在数据库里面的密码，第一次在前端哈希，第二次在后端哈希
 */
export function passwordHash(password: string): string {
  return sha256().update(`TODO: hitwhoj-first-test{${password}}`).digest("hex");
}
