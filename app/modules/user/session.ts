import { db } from "~/utils/db.server";

export async function createUserSession(uid: number) {
  return await db.userSession.create({
    data: {
      user: { connect: { uid } },
    },
  });
}

export async function findUserSession(session: string) {
  return await db.userSession.findUnique({
    where: { session },
  });
}
