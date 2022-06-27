import { Button, Grid, Typography } from "@arco-design/web-react";
import { IconPlus } from "@arco-design/web-react/icon";
import type { LoaderFunction, MetaFunction } from "@remix-run/node";
import { Link, useLoaderData } from "@remix-run/react";
import { useContext } from "react";
import { ContestList } from "~/src/contest/ContestList";
import { UserInfoContext } from "~/utils/context/user";
import type { ContestListData } from "~/utils/db/contest";
import { findContestList } from "~/utils/db/contest";
import { isAdmin } from "~/utils/permission";
import { findSessionUserOptional } from "~/utils/sessions";

type LoaderData = {
  contests: ContestListData[];
};

export const loader: LoaderFunction<LoaderData> = async ({ request }) => {
  const self = await findSessionUserOptional(request);

  let contests: ContestListData[];

  // 访客只能看到公开的比赛
  if (!self) {
    contests = await findContestList({ private: false });
  }
  // 管理员可以看到所有比赛
  else if (isAdmin(self.role)) {
    contests = await findContestList({});
  }
  // 普通用户只能看到公开比赛以及自己创建、管理、裁判、参加的比赛
  else {
    contests = await findContestList({
      OR: [
        { private: false },
        { creator: { id: self.id } },
        { mods: { some: { id: self.id } } },
        { juries: { some: { id: self.id } } },
        { attendees: { some: { id: self.id } } },
      ],
    });
  }

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
