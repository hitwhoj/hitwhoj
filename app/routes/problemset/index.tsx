import type { LoaderArgs, MetaFunction } from "@remix-run/node";
import { json } from "@remix-run/node";
import { Link, useLoaderData } from "@remix-run/react";
import { db } from "~/utils/server/db.server";
import { Grid, Button, Typography } from "@arco-design/web-react";
import { IconPlus } from "@arco-design/web-react/icon";
import { ProblemSetLink } from "~/src/problemset/ProblemSetLink";
import { TableList } from "~/src/TableList";
import { findRequestUser } from "~/utils/permission";
import { Permissions } from "~/utils/permission/permission";

export async function loader({ request }: LoaderArgs) {
  const self = await findRequestUser(request);
  const [viewAll, viewPublic, hasEditPerm] = await self
    .team(null)
    .hasPermission(
      Permissions.PERM_VIEW_PROBLEM_SET,
      Permissions.PERM_VIEW_PROBLEM_SET_PUBLIC,
      Permissions.PERM_EDIT_PROBLEM_SET
    );

  const problemSets = await db.problemSet.findMany({
    where: viewAll
      ? { team: null }
      : viewPublic
      ? { team: null, private: false }
      : { id: -1 },
    orderBy: [{ id: "asc" }],
    select: {
      id: true,
      title: true,
      private: true,
      _count: {
        select: {
          problems: true,
        },
      },
    },
  });

  return json({ problemSets, hasEditPerm });
}

export const meta: MetaFunction = () => ({
  title: "题单列表 - HITwh OJ",
});

export default function ProblemsetList() {
  const { problemSets, hasEditPerm } = useLoaderData<typeof loader>();

  return (
    <Typography>
      <Typography.Title heading={3}>
        <Grid.Row justify="space-between" align="center">
          <span>题单列表</span>

          {hasEditPerm && (
            <Link to="new">
              <Button type="primary" icon={<IconPlus />}>
                创建题单
              </Button>
            </Link>
          )}
        </Grid.Row>
      </Typography.Title>

      <Typography.Paragraph>
        <TableList
          data={problemSets}
          columns={[
            {
              title: "#",
              render: ({ id }) => id,
              minimize: true,
            },
            {
              title: "题单",
              render: (problemset) => (
                <ProblemSetLink problemset={problemset} />
              ),
            },
            {
              title: "题目数",
              render: ({ _count: { problems } }) => problems,
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
