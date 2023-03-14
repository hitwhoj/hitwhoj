import type { LoaderArgs, MetaFunction } from "@remix-run/node";
import { json } from "@remix-run/node";
import { Link } from "@remix-run/react";
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
import { HiOutlineBookOpen, HiOutlineClock } from "react-icons/hi";
import { useComputed } from "@preact/signals-react";
import { useSignalLoaderData } from "~/utils/hooks";

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
  const loaderData = useSignalLoaderData<typeof loader>();

  const contest = useComputed(() => loaderData.value.contest);
  const registered = useComputed(() => loaderData.value.registered);
  const status = useComputed(() => loaderData.value.status);

  return (
    <>
      <div className="stats w-full bg-base-200 text-base-content">
        <div className="stat">
          <div className="stat-figure text-secondary">
            <HiOutlineClock className="h-8 w-8" />
          </div>
          <div className="stat-title">开始时间</div>
          <div className="stat-value">
            {formatRelativeDateTime(contest.value.beginTime)}
          </div>
          <div className="stat-desc">
            {formatDateTime(contest.value.beginTime)}
          </div>
        </div>

        <div className="stat">
          <div className="stat-figure text-secondary">
            <HiOutlineClock className="h-8 w-8" />
          </div>
          <div className="stat-title">比赛时长</div>
          <div className="stat-value">
            {formatDurationTime(
              new Date(contest.value.endTime).getTime() -
                new Date(contest.value.beginTime).getTime()
            )}
          </div>
          <div className="stat-desc">
            {formatDateTime(contest.value.endTime)}
          </div>
        </div>

        <div className="stat">
          <div className="stat-figure text-secondary">
            <HiOutlineBookOpen className="h-8 w-8" />
          </div>
          <div className="stat-title">题目数量</div>
          <div className="stat-value">
            {formatNumber(contest.value._count.problems)}
          </div>
          <div className="stat-desc">这里可以说什么</div>
        </div>
      </div>

      <Markdown>{contest.value.description}</Markdown>

      {registered.value === "Mod" ? (
        <p className="alert alert-info shadow-lg">您已经是比赛的管理员</p>
      ) : registered.value === "Jury" ? (
        <p className="alert alert-info shadow-lg">您已经是比赛的裁判</p>
      ) : registered.value === "Contestant" ? (
        <p className="alert alert-info shadow-lg">您已经报名了该比赛</p>
      ) : contest.value.private ? (
        <p className="alert alert-info shadow-lg">无法报名私有比赛</p>
      ) : status.value === "Running" && !contest.value.allowJoinAfterStart ? (
        <p className="alert alert-info shadow-lg">该比赛不允许中途加入</p>
      ) : status.value === "Ended" ? (
        <p className="alert alert-info shadow-lg">比赛已经结束</p>
      ) : contest.value.registrationType === "Disallow" ? (
        <p className="alert alert-info shadow-lg">报名已经关闭</p>
      ) : (
        <Link
          className="btn btn-primary"
          to={`/contest/${contest.value.id}/register`}
        >
          报名比赛
        </Link>
      )}
    </>
  );
}

export { ErrorBoundary } from "~/src/ErrorBoundary";
export { CatchBoundary } from "~/src/CatchBoundary";
