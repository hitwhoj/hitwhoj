import { Tabs } from "@arco-design/web-react";
import type { Contest } from "@prisma/client";
import type { LoaderFunction, MetaFunction } from "@remix-run/node";
import {
  Outlet,
  useLoaderData,
  useMatches,
  useNavigate,
} from "@remix-run/react";
import { db } from "~/utils/server/db.server";
import { invariant } from "~/utils/invariant";
import { idScheme } from "~/utils/scheme";
const TabPane = Tabs.TabPane;

type LoaderData = {
  contest: Contest;
};

export const loader: LoaderFunction<LoaderData> = async ({ params }) => {
  const contestId = invariant(idScheme, params.contestId, {
    status: 404,
  });

  const contest = await db.contest.findUnique({
    where: { id: contestId },
  });

  if (!contest) {
    throw new Response("Contest not found", { status: 404 });
  }

  return { contest };
};

export const meta: MetaFunction<LoaderData> = ({ data }) => ({
  title: `比赛: ${data?.contest.title} - HITwh OJ`,
  description: data?.contest.description,
});

export default function ContestView() {
  const { contest } = useLoaderData<LoaderData>();
  const navigate = useNavigate();
  const { pathname } = useMatches().at(-1)!;
  const currentTab = pathname.slice(pathname.lastIndexOf("/") + 1) || ".";

  return (
    <>
      <h1>{contest.title}</h1>
      <Tabs onChange={(key) => navigate(key)} activeTab={currentTab}>
        <TabPane key="." title="详情" />
        <TabPane key="edit" title="编辑" />
      </Tabs>
      <Outlet />
    </>
  );
}

export { ErrorBoundary } from "~/src/ErrorBoundary";
export { CatchBoundary } from "~/src/CatchBoundary";
