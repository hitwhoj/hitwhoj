import type { LoaderFunction, MetaFunction } from "@remix-run/node";
import { Link, useLoaderData } from "@remix-run/react";
import { idScheme } from "~/utils/scheme";
import { invariant } from "~/utils/invariant";
import { Button, Grid, Typography } from "@arco-design/web-react";
import type { ContestListData } from "~/utils/db/contest";
import { selectContestListData } from "~/utils/db/contest";
import { IconPlus } from "@arco-design/web-react/icon";
import { db } from "~/utils/server/db.server";
import { permissionTeamRead } from "~/utils/permission/team";
import { TableList } from "~/src/TableList";
import { ContestLink } from "~/src/contest/ContestLink";
import { ContestSystemTag } from "~/src/contest/ContestSystemTag";
import { formatDateTime } from "~/utils/tools";

type LoaderData = {
  contests: ContestListData[];
};

export const meta: MetaFunction<LoaderData> = () => ({
  title: `团队比赛列表 - HITwh OJ`,
});

export const loader: LoaderFunction<LoaderData> = async ({
  request,
  params,
}) => {
  const teamId = invariant(idScheme, params.teamId);

  await permissionTeamRead.ensure(request, teamId);

  const contests = await db.contest.findMany({
    where: { team: { id: teamId } },
    orderBy: [{ id: "asc" }],
    select: {
      ...selectContestListData,
    },
  });

  return { contests };
};

export default function HomeworkList() {
  const { contests } = useLoaderData<LoaderData>();

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
