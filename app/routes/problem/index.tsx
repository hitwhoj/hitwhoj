import type { LoaderArgs, MetaFunction } from "@remix-run/node";
import { json } from "@remix-run/node";
import { Link, useLoaderData } from "@remix-run/react";
import { Button, Grid, Typography } from "@arco-design/web-react";
import { selectProblemListData } from "~/utils/db/problem";
import { db } from "~/utils/server/db.server";
import { IconPlus } from "@arco-design/web-react/icon";
import { TableList } from "~/src/TableList";
import { ProblemLink } from "~/src/problem/ProblemLink";
import { findRequestUser } from "~/utils/permission";
import { Permissions } from "~/utils/permission/permission";

export async function loader({ request }: LoaderArgs) {
  const self = await findRequestUser(request);
  const [viewAll, viewPublic, hasCreatePerm] = await self
    .team(null)
    .hasPermission(
      Permissions.PERM_VIEW_PROBLEM,
      Permissions.PERM_VIEW_PROBLEM_PUBLIC,
      Permissions.PERM_CREATE_PROBLEM
    );

  const problems = await db.problem.findMany({
    where: viewAll
      ? { team: null }
      : viewPublic
      ? { team: null, private: false }
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

  return json({ problems, hasCreatePerm });
}

export const meta: MetaFunction = () => ({
  title: "题目列表 - HITwh OJ",
});

export default function ProblemIndex() {
  const { problems, hasCreatePerm } = useLoaderData<typeof loader>();

  return (
    <Typography>
      <Typography.Title heading={3}>
        <Grid.Row justify="space-between" align="center">
          题目列表
          {hasCreatePerm && (
            <Link to="/problem/new">
              <Button type="primary" icon={<IconPlus />}>
                新建题目
              </Button>
            </Link>
          )}
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
