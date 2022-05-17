import type { Problem } from "@prisma/client";
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
import { Space, Tabs } from "@arco-design/web-react";
const TabPane = Tabs.TabPane;

type LoaderData = {
  problem: Pick<Problem, "id" | "title" | "description">;
};

export const loader: LoaderFunction<LoaderData> = async ({ params }) => {
  const problemId = invariant(idScheme.safeParse(params.problemId), {
    status: 404,
  });

  const problem = await db.problem.findUnique({
    where: { id: problemId },
    select: {
      id: true,
      title: true,
      description: true,
      private: true,
    },
  });

  if (!problem) {
    throw new Response("Problem not found", { status: 404 });
  }

  return { problem };
};

export const meta: MetaFunction<LoaderData> = ({ data }) => ({
  title: `题目: ${data?.problem.title} - HITwh OJ`,
  description: data?.problem.description,
});

export default function ProblemView() {
  const { problem } = useLoaderData<LoaderData>();
  const navigate = useNavigate();
  const { pathname } = useMatches().at(-1)!;
  const currentTab = pathname.slice(pathname.lastIndexOf("/") + 1) || ".";

  return (
    <Space size="medium" direction="vertical" style={{ display: "block" }}>
      <header>
        <h1>
          <span style={{ color: "grey", marginRight: "20px" }}>
            P{problem.id}
          </span>
          {problem.title}
        </h1>
      </header>
      <Tabs onChange={(key) => navigate(key)} activeTab={currentTab}>
        <TabPane key="." title="题面" />
        <TabPane key="submit" title="提交" />
        <TabPane key="data" title="数据" />
      </Tabs>
      <main>
        <Outlet />
      </main>
    </Space>
  );
}

export { ErrorBoundary } from "~/src/ErrorBoundary";
export { CatchBoundary } from "~/src/CatchBoundary";
