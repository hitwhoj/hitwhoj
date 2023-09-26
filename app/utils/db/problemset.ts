import { db } from "../server/db.server";

export async function findProblemSetTeam(problemSetId: number) {
  const problemSet = await db.problemSet.findUnique({
    where: { id: problemSetId },
    select: { teamId: true },
  });

  if (!problemSet) {
    throw new Response("Problem set not found", { status: 404 });
  }

  return problemSet.teamId;
}

export async function findProblemSetPrivacy(problemSetId: number) {
  const problemSet = await db.problemSet.findUnique({
    where: { id: problemSetId },
    select: { private: true },
  });

  if (!problemSet) {
    throw new Response("Problem set not found", { status: 404 });
  }

  return problemSet.private;
}
