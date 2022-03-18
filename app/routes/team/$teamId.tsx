import { Outlet, useParams,json,LoaderFunction, useLoaderData,MetaFunction } from "remix";
import { db } from "~/utils/db.server";
import { Team } from "@prisma/client";


export const meta: MetaFunction = () => ({
  title: "Team",
});


type LoaderData = {
  team: Team
}

export const loader: LoaderFunction = async ({params}) => {
  const  teamId  = params.teamId;
  const team = await db.team.findUnique(
    {
      where: { tid: teamId }
    }
  )
  if (!team) {
    throw new Response("Team not found", { status: 404 });
  }

  return json({ team });
};



export default function Record() {
  const {team} = useLoaderData<LoaderData>();
  return (
    <div>
      <h1> Team:{team.name} </h1>
      <Outlet />
    </div>
  );
}
