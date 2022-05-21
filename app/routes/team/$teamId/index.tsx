import type { LoaderFunction, MetaFunction } from "@remix-run/node";
import { Link, useLoaderData } from "@remix-run/react";
import { db } from "~/utils/server/db.server";
import type { Team } from "@prisma/client";
import { invariant } from "~/utils/invariant";
import { idScheme } from "~/utils/scheme";

type LoaderData = {
  team: Team;
};

export const meta: MetaFunction<LoaderData> = ({ data }) => ({
  title: `Team: ${data?.team.name} - HITwh OJ`,
});

export const loader: LoaderFunction<LoaderData> = async ({ params }) => {
  const teamId = invariant(idScheme, params.teamId);
  const team = await db.team.findUnique({
    where: { id: teamId },
  });
  if (!team) {
    throw new Response("Team not found", { status: 404 });
  }

  return { team };
};

export default function TeamDetail() {
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
