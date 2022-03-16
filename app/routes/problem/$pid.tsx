import { Problem } from "@prisma/client";
import {
  LoaderFunction,
  json,
  useLoaderData,
  MetaFunction,
  Outlet,
  Link,
} from "remix";
import { db } from "~/utils/db.server";
import { invariant } from "~/utils/invariant";
import { idScheme } from "~/utils/scheme";

type LoaderData = {
  problem: Pick<Problem, "pid" | "title" | "description">;
};

export const loader: LoaderFunction = async ({ params }) => {
  const pid = invariant(idScheme.safeParse(params.pid), { status: 404 });

  const problem = await db.problem.findUnique({
    where: { pid },
    select: {
      pid: true,
      title: true,
      description: true,
    },
  });

  if (!problem) {
    throw new Response("Problem not found", { status: 404 });
  }

  return json({ problem });
};

export const meta: MetaFunction = ({ data }: { data: LoaderData }) => ({
  title: data.problem.title,
  description: data.problem.description,
});

export default function Problem() {
  const { problem } = useLoaderData<LoaderData>();

  return (
    <div>
      <header>
        <h1>
          <span style={{ color: "grey", marginRight: "20px" }}>
            P{problem.pid}
          </span>
          {problem.title}
        </h1>
      </header>
      <ul>
        <li>
          <Link to=".">查看</Link>
        </li>
        <li>
          <Link to="submit">提交</Link>
        </li>
      </ul>
      <Outlet />
    </div>
  );
}
