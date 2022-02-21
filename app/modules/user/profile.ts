import { db } from "~/utils/db.server";

export async function getUserByUid(uid: number) {
  return await db.user.findUnique({ where: { uid } });
}

export async function getUserByNickname(nickname: string) {
  return await db.user.findUnique({ where: { nickname } });
}

export async function createUser({
  nickname,
  password,
}: {
  nickname: string;
  password: string;
}) {
  return await db.user.create({
    data: {
      nickname,
      password,
    },
  });
}
