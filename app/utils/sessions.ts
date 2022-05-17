import { commitCookie, destroyCookie, getCookie } from "./cookies";
import { db } from "./server/db.server";

const SESSION_COOKIE_NAME = "session";

/**
 * 获取当前请求的 session
 */
export async function findSession(request: Request) {
  const session = getCookie(request, SESSION_COOKIE_NAME);

  if (!session) {
    return null;
  }

  const userSession = await db.userSession.findUnique({
    where: { session },
    select: { session: true },
  });

  return userSession && userSession.session;
}

/**
 * 获取当前请求的用户 uid
 */
export async function findSessionUid(request: Request) {
  const session = getCookie(request, SESSION_COOKIE_NAME);

  if (!session) {
    return null;
  }

  const userSession = await db.userSession.findUnique({
    where: { session },
    select: { userId: true },
  });

  return userSession && userSession.userId;
}

export async function commitSession(userId: number) {
  const { session } = await db.userSession.create({
    data: {
      user: { connect: { id: userId } },
    },
  });

  return commitCookie(SESSION_COOKIE_NAME, session);
}

export async function destroySession(session: string) {
  await db.userSession.delete({
    where: { session },
  });

  return destroyCookie(SESSION_COOKIE_NAME);
}
