import { User } from "./permission/role/user";
import { db } from "./server/db.server";
import { getSession } from "./sessions";

export async function findRequestUser(request: Request) {
  const session = getSession(request);

  if (!session) {
    return new User(null);
  }

  const result = await db.userSession.findUnique({
    where: { session },
    select: { userId: true },
  });

  if (!result) {
    return new User(null);
  }

  return new User(result.userId);
}

export async function getProblemTeam(problemId: number) {
  const problem = await db.problem.findUnique({
    where: { id: problemId },
    select: { teamId: true },
  });

  return problem && problem.teamId;
}

export async function getTeamMember(teamId: string | null, userId: number) {
  if (!teamId) return null;

  const member = await db.teamMember.findUnique({
    where: { userId_teamId: { userId, teamId } },
    select: { role: true },
  });

  return member && member.role;
}
