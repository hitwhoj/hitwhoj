import type { Contest, Prisma, PrismaPromise } from "@prisma/client";
import type { Unpack } from "../tools";

type ContestFindMany<T> = Prisma.CheckSelect<
  T,
  PrismaPromise<Array<Contest>>,
  PrismaPromise<Array<Prisma.ContestGetPayload<T>>>
>;

export type ContestListData = Unpack<
  Awaited<
    ContestFindMany<{
      select: typeof selectContestListData;
    }>
  >
>;

export const selectContestListData = {
  id: true,
  title: true,
  beginTime: true,
  endTime: true,
  system: true,
  private: true,
  tags: {
    orderBy: { name: "asc" },
    select: {
      name: true,
    },
  },
} as const;
