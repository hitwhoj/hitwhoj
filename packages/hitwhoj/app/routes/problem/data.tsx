//! THIS IS A BACKEND API FOR /src/problem/ProblemEditor.tsx

import type { LoaderArgs, SerializeFrom } from "@remix-run/node";
import { json } from "@remix-run/node";
import { findRequestUser } from "~/utils/permission";
import { db } from "~/utils/server/db.server";
import { invariant } from "~/utils/invariant";
import { teamIdScheme } from "~/utils/new-permission/scheme";
import { PERM_TEAM } from "~/utils/new-permission/privilege";

export async function loader({ request, params }: LoaderArgs) {
  const self = await findRequestUser(request);
  const teamId = invariant(teamIdScheme, params.teamId, { status: 404 });
  const [viewAll, viewPublic] = await self
    .newTeam(teamId)
    .hasPrivilege(
      PERM_TEAM.PERM_VIEW_PROBLEM,
      PERM_TEAM.PERM_VIEW_PROBLEM_PUBLIC
    );

  const problems = await db.problem.findMany({
    where: viewAll
      ? { teamId }
      : viewPublic
      ? { teamId, private: false }
      : { id: -1 },
    orderBy: [{ id: "asc" }],
    select: {
      id: true,
      title: true,
      tags: { select: { name: true } },
    },
  });

  return json({ problems });
}

export type LoaderData = SerializeFrom<typeof loader>;
