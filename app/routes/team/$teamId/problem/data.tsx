//! THIS IS A BACKEND API FOR /src/problem/ProblemEditor.tsx

import type { LoaderArgs, SerializeFrom } from "@remix-run/node";
import { json } from "@remix-run/node";
import { invariant } from "~/utils/invariant";
import { findRequestUser } from "~/utils/permission";
import { Permissions } from "~/utils/permission/permission";
import { idScheme } from "~/utils/scheme";
import { db } from "~/utils/server/db.server";

export async function loader({ request, params }: LoaderArgs) {
  const teamId = await invariant(idScheme, params.teamId, { status: 404 });
  const self = await findRequestUser(request);
  const [viewAll, viewPublic] = await self
    .team(teamId)
    .hasPermission(
      Permissions.PERM_VIEW_PROBLEM,
      Permissions.PERM_VIEW_PROBLEM_PUBLIC
    );

  var problems = await db.problem.findMany({
    where: viewAll
      ? { teamId: null }
      : viewPublic
      ? { teamId: null, private: false }
      : { id: -1 },
    orderBy: [{ id: "asc" }],
    select: {
      id: true,
      title: true,
      tags: { select: { name: true } },
    },
  });
  const publicProblems = await db.problem.findMany({
    where: viewAll
      ? { teamId: teamId }
      : viewPublic
      ? { teamId: teamId, private: false }
      : { id: -1 },
    orderBy: [{ id: "asc" }],
    select: {
      id: true,
      title: true,
      tags: { select: { name: true } },
    },
  });
  problems = publicProblems.concat(problems);

  return json({ problems });
}

export type LoaderData = SerializeFrom<typeof loader>;
