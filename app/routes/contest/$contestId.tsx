import { Space, Tag, Typography } from "@arco-design/web-react";
import type { Contest, ContestTag, Team } from "@prisma/client";
import type { LoaderFunction, MetaFunction } from "@remix-run/node";
import { redirect } from "@remix-run/node";
import { Link, Outlet, useLoaderData } from "@remix-run/react";
import { db } from "~/utils/server/db.server";
import { invariant } from "~/utils/invariant";
import { idScheme } from "~/utils/scheme";
import { Navigator } from "~/src/Navigator";
import { ContestSystemTag } from "~/src/contest/ContestSystemTag";
import { ContestStateTag } from "~/src/contest/ContestStateTag";
import { IconTag } from "@arco-design/web-react/icon";

type LoaderData = {
  contest: Pick<
    Contest,
    "id" | "title" | "system" | "beginTime" | "endTime"
  > & {
    team: Pick<Team, "id"> | null;
    tags: Pick<ContestTag, "name">[];
  };
};

export const loader: LoaderFunction<LoaderData> = async ({ params }) => {
  const contestId = invariant(idScheme, params.contestId, {
    status: 404,
  });

  const contest = await db.contest.findUnique({
    where: { id: contestId },
    select: {
      id: true,
      title: true,
      system: true,
      beginTime: true,
      endTime: true,
      team: { select: { id: true } },
      tags: {
        select: {
          name: true,
        },
      },
    },
  });

  if (!contest) {
    throw new Response("Contest not found", { status: 404 });
  }

  if (contest.team?.id) {
    throw redirect(`/team/${contest.team.id}/contest/${contest.id}`);
  }

  return { contest };
};

export const meta: MetaFunction<LoaderData> = ({ data }) => ({
  title: `比赛: ${data?.contest.title} - HITwh OJ`,
});

export default function ContestView() {
  const { contest } = useLoaderData<LoaderData>();

  return (
    <Typography>
      <Typography.Title heading={3}>{contest.title}</Typography.Title>
      <Typography.Paragraph>
        <Space>
          <ContestStateTag
            beginTime={contest.beginTime}
            endTime={contest.endTime}
          />
          <ContestSystemTag system={contest.system} />
          {contest.tags.map((tag) => (
            <Tag key={tag.name} icon={<IconTag />}>
              <Link to={`/contest/tag/${tag.name}`}>{tag.name}</Link>
            </Tag>
          ))}
        </Space>
      </Typography.Paragraph>
      <Typography.Paragraph>
        <Navigator
          routes={[
            { key: ".", title: "详情" },
            { key: "problems", title: "题目" },
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
