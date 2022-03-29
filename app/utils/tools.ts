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
