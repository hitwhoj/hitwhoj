import type { Prisma, PrismaPromise, Problem } from "@prisma/client";
import type { Unpack } from "../tools";

type ProblemFindMany<T> = Prisma.CheckSelect<
  T,
  PrismaPromise<Array<Problem>>,
  PrismaPromise<Array<Prisma.ProblemGetPayload<T>>>
>;

export type ProblemListData = Unpack<
  Awaited<
    ProblemFindMany<{
      select: typeof selectProblemListData;
    }>
  >
>;

export const selectProblemListData = {
  id: true,
  title: true,
  private: true,
} as const;
