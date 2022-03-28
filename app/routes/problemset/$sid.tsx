import { ProblemSet } from "@prisma/client";
import {
  json,
  Link,
  LoaderFunction,
  MetaFunction,
  Outlet,
  useLoaderData,
} from "remix";
import { db } from "~/utils/db.server";
import { invariant } from "~/utils/invariant";
import { idScheme } from "~/utils/scheme";

type LoaderData = {
  problemSet: ProblemSet;
};

export const loader: LoaderFunction = async ({ params }) => {
  const sid = invariant(idScheme.safeParse(params.sid), { status: 404 });

  const problemSet = await db.problemSet.findUnique({
    where: { sid },
  });

  if (!problemSet) {
    throw new Response("Problem Set not found", { status: 404 });
  }

  return json({
    problemSet,
  });
};

export const meta: MetaFunction = ({ data }: { data?: LoaderData }) => ({
  title: `题单: ${data?.problemSet.title} - HITwh OJ`,
  description: data?.problemSet.description,
});

export default function Problemset() {
  const { problemSet } = useLoaderData<LoaderData>();

  return (
    <>
      <h1>{problemSet.title}</h1>
      {/* 题单导航 */}
      <ul>
        <li>
          <Link to=".">详情</Link>
        </li>
        <li>
          <Link to="edit">编辑</Link>
        </li>
      </ul>
      {/* 题单页面 */}
      <Outlet />
    </>
  );
}
