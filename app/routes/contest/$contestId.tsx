import { Contest } from "@prisma/client";
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
  contest: Contest;
};

export const loader: LoaderFunction = async ({ params }) => {
  const cid = invariant(idScheme.safeParse(params.contestId), { status: 404 });

  const contest = await db.contest.findUnique({
    where: { cid },
  });

  if (!contest) {
    throw new Response("Contest not found", { status: 404 });
  }

  return json({ contest });
};

export const meta: MetaFunction = ({ data }: { data?: LoaderData }) => ({
  title: `比赛: ${data?.contest.title} - HITwh OJ`,
  description: data?.contest.description,
});

export default function Contest() {
  const { contest } = useLoaderData<LoaderData>();

  return (
    <>
      <h1>{contest.title}</h1>
      {/* 比赛导航 */}
      <ul>
        <li>
          <Link to=".">详情</Link>
        </li>
        <li>
          <Link to="edit">编辑</Link>
        </li>
      </ul>
      {/* 比赛页面 */}
      <Outlet />
    </>
  );
}
