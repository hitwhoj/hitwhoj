import type { LoaderFunction, MetaFunction } from "@remix-run/node";
import { json } from "@remix-run/node";
import { Link, useLoaderData } from "@remix-run/react";
import { db } from "~/utils/db.server";
import type { Contest } from "@prisma/client";
import { ContestSystem } from "@prisma/client";
import { idScheme } from "~/utils/scheme";
import { invariant } from "~/utils/invariant";

type LoaderData = Pick<Contest, "id" | "title">[];

export const meta: MetaFunction = () => ({
  title: `Team Homework - HITwh OJ`,
});

export const loader: LoaderFunction = async ({ params }) => {
  const teamId = invariant(idScheme.safeParse(params.teamId));

  const homeworks = await db.team.findUnique({
    where: { id: teamId },
    select: {
      contests: {
        where: {
          system: ContestSystem.Homework,
        },
        select: {
          id: true,
          title: true,
        },
      },
    },
  });

  if (!homeworks) {
    throw new Response("Team not found", { status: 404 });
  }

  return json(homeworks.contests);
};

export default function HomeworkList() {
  const data = useLoaderData<LoaderData>();
  console.log(data);
  return (
    <>
      <h3>Operation</h3>
      <ul>
        <li>
          <Link to="new">创建作业</Link>
        </li>
      </ul>

      <h3> homeworkList </h3>
      <div>
        {data.length ? (
          <ul>
            {data.map((homework) => (
              <li key={homework.id}>
                <Link to={`/contest/${homework.id}`}>{homework.title}</Link>
              </li>
            ))}
          </ul>
        ) : (
          <div>没有作业?好耶！</div>
        )}
      </div>
    </>
  );
}
