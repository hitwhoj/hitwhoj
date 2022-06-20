import type { Problem, ProblemTag } from "@prisma/client";
import type { LoaderFunction, MetaFunction } from "@remix-run/node";
import { redirect } from "@remix-run/node";
import { Link, Outlet, useLoaderData } from "@remix-run/react";
import { db } from "~/utils/server/db.server";
import { invariant } from "~/utils/invariant";
import { idScheme } from "~/utils/scheme";
import { Space, Typography, Tag } from "@arco-design/web-react";
import { checkProblemReadPermission } from "~/utils/permission/problem";
import { Navigator } from "~/src/Navigator";
import { IconTag } from "@arco-design/web-react/icon";

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
    <Typography>
      <Typography.Title heading={3}>{problem.title}</Typography.Title>

      <Typography.Paragraph>
        <Space>
          {problem.tags.map((tag) => (
            <Link to={`/problem/tag/${tag.name}`} key={tag.name}>
              <Tag icon={<IconTag />}>{tag.name}</Tag>
            </Link>
          ))}
        </Space>
      </Typography.Paragraph>
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
    </Typography>
  );
}

export { ErrorBoundary } from "~/src/ErrorBoundary";
export { CatchBoundary } from "~/src/CatchBoundary";
