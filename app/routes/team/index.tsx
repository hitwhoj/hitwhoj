import {
  Link,
  Form,
  ActionFunction,
  redirect,
  LoaderFunction,
  json,
  useLoaderData,
} from "remix";
import { db } from "~/utils/db.server";
import { Team } from "@prisma/client";

export const action: ActionFunction = async ({ request }) => {
  const form = await request.formData();

  const teamName = form.get("teamName")?.toString();
  if (!teamName)
    return new Response("teamName is not registered", { status: 400 });
  return redirect(`/team/${teamName}`);
};

type LoaderData = {
  teams: Team[];
};

export const loader: LoaderFunction = async () => {
  const teams = await db.team.findMany({
    take: 20,
  });

  return json({ teams });
};

export default function TeamList() {
  const { teams } = useLoaderData<LoaderData>();

  return (
    <>
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
      <h1> Public teamList </h1>
      {teams.length ? (
        <ul>
          {teams.map((team) => (
            <li key={team.tid}>
              <Link to={`${team.tid}`}>{team.name}</Link>
            </li>
          ))}
        </ul>
      ) : (
        <div>什么都没有捏</div>
      )}
    </>
  );
}
