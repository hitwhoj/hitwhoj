import { Link, json, useLoaderData } from "remix";
import { LoaderFunction } from "remix";
import { db } from "~/utils/db.server";
import { TeamHomework } from "@prisma/client"

type LoaderData = {
  name:string,
  description:string|null,
  ddl:Date
  problemSets: {
    sid: number,
    title: string
  }[]
}

export const loader: LoaderFunction = async ({ params }) => {
  const hid = params.homeworkId;
  const homework = await db.teamHomework.findUnique({
    where: {
      hid: hid,
    },
    include: {
      problemsets: {
        select: {
          sid: true,
          title: true
        }
      }
    }
  })
  if (!homework) {
    throw new Response("Homework not found", { status: 404 });
  }
  const data:LoaderData = {
    name:homework.name,
    description:homework.description,
    ddl:homework.ddl,
    problemSets:homework.problemsets
  }

  return json(data);
};

export default function Record() {
  const data = useLoaderData<LoaderData>()
  console.log(data)
  return (
    <>
      <h3>{data.name}</h3>
      <h3>Details</h3>
      <div>{data.description ? data.description : "no description"}</div>
      <div>截止时间:{data.ddl}</div>
      <h3>Operation</h3>
      <ul>
        <li>
          <Link to="edit">Edit</Link>{" "}
        </li>
        <li>Delete</li>
      </ul>

      <h3>ProblemSet List</h3>
      {data.problemSets.length ? (
        <ul>
          {data.problemSets.map((problemset) => (
            <li key={problemset.sid}>
              <Link to={`/problemset/${problemset.sid}`}>
                {problemset.title}
              </Link>
            </li>
          ))}
        </ul>
      ) : (
        <div>...?</div>
      )}
    </>
  );
}
