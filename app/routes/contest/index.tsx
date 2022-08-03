import { Button, Grid, Typography } from "@arco-design/web-react";
import { IconPlus } from "@arco-design/web-react/icon";
import type { LoaderFunction, MetaFunction } from "@remix-run/node";
import { Link, useLoaderData } from "@remix-run/react";
import { ContestLink } from "~/src/contest/ContestLink";
import { ContestSystemTag } from "~/src/contest/ContestSystemTag";
import { TableList } from "~/src/TableList";
import type { ContestListData } from "~/utils/db/contest";
import { selectContestListData } from "~/utils/db/contest";
import { findRequestUser } from "~/utils/permission";
import { Permissions } from "~/utils/permission/permission";
import { db } from "~/utils/server/db.server";
import { formatDateTime } from "~/utils/tools";

type LoaderData = {
  contests: ContestListData[];
  hasCreatePerm: boolean;
};

export const loader: LoaderFunction<LoaderData> = async ({ request }) => {
  const self = await findRequestUser(request);
  const [hasCreatePerm] = await self
    .team(null)
    .hasPermission(Permissions.PERM_CREATE_CONTEST);
  const [viewAll, viewPublic] = await self
    .team(null)
    .contest(null)
    .hasPermission(
      Permissions.PERM_VIEW_CONTEST,
      Permissions.PERM_VIEW_CONTEST_PUBLIC
    );

  const contests = await db.contest.findMany({
    where: viewAll
      ? { team: null }
      : viewPublic
      ? { team: null, private: false }
      : { id: -1 },
    orderBy: [{ id: "asc" }],
    select: {
      ...selectContestListData,
    },
  });

  return { contests, hasCreatePerm };
};

export const meta: MetaFunction = () => ({
  title: "比赛列表 - HITwh OJ",
});

export default function ContestListIndex() {
  const { contests, hasCreatePerm } = useLoaderData<LoaderData>();

  return (
    <Typography>
      <Typography.Title heading={3}>
        <Grid.Row justify="space-between" align="center">
          比赛列表
          {hasCreatePerm && (
            <Link to="/contest/new">
              <Button type="primary" icon={<IconPlus />}>
                新建比赛
              </Button>
            </Link>
          )}
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

export { ErrorBoundary } from "~/src/ErrorBoundary";
export { CatchBoundary } from "~/src/CatchBoundary";
