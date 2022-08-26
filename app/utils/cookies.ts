function parseCookie(cookie: string) {
  const map = new Map<string, string>();
  const list = cookie.split(";");
  for (const item of list) {
    const [key, value] = item.split("=");
    map.set(key.trim(), value);
  }
  return map;
}

export function getCookie(request: Request, name: string) {
  const cookie = parseCookie(request.headers.get("Cookie") ?? "");
  return cookie.get(name);
}

export function commitCookie(name: string, value: string) {
  return `${name}=${value}; Path=/; HttpOnly; SameSite=Strict; Expires=Fri, 31 Dec 9999 23:59:59 GMT`;
}

export function destroyCookie(name: string) {
  return `${name}=; Path=/; HttpOnly; SameSite=Strict; Expires=Thu, 01 Jan 1970 00:00:00 GMT`;
}
