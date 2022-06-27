/**
 * Parse redirect url pathname
 *
 * Check if the pathname is a string and starts with slash
 *
 * If not, return a single slash as default
 */
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
