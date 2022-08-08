import type { LoaderArgs, MetaFunction } from "@remix-run/node";
import { json } from "@remix-run/node";
import { Link, useLoaderData } from "@remix-run/react";
import { idScheme } from "~/utils/scheme";
import { invariant } from "~/utils/invariant";
import { Button, Grid, Typography } from "@arco-design/web-react";
import { selectContestListData } from "~/utils/db/contest";
import { IconPlus } from "@arco-design/web-react/icon";
import { db } from "~/utils/server/db.server";
import { TableList } from "~/src/TableList";
import { ContestLink } from "~/src/contest/ContestLink";
import { ContestSystemTag } from "~/src/contest/ContestSystemTag";
import { formatDateTime } from "~/utils/tools";

export async function loader({ params }: LoaderArgs) {
  const teamId = invariant(idScheme, params.teamId, { status: 404 });

  const contests = await db.contest.findMany({
    where: { team: { id: teamId } },
    orderBy: [{ id: "asc" }],
    select: {
      ...selectContestListData,
    },
  });

  return json({ contests });
}

export const meta: MetaFunction = () => ({
  title: `团队比赛列表 - HITwh OJ`,
});

export default function HomeworkList() {
  const { contests } = useLoaderData<typeof loader>();

  return (
    <Typography>
      <Typography.Title heading={4}>
        <Grid.Row justify="space-between" align="center">
          <span>团队比赛</span>
          <Link to="new">
            <Button type="primary" icon={<IconPlus />}>
              创建比赛
            </Button>
          </Link>
        </Grid.Row>
      </Typography.Title>

      <Typography.Paragraph>
        <TableList
          data={contests}
          columns={[
            {
              title: "标题",
              render: (contest) => <ContestLink contest={contest} />,
            },
            {
              title: "赛制",
              render: ({ system }) => <ContestSystemTag system={system} />,
              align: "center",
              minimize: true,
            },
            {
              title: "开始时间",
              render: ({ beginTime }) => formatDateTime(beginTime),
              align: "center",
              minimize: true,
            },
            {
              title: "结束时间",
              render: ({ endTime }) => formatDateTime(endTime),
              align: "center",
              minimize: true,
            },
          ]}
        />
      </Typography.Paragraph>
    </Typography>
  );
}

export { CatchBoundary } from "~/src/CatchBoundary";
export { ErrorBoundary } from "~/src/ErrorBoundary";
