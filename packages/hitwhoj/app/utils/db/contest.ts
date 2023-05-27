import type { Contest, Prisma } from "@prisma/client";
import { db } from "../server/db.server";
import type { Unpack } from "../tools";

type ContestFindMany<
  T extends boolean | Prisma.ContestArgs | null | undefined
> = Prisma.CheckSelect<
  T,
  Prisma.PrismaPromise<Array<Contest>>,
  Prisma.PrismaPromise<Array<Prisma.ContestGetPayload<T>>>
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
  teamId: true,
  tags: {
    orderBy: { name: "asc" },
    select: {
      name: true,
    },
  },
} as const;

export async function findContestTeam(contestId: number) {
  const contest = await db.contest.findUnique({
    where: { id: contestId },
    select: { teamId: true },
  });

  if (!contest) {
    throw new Response("Contest not found", { status: 404 });
  }

  return contest.teamId;
}

export enum ContestStatus {
  Pending = "Pending",
  Running = "Running",
  Ended = "Ended",
}

export async function findContestStatus(contestId: number) {
  const contest = await db.contest.findUnique({
    where: { id: contestId },
    select: { beginTime: true, endTime: true },
  });

  if (!contest) {
    throw new Response("Contest not found", { status: 404 });
  }

  if (contest.beginTime.getTime() > Date.now()) {
    return ContestStatus.Pending;
  } else if (contest.endTime.getTime() < Date.now()) {
    return ContestStatus.Ended;
  } else {
    return ContestStatus.Running;
  }
}

export async function findContestProblemIdByRank(
  contestId: number,
  rank: number
) {
  const contest = await db.contestProblem.findUnique({
    where: { contestId_rank: { contestId, rank } },
    select: { problemId: true },
  });

  if (!contest) {
    throw new Response("Contest not found", { status: 404 });
  }

  return contest.problemId;
}

export async function findContestPrivacy(contestId: number) {
  const contest = await db.contest.findUnique({
    where: { id: contestId },
    select: { private: true },
  });

  if (!contest) {
    throw new Response("Contest not found", { status: 404 });
  }

  return contest.private;
}

export async function findContestParticipantRole(
  contestId: number,
  userId: number
) {
  const participation = await db.contestParticipant.findUnique({
    where: { contestId_userId: { contestId, userId } },
    select: { role: true },
  });

  if (!participation) {
    return null;
  }

  return participation.role;
}
export function seeBoard(
  system: string,
  endTime: number,
  boardTime: number,
  allowSeeBoard: boolean
) {
  const now = new Date().getTime();
  const flag = now < boardTime;
  if (system == "OI") {
    if (now < endTime) {
      return allowSeeBoard && flag;
    }
  }
  if (system == "ACM") {
    if (now > endTime) {
      return allowSeeBoard && flag;
    }
  }
  return flag;
}
