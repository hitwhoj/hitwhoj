import type { Problem, ProblemTag } from "@prisma/client";
import type { LoaderFunction, MetaFunction } from "@remix-run/node";
import { Link, Outlet, useLoaderData } from "@remix-run/react";
import { db } from "~/utils/server/db.server";
import { invariant } from "~/utils/invariant";
import { idScheme } from "~/utils/scheme";
import { Typography, Tag } from "@arco-design/web-react";
import { Navigator } from "~/src/Navigator";
import { IconEyeInvisible, IconTag } from "@arco-design/web-react/icon";
import { TagSpace } from "~/src/TagSpace";
import { useContext } from "react";
import { UserInfoContext } from "~/utils/context/user";
import { isAdmin, isUser } from "~/utils/permission";
import { permissionProblemRead } from "~/utils/permission/problem";

type LoaderData = {
  problem: Pick<Problem, "id" | "title" | "description" | "private"> & {
    tags: Pick<ProblemTag, "name">[];
  };
};

export const loader: LoaderFunction<LoaderData> = async ({
  params,
  request,
}) => {
  const problemId = invariant(idScheme, params.problemId, { status: 404 });
  await permissionProblemRead.ensure(request, problemId);

  const problem = await db.problem.findUnique({
    where: { id: problemId },
    select: {
      id: true,
      title: true,
      description: true,
      private: true,
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

      {(problem.tags.length > 0 || problem.private) && (
        <Typography.Paragraph>
          <TagSpace>
            {problem.private && (
              <Tag icon={<IconEyeInvisible />} color="gold">
                隐藏
              </Tag>
            )}
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
          ...(self && isUser(self.role)
            ? [{ title: "提交", key: "submit" }]
            : [{ title: "登录后提交", key: "submit" }]),
          ...(self && isAdmin(self.role)
            ? [
                { title: "数据", key: "data" },
                { title: "编辑", key: "edit" },
              ]
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
