import type { LoaderArgs, MetaFunction } from "@remix-run/node";
import { json } from "@remix-run/node";
import { Link, useLoaderData } from "@remix-run/react";
import { db } from "~/utils/server/db.server";
import { invariant } from "~/utils/invariant";
import { idScheme } from "~/utils/scheme";
import { Markdown } from "~/src/Markdown";
import {
  formatDateTime,
  formatDurationTime,
  formatNumber,
  formatRelativeDateTime,
} from "~/utils/tools";
import { findRequestUser } from "~/utils/permission";
import { Permissions } from "~/utils/permission/permission";
import {
  findContestParticipantRole,
  findContestPrivacy,
  findContestStatus,
  findContestTeam,
} from "~/utils/db/contest";
import {
  HiOutlineBookOpen,
  HiOutlineClock,
  HiOutlineUserGroup,
} from "react-icons/hi";

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
      allowJoinAfterStart: true,
      tags: {
        select: {
          name: true,
        },
      },
      _count: {
        select: {
          problems: true,
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
    <>
      <div className="stats bg-base-200 w-full">
        <div className="stat">
          <div className="stat-figure text-secondary">
            <HiOutlineClock className="w-8 h-8" />
          </div>
          <div className="stat-title">开始时间</div>
          <div className="stat-value">
            {formatRelativeDateTime(contest.beginTime)}
          </div>
          <div className="stat-desc">{formatDateTime(contest.beginTime)}</div>
        </div>

        <div className="stat">
          <div className="stat-figure text-secondary">
            <HiOutlineClock className="w-8 h-8" />
          </div>
          <div className="stat-title">比赛时长</div>
          <div className="stat-value">
            {formatDurationTime(
              new Date(contest.endTime).getTime() -
                new Date(contest.beginTime).getTime()
            )}
          </div>
          <div className="stat-desc">{formatDateTime(contest.endTime)}</div>
        </div>

        <div className="stat">
          <div className="stat-figure text-secondary">
            <HiOutlineBookOpen className="w-8 h-8" />
          </div>
          <div className="stat-title">题目数量</div>
          <div className="stat-value">
            {formatNumber(contest._count.problems)}
          </div>
          <div className="stat-desc">这里可以说什么</div>
        </div>

        <div className="stat">
          <div className="stat-figure text-secondary">
            <HiOutlineUserGroup className="w-8 h-8" />
          </div>
          <div className="stat-title">报名人数</div>
          <div className="stat-value">{formatNumber(114514)}</div>
          <div className="stat-desc">这个数字是假的</div>
        </div>
      </div>

      <Markdown>{contest.description}</Markdown>

      {isMod ? (
        <p className="alert alert-info shadow-lg">您已经是比赛的管理员</p>
      ) : isJury ? (
        <p className="alert alert-info shadow-lg">您已经是比赛的裁判</p>
      ) : isAttendee ? (
        <p className="alert alert-info shadow-lg">您已经报名了该比赛</p>
      ) : contest.private ? (
        <p className="alert alert-info shadow-lg">无法报名私有比赛</p>
      ) : status === "Running" && !contest.allowJoinAfterStart ? (
        <p className="alert alert-info shadow-lg">该比赛不允许中途加入</p>
      ) : status === "Ended" ? (
        <p className="alert alert-info shadow-lg">比赛已经结束</p>
      ) : contest.registrationType === "Disallow" ? (
        <p className="alert alert-info shadow-lg">报名已经关闭</p>
      ) : (
        <Link
          className="btn btn-primary"
          to={`/contest/${contest.id}/register`}
        >
          报名比赛
        </Link>
      )}
    </>
  );
}

export { ErrorBoundary } from "~/src/ErrorBoundary";
export { CatchBoundary } from "~/src/CatchBoundary";
