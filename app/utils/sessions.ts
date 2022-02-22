import { commitCookie, destroyCookie, getCookie } from "./cookies";
import { db } from "./db.server";

const SESSION_COOKIE_NAME = "session";

export async function findSessionUid(request: Request) {
  const session = getCookie(request, SESSION_COOKIE_NAME);

  if (!session) {
    return null;
  }

  const userSession = await db.userSession.findUnique({
    where: { session },
  });

  return userSession && userSession.uid;
}

export async function commitSession(uid: number) {
  const { session } = await db.userSession.create({
    data: {
      user: { connect: { uid } },
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
