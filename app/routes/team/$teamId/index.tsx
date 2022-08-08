import type { LoaderFunction, MetaFunction } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { db } from "~/utils/server/db.server";
import type { Team } from "@prisma/client";
import { invariant } from "~/utils/invariant";
import { idScheme } from "~/utils/scheme";
import { Descriptions, Typography } from "@arco-design/web-react";
import { Markdown } from "~/src/Markdown";
import { formatDateTime } from "~/utils/tools";

type LoaderData = {
  team: Pick<Team, "id" | "name" | "description" | "createdAt"> & {
    _count: {
      members: number;
      contests: number;
      problems: number;
      problemSets: number;
    };
  };
};

export const meta: MetaFunction<LoaderData> = ({ data }) => ({
  title: `团队: ${data?.team.name} - HITwh OJ`,
});

export function loader({ params }: LoaderArgs) {
  const teamId = invariant(idScheme, params.teamId);
  const team = await db.team.findUnique({
    where: { id: teamId },
    select: {
      id: true,
      name: true,
      description: true,
      createdAt: true,
      _count: {
        select: {
          members: true,
          contests: true,
          problems: true,
          problemSets: true,
        },
      },
    },
  });

  if (!team) {
    throw new Response("Team not found", { status: 404 });
  }

  return { team };
}

export default function TeamDetail() {
  const { team } = useLoaderData<LoaderData>();

  return (
    <Typography>
      <Typography.Paragraph>
        <Descriptions
          title="团队信息"
          column={1}
          labelStyle={{ paddingRight: 36 }}
          data={[
            { label: "创建时间", value: formatDateTime(team.createdAt) },
            { label: "成员数量", value: team._count.members },
            { label: "题目数量", value: team._count.problems },
            { label: "题单数量", value: team._count.problemSets },
            { label: "比赛数量", value: team._count.contests },
          ]}
        />
      </Typography.Paragraph>

      <Markdown>{team.description}</Markdown>
    </Typography>
  );
}

export { CatchBoundary } from "~/src/CatchBoundary";
export { ErrorBoundary } from "~/src/ErrorBoundary";
