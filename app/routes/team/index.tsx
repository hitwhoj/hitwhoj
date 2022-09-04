import type { LoaderArgs, MetaFunction } from "@remix-run/node";
import { json } from "@remix-run/node";
import { Link, useLoaderData } from "@remix-run/react";
import { db } from "~/utils/server/db.server";
import { Button, Grid, Typography } from "@arco-design/web-react";
import { IconPlus } from "@arco-design/web-react/icon";
import { TableList } from "~/src/TableList";
import { TeamLink } from "~/src/team/TeamLink";

export const meta: MetaFunction = () => ({
  title: "团队列表 - HITwh OJ",
});

export async function loader(_: LoaderArgs) {
  const teams = await db.team.findMany({
    take: 20,
    orderBy: { name: "asc" },
  });

  return json({ teams });
}

export default function TeamList() {
  const { teams } = useLoaderData<typeof loader>();

  return (
    <Typography>
      <Typography.Title heading={3}>
        <Grid.Row justify="space-between" align="center">
          <span>团队列表</span>
          <Link to="new">
            <Button type="primary" icon={<IconPlus />}>
              创建团队
            </Button>
          </Link>
        </Grid.Row>
      </Typography.Title>

      <Typography.Paragraph>
        <TableList
          data={teams}
          columns={[
            {
              title: "#",
              render: ({ id }) => id,
              minimize: true,
            },
            {
              title: "团队",
              render: (team) => <TeamLink team={team} />,
            },
          ]}
        />
      </Typography.Paragraph>
    </Typography>
  );
}

export { CatchBoundary } from "~/src/CatchBoundary";
export { ErrorBoundary } from "~/src/ErrorBoundary";
