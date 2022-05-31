import { Typography } from "@arco-design/web-react";
import type { LoaderFunction, MetaFunction } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { ContestList } from "~/src/contest/ContestList";
import type { ContestListData } from "~/utils/db/contest";
import { findContestList } from "~/utils/db/contest";

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

  return (
    <Typography>
      <Typography.Title heading={2}>比赛列表</Typography.Title>
      <Typography.Paragraph>
        <ContestList contests={contests} />
      </Typography.Paragraph>
    </Typography>
  );
}

export { ErrorBoundary } from "~/src/ErrorBoundary";
export { CatchBoundary } from "~/src/CatchBoundary";
