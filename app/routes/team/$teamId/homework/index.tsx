import type { LoaderFunction, MetaFunction } from "@remix-run/node";
import { json } from "@remix-run/node";
import { Link, useLoaderData } from "@remix-run/react";
import { db } from "~/utils/db.server";
import type { Contest } from "@prisma/client";
import { ContestSystem } from "@prisma/client";
import { idScheme } from "~/utils/scheme";
import { invariant } from "~/utils/invariant";

type LoaderData = Pick<Contest, "cid" | "title">[];

export const meta: MetaFunction = () => ({
  title: `Team Homework - HITwh OJ`,
});

export const loader: LoaderFunction = async ({ params }) => {
  const tid = invariant(idScheme.safeParse(params.teamId));
  const homeworks = await db.team.findUnique({
    where: {
      tid: Number(tid),
    },
    include: {
      homeworks: {
        select: {
          cid: true,
          title: true,
        },
        where: {
          system: ContestSystem.Homework,
        },
      },
    },
  });
  if (!homeworks?.homeworks) {
    return json([]);
  }

  var data: LoaderData = [];
  for (let i = 0; i < homeworks?.homeworks.length; i++) {
    data.push(homeworks?.homeworks[i] as any);
  }
  return json(data);
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
              <li key={homework.cid}>
                <Link to={`/contest/${homework.cid}`}>{homework.title}</Link>
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
