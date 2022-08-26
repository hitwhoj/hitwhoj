import type { LoaderArgs, MetaFunction } from "@remix-run/node";
import { json } from "@remix-run/node";
import { useLoaderData, useParams } from "@remix-run/react";
import { Grid, Typography } from "@arco-design/web-react";
import { db } from "~/utils/server/db.server";
import { invariant } from "~/utils/invariant";
import { tagScheme } from "~/utils/scheme";
import { selectProblemListData } from "~/utils/db/problem";
import { TableList } from "~/src/TableList";
import { ProblemLink } from "~/src/problem/ProblemLink";
import { findRequestUser } from "~/utils/permission";
import { Permissions } from "~/utils/permission/permission";

export async function loader({ request, params }: LoaderArgs) {
  const tag = invariant(tagScheme, params.tag, { status: 404 });
  const self = await findRequestUser(request);
  const [viewAll, viewPublic] = await self
    .team(null)
    .hasPermission(
      Permissions.PERM_VIEW_PROBLEM,
      Permissions.PERM_VIEW_PROBLEM_PUBLIC
    );

  const problems = await db.problem.findMany({
    where: viewAll
      ? { team: null, tags: { some: { name: tag } } }
      : viewPublic
      ? { team: null, tags: { some: { name: tag } }, private: false }
      : { id: -1 },
    orderBy: [{ id: "asc" }],
    select: {
      ...selectProblemListData,
      _count: {
        select: {
          relatedRecords: true,
        },
      },
    },
  });

  return json({ problems });
}

export const meta: MetaFunction<typeof loader> = ({ params }) => ({
  title: `题目标签: ${params.tag} - HITwh OJ`,
});

export default function ProblemIndex() {
  const { problems } = useLoaderData<typeof loader>();
  const params = useParams();

  return (
    <Typography>
      <Typography.Title heading={3}>
        <Grid.Row justify="space-between" align="center">
          题目标签：{params.tag}
        </Grid.Row>
      </Typography.Title>

      <Typography.Paragraph>
        <TableList
          data={problems}
          columns={[
            {
              title: "#",
              render: ({ id }) => id,
              align: "center",
              minimize: true,
            },
            {
              title: "题目",
              render: (problem) => <ProblemLink problem={problem} />,
            },
            {
              title: "提交",
              render: ({ _count: { relatedRecords } }) => relatedRecords,
              align: "center",
              minimize: true,
            },
          ]}
        />
      </Typography.Paragraph>
    </Typography>
  );
}

export { ErrorBoundary } from "~/src/ErrorBoundary";
export { CatchBoundary } from "~/src/CatchBoundary";
