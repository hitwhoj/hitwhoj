import { Typography } from "@arco-design/web-react";
import type { LoaderFunction, MetaFunction } from "@remix-run/node";
import { Outlet, useLoaderData } from "@remix-run/react";
import { db } from "~/utils/server/db.server";
import { invariant } from "~/utils/invariant";
import { idScheme } from "~/utils/scheme";
import { Navigator } from "~/src/Navigator";
import { checkContestReadPermission } from "~/utils/permission/contest";
import { ContestTags } from "~/src/contest/ContestTags";
import type { ContestListData } from "~/utils/db/contest";

type LoaderData = {
  contest: ContestListData;
};

export const loader: LoaderFunction<LoaderData> = async ({
  request,
  params,
}) => {
  const contestId = invariant(idScheme, params.contestId, {
    status: 404,
  });

  await checkContestReadPermission(request, contestId);

  const contest = await db.contest.findUnique({
    where: { id: contestId },
    select: {
      id: true,
      title: true,
      system: true,
      beginTime: true,
      endTime: true,
      private: true,
      teamId: true,
      tags: {
        select: {
          name: true,
        },
      },
      _count: {
        select: {
          attendees: true,
        },
      },
    },
  });

  if (!contest) {
    throw new Response("Contest not found", { status: 404 });
  }

  return { contest };
};

export const meta: MetaFunction<LoaderData> = ({ data }) => ({
  title: `比赛: ${data?.contest.title} - HITwh OJ`,
});

export default function ContestView() {
  const { contest } = useLoaderData<LoaderData>();

  return (
    <Typography className="contest-problem-container">
      <Typography.Title heading={3} className="contest-problem-hide">
        {contest.title}
      </Typography.Title>
      <Typography.Paragraph className="contest-problem-hide">
        <ContestTags contest={contest} />
      </Typography.Paragraph>
      <Typography.Paragraph className="contest-problem-hide">
        <Navigator
          routes={[
            { key: ".", title: "详情" },
            { key: "problem", title: "题目" },
            { key: "edit", title: "编辑" },
          ]}
        />
      </Typography.Paragraph>
      <Outlet />
    </Typography>
  );
}

export { ErrorBoundary } from "~/src/ErrorBoundary";
export { CatchBoundary } from "~/src/CatchBoundary";
