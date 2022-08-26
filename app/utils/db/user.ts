import type { User, Prisma, PrismaPromise } from "@prisma/client";
import type { Unpack } from "../tools";

type UserFindMany<T> = Prisma.CheckSelect<
  T,
  PrismaPromise<Array<User>>,
  PrismaPromise<Array<Prisma.UserGetPayload<T>>>
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
} as const;
