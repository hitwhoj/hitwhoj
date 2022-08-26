import { db } from "../server/db.server";

export async function findRecordUser(recordId: number) {
  const record = await db.record.findUnique({
    where: { id: recordId },
    select: { submitterId: true },
  });

  if (!record) {
    throw new Response("Record not found", { status: 404 });
  }

  return record.submitterId;
}

export async function findRecordTeam(recordId: number) {
  const record = await db.record.findUnique({
    where: { id: recordId },
    select: {
      contest: {
        select: {
          teamId: true,
        },
      },
    },
  });

  if (!record) {
    throw new Response("Record not found", { status: 404 });
  }

  return record.contest && record.contest.teamId;
}

export async function findRecordContest(recordId: number) {
  const record = await db.record.findUnique({
    where: { id: recordId },
    select: { contestId: true },
  });

  if (!record) {
    throw new Response("Record not found", { status: 404 });
  }

  return record.contestId;
}
