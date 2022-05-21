import { commitCookie, destroyCookie, getCookie } from "./cookies";
import { db } from "./server/db.server";

const SESSION_COOKIE_NAME = "session";

/** 获取当前请求的 session（已经经过验证） */
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
 * 获取当前请求的用户 id 和角色
 *
 * 如果当前请求没有登录，则返回 null
 *
 * @see findSessionUser
 */
export async function findSessionUserOptional(request: Request) {
  const session = getCookie(request, SESSION_COOKIE_NAME);

  if (!session) {
    return null;
  }

  const userSession = await db.userSession.findUnique({
    where: { session },
    select: {
      user: {
        select: {
          id: true,
          role: true,
        },
      },
    },
  });

  return userSession && userSession.user;
}

/**
 * 获取当前请求的用户 id
 *
 * 如果用户没有登录，则抛出 401 错误
 *
 * @see findSessionUserOptional
 */
export async function findSessionUid(request: Request) {
  const user = await findSessionUserOptional(request);

  if (!user) {
    throw new Response(null, { status: 401 });
  }

  return user.id;
}

/**
 * 获取当前请求的用户 id 和角色
 *
 * 如果用户没有登录，则抛出 401 错误
 *
 * @see findSessionUserOptional
 */
export async function findSessionUser(request: Request) {
  const user = await findSessionUserOptional(request);

  if (!user) {
    throw new Response(null, { status: 401 });
  }

  return user;
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
