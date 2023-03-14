import { commitCookie, destroyCookie, getCookie } from "./cookies";
import { db } from "./server/db.server";

const SESSION_COOKIE_NAME = "session";

export function getSession(request: Request) {
  return getCookie(request, SESSION_COOKIE_NAME);
}

export async function commitSession(userId: number) {
  const { session } = await db.userSession.create({
    data: { userId },
  });

  return commitCookie(SESSION_COOKIE_NAME, session);
}

export async function destroySession(session: string) {
  await db.userSession.delete({
    where: { session },
  });

  return destroyCookie(SESSION_COOKIE_NAME);
}
