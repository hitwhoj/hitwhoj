import { Link, LoaderFunction, json, useLoaderData } from "remix";
import { db } from "~/utils/db.server";
import { Team } from "@prisma/client";
import { invariant } from "~/utils/invariant";
import {idScheme} from "~/utils/scheme"

type LoaderData = {
  team: Team;
};

export const loader: LoaderFunction = async ({ params }) => {
  const teamId = invariant(idScheme.safeParse(params.teamId))   ;
  const team = await db.team.findUnique({
    where: { tid: Number(teamId) },
  });
  if (!team) {
    throw new Response("Team not found", { status: 404 });
  }

  return json({ team });
};

export default function teamDetail() {
  const { team } = useLoaderData<LoaderData>();
  return (
    <>
      <h3>Details</h3>
      <div>{team.description ? team.description : "no description"}</div>

      <h3>Operation</h3>
      <ul>
        <li>
          <Link to="dissolve">Dissolve Team</Link>{" "}
        </li>
      </ul>
      <h3>Modules</h3>
      <ul>
        <li>
          <Link to="members">团队成员</Link>
        </li>
        <li>
          <Link to="homework">作业</Link>
        </li>
      </ul>
    </>
  );
}
