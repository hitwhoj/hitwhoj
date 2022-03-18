import {
  Link,
  json,
  useLoaderData,
  ActionFunction,
  redirect,
  Form,
} from "remix";
import { LoaderFunction } from "remix";
import { db } from "~/utils/db.server";

type LoaderData = {
  name: string;
  description: string | null;
  ddl: Date;
  problemSets: {
    sid: number;
    title: string;
  }[];
};

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
          title: true,
        },
      },
    },
  });
  if (!homework) {
    throw new Response("Homework not found", { status: 404 });
  }
  const data: LoaderData = {
    name: homework.name,
    description: homework.description,
    ddl: homework.ddl,
    problemSets: homework.problemsets,
  };

  return json(data);
};

export const action: ActionFunction = async ({ params, request }) => {
  const homeworkId = params.homeworkId ? params.homeworkId : "";
  const teamId = params.teamId ? params.teamId : "";
  const form = await request.formData();
  const _action = form.get("_action");

  if (_action == "delete") {
    await db.teamHomework
      .delete({
        where: {
          hid: homeworkId,
        },
      })
      .catch(() => {
        throw new Response("fail to delete", { status: 500 });
      })
      .then(() => {
        return redirect(`/team/${teamId}/homework`);
      });
  }

  return redirect(`/team/${teamId}/homework`);
};

export default function Record() {
  const data = useLoaderData<LoaderData>();
  console.log(data);
  return (
    <>
      <h3>Homework:{data.name}</h3>
      <h3>Details</h3>
      <div>{data.description ? data.description : "no description"}</div>
      <div>截止时间:{data.ddl}</div>
      <h3>Operation</h3>
      <ul>
        <li>
          <Link to="edit">Edit</Link>{" "}
        </li>
      </ul>
      <Form method="post" style={{ display: "flex", flexDirection: "column" }}>
        <button type="submit" name="_action" value="delete">
          Delete
        </button>
      </Form>

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
