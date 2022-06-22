import { Descriptions, Typography } from "@arco-design/web-react";
import type { Contest, ContestTag, Team } from "@prisma/client";
import type { LoaderFunction, MetaFunction } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { db } from "~/utils/server/db.server";
import { invariant } from "~/utils/invariant";
import { idScheme } from "~/utils/scheme";
import { Markdown } from "~/src/Markdown";
import { checkContestReadPermission } from "~/utils/permission/contest";
import { formatDateTime } from "~/utils/tools";
import { TeamLink } from "~/src/team/TeamLink";

type LoaderData = {
  contest: Pick<
    Contest,
    "id" | "title" | "description" | "beginTime" | "endTime"
  > & {
    tags: Pick<ContestTag, "name">[];
    team: Pick<Team, "id" | "name"> | null;
  };
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
      description: true,
      beginTime: true,
      endTime: true,
      tags: {
        select: {
          name: true,
        },
      },
      team: {
        select: {
          id: true,
          name: true,
        },
      },
    },
  });

  if (!contest) {
    throw new Response("Contest not found", { status: 404 });
  }

  return {
    contest,
  };
};

export const meta: MetaFunction<LoaderData> = ({ data }) => ({
  title: `比赛: ${data?.contest.title} - HITwh OJ`,
  description: data?.contest.description,
});

export default function ContestIndex() {
  const { contest } = useLoaderData<LoaderData>();

  return (
    <Typography>
      <Descriptions
        column={1}
        title="比赛信息"
        data={[
          {
            label: "开始时间",
            value: formatDateTime(contest.beginTime),
          },
          {
            label: "结束时间",
            value: formatDateTime(contest.endTime),
          },
          {
            label: "比赛时长",
            value: `${(
              (new Date(contest.endTime).getTime() -
                new Date(contest.beginTime).getTime()) /
              3_600_000
            ).toFixed(1)} 小时`,
          },
          ...(contest.team
            ? [
                {
                  label: "所属团队",
                  value: <TeamLink team={contest.team} />,
                },
              ]
            : []),
        ]}
        labelStyle={{ paddingRight: 36 }}
      />
      <Markdown>{contest.description}</Markdown>
    </Typography>
  );
}

export { ErrorBoundary } from "~/src/ErrorBoundary";
export { CatchBoundary } from "~/src/CatchBoundary";
