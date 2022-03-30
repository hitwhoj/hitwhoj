import { json, Link, LoaderFunction, useLoaderData } from "remix";
import { db } from "~/utils/db.server";
import { ContestSystem } from "@prisma/client";

type LoaderData = {
  cid: number;
  title: string;
}[];

export const loader: LoaderFunction = async ({ params }) => {
  const tid = params.teamId;
  const homeworks = await db.team.findUnique({
    where: {
      tid: tid,
    },
    include: {
      homeworks: {
        select: {
          cid: true,
          title: true,
        },
        where:{
          system:ContestSystem.Homework
        }
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
