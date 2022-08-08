import type { LoaderArgs, MetaFunction } from "@remix-run/node";
import { json } from "@remix-run/node";
import { Link, Outlet, useLoaderData } from "@remix-run/react";
import { db } from "~/utils/server/db.server";
import { invariant } from "~/utils/invariant";
import { idScheme } from "~/utils/scheme";
import { Typography, Tag } from "@arco-design/web-react";
import { Navigator } from "~/src/Navigator";
import {
  IconClose,
  IconEyeInvisible,
  IconTag,
} from "@arco-design/web-react/icon";
import { TagSpace } from "~/src/TagSpace";
import { findRequestUser } from "~/utils/permission";
import { Permissions } from "~/utils/permission/permission";
import { findProblemPrivacy, findProblemTeam } from "~/utils/db/problem";

export async function loader({ request, params }: LoaderArgs) {
  const problemId = invariant(idScheme, params.problemId, { status: 404 });
  const self = await findRequestUser(request);
  const team = self.team(await findProblemTeam(problemId));
  await team.checkPermission(
    (await findProblemPrivacy(problemId))
      ? Permissions.PERM_VIEW_PROBLEM
      : Permissions.PERM_VIEW_PROBLEM_PUBLIC
  );
  const [hasEditPerm] = await team.hasPermission(Permissions.PERM_EDIT_PROBLEM);

  const problem = await db.problem.findUnique({
    where: { id: problemId },
    select: {
      id: true,
      title: true,
      description: true,
      private: true,
      allowSubmit: true,
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

  return json({ problem, hasEditPerm });
}

export const meta: MetaFunction<typeof loader> = ({ data }) => ({
  title: `题目: ${data?.problem.title} - HITwh OJ`,
  description: data?.problem.description,
});

export default function ProblemView() {
  const { problem, hasEditPerm } = useLoaderData<typeof loader>();

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
            {!problem.allowSubmit && (
              <Tag icon={<IconClose />} color="red">
                禁止提交
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
          ...(problem.allowSubmit ? [{ title: "提交", key: "submit" }] : []),
          ...(hasEditPerm ? [{ title: "数据", key: "data" }] : []),
          ...(hasEditPerm ? [{ title: "编辑", key: "edit" }] : []),
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
