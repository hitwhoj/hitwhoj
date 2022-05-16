import type {
  ActionFunction,
  LoaderFunction,
  MetaFunction,
} from "@remix-run/node";
import { json, redirect } from "@remix-run/node";
import { Form, Link, useLoaderData } from "@remix-run/react";
import { db } from "~/utils/db.server";
import { teamNameScheme } from "~/utils/scheme";
import type { Team } from "@prisma/client";
import { invariant } from "~/utils/invariant";

export const meta: MetaFunction = () => ({
  title: "Team List",
});

export const action: ActionFunction = async ({ request }) => {
  const form = await request.formData();
  const teamName = invariant(teamNameScheme.safeParse(form.get("teamName")));

  if (!teamName)
    return new Response("teamName is not registered", { status: 400 });

  const team = await db.team.findUnique({
    select: { id: true },
    where: { name: teamName },
  });
  if (!team) {
    return new Response("team is not registered", { status: 400 });
  }

  return redirect(`/team/${team.id}`);
};

type LoaderData = {
  teams: Team[];
};

export const loader: LoaderFunction = async () => {
  const teams = await db.team.findMany({
    take: 20,
    orderBy: {
      name: "asc",
    },
  });

  return json({ teams });
};

export default function TeamList() {
  const { teams } = useLoaderData<LoaderData>();

  return (
    <>
      <h1>Team</h1>
      <div>
        <Form
          method="post"
          style={{
            display: "flex",
            flexDirection: "column",
          }}
        >
          <input type="text" name="teamName" placeholder="teamName" required />
          <button type="submit">search</button>
        </Form>
      </div>
      <h3> Operation </h3>
      <ul>
        <li>
          <Link to="new">创建队伍</Link>
        </li>
      </ul>
      <h3> Public teamList </h3>
      {teams.length ? (
        <ul>
          {teams.map((team) => (
            <li key={team.id}>
              <Link to={`${team.id}`}>{team.name}</Link>
            </li>
          ))}
        </ul>
      ) : (
        <div>什么都没有捏</div>
      )}
    </>
  );
}
