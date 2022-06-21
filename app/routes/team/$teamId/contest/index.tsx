import type { LoaderFunction, MetaFunction } from "@remix-run/node";
import { Link, useLoaderData } from "@remix-run/react";
import { idScheme } from "~/utils/scheme";
import { invariant } from "~/utils/invariant";
import { Button, Grid, Typography } from "@arco-design/web-react";
import type { ContestListData } from "~/utils/db/contest";
import { findContestList } from "~/utils/db/contest";
import { ContestList } from "~/src/contest/ContestList";
import { IconPlus } from "@arco-design/web-react/icon";

type LoaderData = {
  contests: ContestListData[];
};

export const meta: MetaFunction<LoaderData> = () => ({
  title: `Team Homework - HITwh OJ`,
});

export const loader: LoaderFunction<LoaderData> = async ({ params }) => {
  const teamId = invariant(idScheme, params.teamId);

  const contests = await findContestList({ teamId });

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
        <ContestList contests={contests} />
      </Typography.Paragraph>
    </Typography>
  );
}