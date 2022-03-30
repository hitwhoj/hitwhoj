import { ProblemSet } from "@prisma/client";
import {
  json,
  useNavigate,
  LoaderFunction,
  MetaFunction,
  Outlet,
  useLoaderData,
  useMatches,
} from "remix";
import { db } from "~/utils/db.server";
import { invariant } from "~/utils/invariant";
import { idScheme } from "~/utils/scheme";
import { Tabs } from "@arco-design/web-react";
const TabPane = Tabs.TabPane;

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
  const navigate = useNavigate();
  const { pathname } = useMatches().at(-1)!;
  const currentTab = pathname.slice(pathname.lastIndexOf("/") + 1) || ".";

  return (
    <>
      <h1>{problemSet.title}</h1>
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
