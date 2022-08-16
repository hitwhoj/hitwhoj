import { Button, Descriptions, Typography } from "@arco-design/web-react";
import type { Contest, ContestTag, Team, User } from "@prisma/client";
import type { LoaderFunction, MetaFunction } from "@remix-run/node";
import { Link, useLoaderData } from "@remix-run/react";
import { db } from "~/utils/server/db.server";
import { invariant } from "~/utils/invariant";
import { idScheme } from "~/utils/scheme";
import { Markdown } from "~/src/Markdown";
import { formatDateTime } from "~/utils/tools";
import { TeamLink } from "~/src/team/TeamLink";
import { findSessionUserOptional } from "~/utils/sessions";
import { useContext } from "react";
import { UserInfoContext } from "~/utils/context/user";
import { permissionContestInfoRead } from "~/utils/permission/contest";

type LoaderData = {
  contest: Pick<
    Contest,
    | "id"
    | "title"
    | "description"
    | "beginTime"
    | "endTime"
    | "private"
    | "allowPublicRegistration"
    | "allowAfterRegistration"
  > & {
    tags: Pick<ContestTag, "name">[];
    team: Pick<Team, "id" | "name"> | null;
    mods: Pick<User, "id">[];
    juries: Pick<User, "id">[];
    attendees: Pick<User, "id">[];
  };
};

export const loader: LoaderFunction<LoaderData> = async ({
  request,
  params,
}) => {
  const contestId = invariant(idScheme, params.contestId, { status: 404 });
  await permissionContestInfoRead.ensure(request, contestId);
  const self = await findSessionUserOptional(request);

  const contest = await db.contest.findUnique({
    where: { id: contestId },
    select: {
      id: true,
      title: true,
      description: true,
      beginTime: true,
      endTime: true,
      private: true,
      allowPublicRegistration: true,
      allowAfterRegistration: true,
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
      mods: { where: { id: self ? self.id : -1 }, select: { id: true } },
      juries: { where: { id: self ? self.id : -1 }, select: { id: true } },
      attendees: { where: { id: self ? self.id : -1 }, select: { id: true } },
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

  const isPending = new Date() < new Date(contest.beginTime);
  const isRunning =
    new Date() > new Date(contest.beginTime) &&
    new Date() < new Date(contest.endTime);

  const isMod = contest.mods.length > 0;
  const isJury = contest.juries.length > 0;
  const isAttendee = contest.attendees.length > 0;

  const user = useContext(UserInfoContext);

  const allowRegister = isPending
    ? !contest.private && contest.allowPublicRegistration
    : isRunning
    ? !contest.private &&
      contest.allowPublicRegistration &&
      contest.allowAfterRegistration
    : false;

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
      {user && (
        <Typography.Paragraph>
          {isMod ? (
            <i>您已经是比赛的管理员</i>
          ) : isJury ? (
            <i>您已经是比赛的裁判</i>
          ) : isAttendee ? (
            <i>您已经报名了该比赛</i>
          ) : allowRegister ? (
            <Link to="register">
              <Button type="primary">报名比赛</Button>
            </Link>
          ) : (
            <i>报名已经关闭</i>
          )}
        </Typography.Paragraph>
      )}
    </Typography>
  );
}

export { ErrorBoundary } from "~/src/ErrorBoundary";
export { CatchBoundary } from "~/src/CatchBoundary";
