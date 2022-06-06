import type { Problem, ProblemTag } from "@prisma/client";
import type { LoaderFunction, MetaFunction } from "@remix-run/node";
import { redirect } from "@remix-run/node";
import { Link, Outlet, useLoaderData } from "@remix-run/react";
import { db } from "~/utils/server/db.server";
import { invariant } from "~/utils/invariant";
import { idScheme } from "~/utils/scheme";
import { Space, Link as ArcoLink } from "@arco-design/web-react";
import { checkProblemReadPermission } from "~/utils/permission/problem";
import { Navigator } from "~/src/Navigator";

type LoaderData = {
  problem: Pick<Problem, "id" | "title" | "description"> & {
    tags: Pick<ProblemTag, "name">[];
  };
};

export const loader: LoaderFunction<LoaderData> = async ({
  params,
  request,
}) => {
  const problemId = invariant(idScheme, params.problemId, {
    status: 404,
  });

  await checkProblemReadPermission(request, problemId);

  const problem = await db.problem.findUnique({
    where: { id: problemId },
    select: {
      id: true,
      title: true,
      description: true,
      teamId: true,
      tags: {
        select: {
          name: true,
        },
      },
    },
  });

  if (!problem) {
    throw new Response("Problem not found", { status: 404 });
  }

  if (problem.teamId) {
    throw redirect(`/team/${problem.teamId}/problem/${problem.id}`);
  }

  return { problem };
};

export const meta: MetaFunction<LoaderData> = ({ data }) => ({
  title: `题目: ${data?.problem.title} - HITwh OJ`,
  description: data?.problem.description,
});

export default function ProblemView() {
  const { problem } = useLoaderData<LoaderData>();

  return (
    <Space direction="vertical" style={{ display: "block" }}>
      <header>
        <h1 style={{ margin: 0 }}>{problem.title}</h1>
        <Space>
          {problem.tags.map((tag) => (
            <ArcoLink key={tag.name}>
              <Link to={`/problem/tag/${tag.name}`}>#{tag.name}</Link>
            </ArcoLink>
          ))}
        </Space>
      </header>
      <Navigator
        routes={[
          { key: ".", title: "题面" },
          { key: "submit", title: "提交" },
          { key: "data", title: "数据" },
        ]}
      />
      <main>
        <Outlet />
      </main>
    </Space>
  );
}

export { ErrorBoundary } from "~/src/ErrorBoundary";
export { CatchBoundary } from "~/src/CatchBoundary";
