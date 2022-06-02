import { Button, Typography } from "@arco-design/web-react";
import { IconPlus } from "@arco-design/web-react/icon";
import type { LoaderFunction, MetaFunction } from "@remix-run/node";
import { Link, useLoaderData } from "@remix-run/react";
import { useContext } from "react";
import { ContestList } from "~/src/contest/ContestList";
import { UserInfoContext } from "~/utils/context/user";
import type { ContestListData } from "~/utils/db/contest";
import { findContestList } from "~/utils/db/contest";
import { isAdmin } from "~/utils/permission";

type LoaderData = {
  contests: ContestListData[];
};

export const loader: LoaderFunction<LoaderData> = async () => {
  const contests = await findContestList({});

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
      <Typography.Title heading={2}>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <span>比赛列表</span>
          {user && isAdmin(user.role) && (
            <Button type="primary" icon={<IconPlus />}>
              <Link to="/contest/new" style={{ display: "inline-flex" }}>
                新建比赛
              </Link>
            </Button>
          )}
        </div>
      </Typography.Title>
      <Typography.Paragraph>
        <ContestList contests={contests} />
      </Typography.Paragraph>
    </Typography>
  );
}

export { ErrorBoundary } from "~/src/ErrorBoundary";
export { CatchBoundary } from "~/src/CatchBoundary";
