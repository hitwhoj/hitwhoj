import type { LoaderArgs, MetaFunction } from "@remix-run/node";
import { json } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { db } from "~/utils/server/db.server";
import { invariant } from "~/utils/invariant";
import { idScheme } from "~/utils/scheme";
import { Typography } from "@arco-design/web-react";
import { Markdown } from "~/src/Markdown";
import { selectProblemListData } from "~/utils/db/problem";
import { TableList } from "~/src/TableList";
import { ProblemLink } from "~/src/problem/ProblemLink";
import { findRequestUser } from "~/utils/permission";
import { Permissions } from "~/utils/permission/permission";
import {
  findProblemSetPrivacy,
  findProblemSetTeam,
} from "~/utils/db/problemset";

export async function loader({ request, params }: LoaderArgs) {
  const problemSetId = invariant(idScheme, params.problemSetId, {
    status: 404,
  });
  const self = await findRequestUser(request);
  await self
    .team(await findProblemSetTeam(problemSetId))
    .checkPermission(
      (await findProblemSetPrivacy(problemSetId))
        ? Permissions.PERM_VIEW_PROBLEM_SET
        : Permissions.PERM_VIEW_PROBLEM_SET_PUBLIC
    );

  const problemSet = await db.problemSet.findUnique({
    where: { id: problemSetId },
    select: {
      id: true,
      title: true,
      description: true,
      tags: true,
      problems: {
        orderBy: { rank: "asc" },
        select: {
          rank: true,
          problem: {
            select: {
              ...selectProblemListData,
            },
          },
        },
      },
    },
  });

  if (!problemSet) {
    throw new Response("Problem Set not found", { status: 404 });
  }

  return json({ problemSet });
}

export const meta: MetaFunction<typeof loader> = ({ data }) => ({
  title: `题单: ${data?.problemSet.title} - HITwh OJ`,
  description: data?.problemSet.description,
});

export default function ProblemSetIndex() {
  const { problemSet } = useLoaderData<typeof loader>();

  return (
    <Typography>
      <Markdown>{problemSet.description}</Markdown>

      <Typography.Title heading={4}>题目</Typography.Title>

      <Typography.Paragraph>
        <TableList
          data={problemSet.problems.map(({ problem }) => problem)}
          columns={[
            {
              title: "#",
              render: (_, index) => index + 1,
              align: "center",
              minimize: true,
            },
            {
              title: "题目",
              render: (problem) => <ProblemLink problem={problem} />,
            },
          ]}
        />
      </Typography.Paragraph>
    </Typography>
  );
}

export { ErrorBoundary } from "~/src/ErrorBoundary";
export { CatchBoundary } from "~/src/CatchBoundary";
