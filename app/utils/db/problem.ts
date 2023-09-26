import type { Prisma, Problem } from "@prisma/client";
import { db } from "../server/db.server";
import type { Unpack } from "../tools";

type ProblemFindMany<
  T extends boolean | Prisma.ProblemArgs | null | undefined
> = Prisma.CheckSelect<
  T,
  Prisma.PrismaPromise<Array<Problem>>,
  Prisma.PrismaPromise<Array<Prisma.ProblemGetPayload<T>>>
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

export async function findProblemTeam(problemId: number) {
  const problem = await db.problem.findUnique({
    where: { id: problemId },
    select: { teamId: true },
  });

  if (!problem) {
    throw new Response("Problem not found", { status: 404 });
  }

  return problem.teamId;
}

export async function findProblemPrivacy(problemId: number) {
  const problem = await db.problem.findUnique({
    where: { id: problemId },
    select: { private: true },
  });

  if (!problem) {
    throw new Response("Problem not found", { status: 404 });
  }

  return problem.private;
}
