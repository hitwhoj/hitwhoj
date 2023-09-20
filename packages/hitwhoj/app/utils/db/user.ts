import type { User, Prisma } from "@prisma/client";
import type { Unpack } from "../tools";

type UserFindMany<T extends boolean | Prisma.UserArgs | null | undefined> =
  Prisma.CheckSelect<
    T,
    Prisma.PrismaPromise<Array<User>>,
    Prisma.PrismaPromise<Array<Prisma.UserGetPayload<T>>>
  >;

export type UserData = Unpack<
  Awaited<
    UserFindMany<{
      select: typeof selectUserData;
    }>
  >
>;

export const selectUserData = {
  id: true,
  username: true,
  nickname: true,
  role: true,
  avatar: true,
  bio: true,
  premium: true,
  // 这里添加了studentId，用于存储学生的学号
  studentId: true,
} as const;
