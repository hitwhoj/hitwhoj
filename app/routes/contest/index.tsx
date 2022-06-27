import { Button, Grid, Typography } from "@arco-design/web-react";
import { IconPlus } from "@arco-design/web-react/icon";
import type { LoaderFunction, MetaFunction } from "@remix-run/node";
import { Link, useLoaderData } from "@remix-run/react";
import { useContext } from "react";
import { ContestList } from "~/src/contest/ContestList";
import { UserInfoContext } from "~/utils/context/user";
import type { ContestListData } from "~/utils/db/contest";
import { selectContestListData } from "~/utils/db/contest";
import { isAdmin } from "~/utils/permission";
import { db } from "~/utils/server/db.server";

type LoaderData = {
  contests: ContestListData[];
};

export const loader: LoaderFunction<LoaderData> = async () => {
  const contests = await db.contest.findMany({
    where: { team: null },
    orderBy: [{ id: "asc" }],
    select: {
      ...selectContestListData,
    },
  });

  return { contests };
};

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
        <ContestList contests={contests} />
      </Typography.Paragraph>
    </Typography>
  );
}

export { ErrorBoundary } from "~/src/ErrorBoundary";
export { CatchBoundary } from "~/src/CatchBoundary";
