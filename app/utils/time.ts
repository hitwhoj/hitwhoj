/**
 * 将时间从客户端时区调整为服务器时区
 */
export function adjustTimezone(date: Date, timezoneOffset: number) {
  return new Date(
    date.getTime() + (timezoneOffset - new Date().getTimezoneOffset()) * 60_000
  );
}

/**
 * 获取时间的 datetime-local 格式，用于填充 `<input type="datetime-local">` 的默认值
 *
 * @param time 时间 (默认为当前时间)
 */
export function getDatetimeLocal(time: number = Date.now()) {
  return new Date(time - new Date().getTimezoneOffset() * 60_000)
    .toISOString()
    .slice(0, 16);
}
