// FIXME: `crypto` is not available in browser!!!
// @ts-ignore
import sha256 from "hash.js/lib/hash/sha/256";

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
 * @example Unpack<number[]> = number
 */
export type Unpack<T> = T extends Array<infer U> ? U : never;

const dateTimeFormatter = new Intl.DateTimeFormat("zh-CN", {
  year: "numeric",
  month: "numeric",
  day: "numeric",
  hour: "numeric",
  minute: "numeric",
  second: "numeric",
});

/**
 * Format time to YYYY/MM/DD HH:mm:ss
 */
export function formatDateTime(time: Date | string) {
  return dateTimeFormatter.format(new Date(time));
}

const numberFormatter = new Intl.NumberFormat("zh-CN");

export function formatNumber(number: number) {
  return numberFormatter.format(number);
}

/**
 * Format time to XX 秒 / XX分钟 / XX小时
 */
export function formatDurationTime(ms: number) {
  if (ms < 1000) {
    return `${formatNumber(ms)}毫秒`;
  } else if (ms < 60000) {
    return `${formatNumber(ms / 1000)}秒`;
  } else if (ms < 3600000) {
    return `${formatNumber(ms / 60000)}分钟`;
  } else {
    return `${formatNumber(ms / 3600000)}小时`;
  }
}

const relativeDateTimeFormatter = new Intl.RelativeTimeFormat("zh-CN", {
  numeric: "auto",
});

/**
 * Format time to XXX 秒前 / XXX 分钟前 / XXX 小时前 / XXX 天前 / XXX 年前
 */
export function formatRelativeDateTime(time: Date | string) {
  const date = new Date(time).getTime();
  const now = Date.now();

  const relativeSeconds = (now - date) / 1000;
  if (Math.abs(relativeSeconds) < 60) {
    return relativeDateTimeFormatter.format(
      Math.floor(relativeSeconds),
      "second"
    );
  }

  const relativeMinutes = relativeSeconds / 60;
  if (Math.abs(relativeMinutes) < 60) {
    return relativeDateTimeFormatter.format(
      Math.floor(relativeMinutes),
      "minute"
    );
  }

  const relativeHours = relativeMinutes / 60;
  if (Math.abs(relativeHours) < 24) {
    return relativeDateTimeFormatter.format(Math.floor(relativeHours), "hour");
  }

  const relativeDays = relativeHours / 24;
  if (Math.abs(relativeDays) < 30) {
    return relativeDateTimeFormatter.format(Math.floor(relativeDays), "day");
  }

  const relativeMonths = relativeDays / 30;
  if (Math.abs(relativeMonths) < 12) {
    return relativeDateTimeFormatter.format(
      Math.floor(relativeMonths),
      "month"
    );
  }

  const relativeYears = relativeMonths / 12;
  return relativeDateTimeFormatter.format(Math.floor(relativeYears), "year");
}

/**
 * 密码加盐哈希
 *
 * 要哈希两次才是放在数据库里面的密码，第一次在前端哈希，第二次在后端哈希
 */
export function passwordHash(password: string): string {
  return sha256().update(`TODO: hitwhoj-first-test{${password}}`).digest("hex");
}
