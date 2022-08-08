import { Button, Grid, Typography } from "@arco-design/web-react";
import { IconPlus } from "@arco-design/web-react/icon";
import type { LoaderFunction, MetaFunction } from "@remix-run/node";
import { Link, useLoaderData } from "@remix-run/react";
import { useContext } from "react";
import { ContestLink } from "~/src/contest/ContestLink";
import { ContestSystemTag } from "~/src/contest/ContestSystemTag";
import { TableList } from "~/src/TableList";
import { UserInfoContext } from "~/utils/context/user";
import type { ContestListData } from "~/utils/db/contest";
import { selectContestListData } from "~/utils/db/contest";
import { isAdmin } from "~/utils/permission";
import { db } from "~/utils/server/db.server";
import { findSessionUserOptional } from "~/utils/sessions";
import { formatDateTime } from "~/utils/tools";

type LoaderData = {
  contests: ContestListData[];
};

export function loader({ request }: LoaderArgs) {
  const self = await findSessionUserOptional(request);

  const contests = await db.contest.findMany({
    // 只有系统管理员可以看到私有比赛
    where:
      self && isAdmin(self.role)
        ? { team: null }
        : { team: null, private: false },
    orderBy: [{ id: "asc" }],
    select: {
      ...selectContestListData,
    },
  });

  return { contests };
}

export const meta: MetaFunction = () => ({
  title: "比赛列表 - HITwh OJ",
});

export default function ContestListIndex() {
  const { contests } = useLoaderData<LoaderData>();
  const user = useContext(UserInfoContext);

  return (
    <Typography>
      <Typography.Title heading={3}>
        <Grid.Row justify="space-between" align="center">
          比赛列表
          {user && isAdmin(user.role) && (
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
