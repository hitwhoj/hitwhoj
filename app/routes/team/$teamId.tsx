import type { LoaderFunction } from "@remix-run/node";
import { Outlet, useLoaderData } from "@remix-run/react";
import { db } from "~/utils/db.server";
import type { Team } from "@prisma/client";
import { invariant } from "~/utils/invariant";
import { idScheme } from "~/utils/scheme";

type LoaderData = {
  team: Team;
};

export const loader: LoaderFunction<LoaderData> = async ({ params }) => {
  const teamId = invariant(idScheme.safeParse(params.teamId));
  const team = await db.team.findUnique({
    where: { id: teamId },
  });
  if (!team) {
    throw new Response("Team not found", { status: 404 });
  }

  return { team };
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
