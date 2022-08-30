import { Button, Descriptions, Typography } from "@arco-design/web-react";
import type { LoaderArgs, MetaFunction } from "@remix-run/node";
import { json } from "@remix-run/node";
import { Link, useLoaderData } from "@remix-run/react";
import { db } from "~/utils/server/db.server";
import { invariant } from "~/utils/invariant";
import { idScheme } from "~/utils/scheme";
import { Markdown } from "~/src/Markdown";
import { formatDateTime } from "~/utils/tools";
import { TeamLink } from "~/src/team/TeamLink";
import { findRequestUser } from "~/utils/permission";
import { Permissions } from "~/utils/permission/permission";
import {
  findContestParticipantRole,
  findContestPrivacy,
  findContestStatus,
  findContestTeam,
} from "~/utils/db/contest";

export async function loader({ request, params }: LoaderArgs) {
  const contestId = invariant(idScheme, params.contestId, { status: 404 });
  const self = await findRequestUser(request);
  await self
    .team(await findContestTeam(contestId))
    .contest(contestId)
    .checkPermission(
      (await findContestPrivacy(contestId))
        ? Permissions.PERM_VIEW_CONTEST
        : Permissions.PERM_VIEW_CONTEST_PUBLIC
    );

  const contest = await db.contest.findUnique({
    where: { id: contestId },
    select: {
      id: true,
      title: true,
      description: true,
      beginTime: true,
      endTime: true,
      private: true,
      registrationType: true,
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

  const registered = self.userId
    ? await findContestParticipantRole(contestId, self.userId)
    : null;
  const status = await findContestStatus(contestId);

  return json({ contest, registered, status });
}

export const meta: MetaFunction<typeof loader> = ({ data }) => ({
  title: `比赛: ${data?.contest.title} - HITwh OJ`,
  description: data?.contest.description,
});

export default function ContestIndex() {
  const { contest, registered, status } = useLoaderData<typeof loader>();

  const isMod = registered === "Mod";
  const isJury = registered === "Jury";
  const isAttendee = registered === "Contestant";

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

      <Typography.Paragraph>
        {isMod ? (
          <i>您已经是比赛的管理员</i>
        ) : isJury ? (
          <i>您已经是比赛的裁判</i>
        ) : isAttendee ? (
          <i>您已经报名了该比赛</i>
        ) : contest.private ? (
          <i>无法报名私有比赛</i>
        ) : status === "Running" ? (
          <i>比赛已经开始</i>
        ) : status === "Ended" ? (
          <i>比赛已经结束</i>
        ) : contest.registrationType === "Disallow" ? (
          <i>报名已经关闭</i>
        ) : (
          <Link to="register">
            <Button type="primary">报名比赛</Button>
          </Link>
        )}
      </Typography.Paragraph>
    </Typography>
  );
}

export { ErrorBoundary } from "~/src/ErrorBoundary";
export { CatchBoundary } from "~/src/CatchBoundary";
