import { json, Link, LoaderFunction, useLoaderData } from "remix";
import { db } from "~/utils/db.server";

type LoaderData = {
  hid: number;
  name: string;
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
          hid: true,
          name: true,
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
              <li key={homework.hid}>
                <Link to={`${homework.hid}`}>{homework.name}</Link>
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
