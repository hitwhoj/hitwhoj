import type { LoaderFunction, MetaFunction } from "@remix-run/node";
import { Link, useLoaderData } from "@remix-run/react";
import { db } from "~/utils/server/db.server";
import type { Contest } from "@prisma/client";
import { ContestSystem } from "@prisma/client";
import { idScheme } from "~/utils/scheme";
import { invariant } from "~/utils/invariant";

type LoaderData = {
  homeworks: Pick<Contest, "id" | "title">[];
};

export const meta: MetaFunction<LoaderData> = () => ({
  title: `Team Homework - HITwh OJ`,
});

export const loader: LoaderFunction<LoaderData> = async ({ params }) => {
  const teamId = invariant(idScheme, params.teamId);

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

  return {
    homeworks: homeworks.contests,
  };
};

export default function HomeworkList() {
  const { homeworks } = useLoaderData<LoaderData>();

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
        {homeworks.length ? (
          <ul>
            {homeworks.map((homework) => (
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
