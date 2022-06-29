import type { Problem, ProblemTag } from "@prisma/client";
import type { LoaderFunction, MetaFunction } from "@remix-run/node";
import { Link, Outlet, useLoaderData } from "@remix-run/react";
import { db } from "~/utils/server/db.server";
import { invariant } from "~/utils/invariant";
import { idScheme } from "~/utils/scheme";
import { Typography, Tag } from "@arco-design/web-react";
import { checkProblemReadPermission } from "~/utils/permission/problem";
import { Navigator } from "~/src/Navigator";
import { IconTag } from "@arco-design/web-react/icon";
import { TagSpace } from "~/src/TagSpace";
import { useContext } from "react";
import { UserInfoContext } from "~/utils/context/user";
import { isAdmin } from "~/utils/permission";

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

  return { problem };
};

export const meta: MetaFunction<LoaderData> = ({ data }) => ({
  title: `题目: ${data?.problem.title} - HITwh OJ`,
  description: data?.problem.description,
});

export default function ProblemView() {
  const { problem } = useLoaderData<LoaderData>();
  const self = useContext(UserInfoContext);

  return (
    <Typography>
      <Typography.Title heading={3}>{problem.title}</Typography.Title>

      {problem.tags.length > 0 && (
        <Typography.Paragraph>
          <TagSpace>
            {problem.tags.map((tag) => (
              <Link to={`/problem/tag/${tag.name}`} key={tag.name}>
                <Tag icon={<IconTag />}>{tag.name}</Tag>
              </Link>
            ))}
          </TagSpace>
        </Typography.Paragraph>
      )}

      <Navigator
        routes={[
          { title: "题面", key: "." },
          { title: "提交", key: "submit" },
          ...(self && isAdmin(self?.role)
            ? [{ title: "数据", key: "data" }]
            : []),
        ]}
      />

      <Typography.Paragraph>
        <Outlet />
      </Typography.Paragraph>
    </Typography>
  );
}

export { ErrorBoundary } from "~/src/ErrorBoundary";
export { CatchBoundary } from "~/src/CatchBoundary";
