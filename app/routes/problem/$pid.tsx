import type { Problem } from "@prisma/client";
import {
  LoaderFunction,
  json,
  useLoaderData,
  MetaFunction,
  Outlet,
  useNavigate,
  useMatches,
} from "remix";
import { db } from "~/utils/db.server";
import { invariant } from "~/utils/invariant";
import { guaranteePermission, Permissions } from "~/utils/permission";
import { idScheme } from "~/utils/scheme";
import { Tabs } from "@arco-design/web-react";
const TabPane = Tabs.TabPane;

type LoaderData = {
  problem: Pick<Problem, "pid" | "title" | "description">;
};

export const loader: LoaderFunction = async ({ request, params }) => {
  const pid = invariant(idScheme.safeParse(params.pid), { status: 404 });

  const problem = await db.problem.findUnique({
    where: { pid },
    select: {
      pid: true,
      title: true,
      description: true,
      private: true,
    },
  });

  if (!problem) {
    throw new Response("Problem not found", { status: 404 });
  }

  // 检查访问权限
  if (problem.private) {
    await guaranteePermission(request, Permissions.Problem.ViewPrivate, {
      pid,
    });
  } else {
    await guaranteePermission(request, Permissions.Problem.ViewPublic, { pid });
  }

  return json({ problem });
};

export const meta: MetaFunction = ({ data }: { data?: LoaderData }) => ({
  title: `题目: ${data?.problem.title} - HITwh OJ`,
  description: data?.problem.description,
});

export default function ProblemView() {
  const { problem } = useLoaderData<LoaderData>();
  const navigate = useNavigate();
  const { pathname } = useMatches().at(-1)!;
  const currentTab = pathname.slice(pathname.lastIndexOf("/") + 1) || ".";

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
      <Tabs onChange={(key) => navigate(key)} activeTab={currentTab}>
        <TabPane key="." title="题面" />
        <TabPane key="submit" title="提交" />
        <TabPane key="data" title="数据" />
      </Tabs>
      <Outlet />
    </div>
  );
}

export { ErrorBoundary } from "~/src/ErrorBoundary";
export { CatchBoundary } from "~/src/CatchBoundary";
