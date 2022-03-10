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
import { invariant, ensureNumericId } from "~/utils/invariant";

export const meta: MetaFunction = () => ({
  title: "Problem List",
});

type LoaderData = {
  problemSet: ProblemSet;
};

export const loader: LoaderFunction = async ({ params }) => {
  const sid = invariant(ensureNumericId(params.sid), "sid is required");

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
