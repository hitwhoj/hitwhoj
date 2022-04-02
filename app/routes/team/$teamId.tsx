import { Outlet, json, LoaderFunction, useLoaderData } from "remix";
import { db } from "~/utils/db.server";
import { Team } from "@prisma/client";
import { invariant } from "~/utils/invariant";
import { idScheme } from "~/utils/scheme";

type LoaderData = {
  team: Team;
};

export const loader: LoaderFunction = async ({ params }) => {
  const teamId = invariant(idScheme.safeParse(params.teamId));
  const team = await db.team.findUnique({
    where: { tid: Number(teamId) },
  });
  if (!team) {
    throw new Response("Team not found", { status: 404 });
  }

  return json({ team });
};

export default function Record() {
  const { team } = useLoaderData<LoaderData>();
  return (
    <div>
      <h1> Team:{team.name} </h1>
      <Outlet />
    </div>
  );
}
