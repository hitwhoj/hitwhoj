import type { LoaderArgs } from "@remix-run/node";
import { json } from "@remix-run/node";
import { Link, useNavigate } from "@remix-run/react";
import { invariant } from "~/utils/invariant";
import { findRequestUser } from "~/utils/permission";
import { Permissions } from "~/utils/permission/permission";
import { findContestStatus, findContestTeam } from "~/utils/db/contest";
import { idScheme } from "~/utils/scheme";
import { db } from "~/utils/server/db.server";
import { ContestPermission } from "~/utils/permission/permission/contest";
import {
  HiOutlineArrowsExpand,
  HiOutlineCheck,
  HiOutlineX,
} from "react-icons/hi";
import type { CSSProperties } from "react";
import { useEffect } from "react";
import { useComputed, useSignal, useSignalEffect } from "@preact/signals-react";
import { useSignalLoaderData } from "~/utils/hooks";

export async function loader({ request, params }: LoaderArgs) {
  const contestId = invariant(idScheme, params.contestId, { status: 404 });
  const self = await findRequestUser(request);
  const status = await findContestStatus(contestId);
  const [hasViewProblemPerm, isContestants] = await self
    .team(await findContestTeam(contestId))
    .contest(contestId)
    .hasPermission(
      status === "Pending"
        ? Permissions.PERM_VIEW_CONTEST_PROBLEMS_BEFORE
        : status === "Running"
        ? Permissions.PERM_VIEW_CONTEST_PROBLEMS_DURING
        : Permissions.PERM_VIEW_CONTEST_PROBLEMS_AFTER,
      ContestPermission.Contestants
    );

  // show a count down page for contestants
  if (isContestants && status === "Pending") {
    const contest = await db.contest.findUnique({
      where: { id: contestId },
      select: {
        beginTime: true,
        endTime: true,
      },
    });
    if (!contest) throw new Response("Contest not found", { status: 404 });
    return json({ countdown: true as const, contest });
  }

  // if problem is ok to see
  if (hasViewProblemPerm) {
    const contest = await db.contest.findUnique({
      where: { id: contestId },
      select: {
        beginTime: true,
        endTime: true,
        problems: {
          orderBy: { rank: "asc" },
          select: {
            rank: true,
            problem: {
              select: {
                title: true,
                relatedRecords: {
                  where: { contestId, submitterId: self.userId ?? -1 },
                  select: { status: true },
                },
              },
            },
          },
        },
      },
    });
    if (!contest) throw new Response("Contest not found", { status: 404 });
    return json({ countdown: false as const, contest });
  }
  // or throw 403
  else {
    throw new Response("Permission Denied", { status: 403 });
  }
}

type CountdownProps = { date: Date; onFinish: () => void };

function Countdown(props: CountdownProps) {
  const now = useSignal(new Date());

  useEffect(() => {
    const interval = setInterval(() => (now.value = new Date()), 1000);
    return () => clearInterval(interval);
  }, []);

  const time = useComputed(() => {
    const time = props.date.getTime() - now.value.getTime();
    const day = Math.floor(time / 1000 / 60 / 60 / 24);
    const hour = Math.floor(time / 1000 / 60 / 60) % 24;
    const minute = Math.floor(time / 1000 / 60) % 60;
    const second = Math.floor(time / 1000) % 60;
    const finished = time < 0;

    return { day, hour, minute, second, finished };
  });

  useSignalEffect(() => {
    if (time.value.finished) {
      props.onFinish();
    }
  });

  return (
    <div className="flex gap-5">
      <div>
        <span className="countdown font-mono text-4xl">
          <span style={{ "--value": time.value.day } as CSSProperties} />
        </span>
        days
      </div>
      <div>
        <span className="countdown font-mono text-4xl">
          <span style={{ "--value": time.value.hour } as CSSProperties} />
        </span>
        hours
      </div>
      <div>
        <span className="countdown font-mono text-4xl">
          <span style={{ "--value": time.value.minute } as CSSProperties} />
        </span>
        min
      </div>
      <div>
        <span className="countdown font-mono text-4xl">
          <span style={{ "--value": time.value.second } as CSSProperties} />
        </span>
        sec
      </div>
    </div>
  );
}

export default function ContestProblemIndex() {
  const loaderData = useSignalLoaderData<typeof loader>();
  const navigate = useNavigate();

  return loaderData.value.countdown ? (
    <div className="mx-auto w-full max-w-sm text-center">
      <h2>距离比赛开始还有</h2>

      <Countdown
        date={new Date(loaderData.value.contest.beginTime)}
        onFinish={() => navigate(".")}
      />
    </div>
  ) : (
    <table className="not-prose table w-full">
      <thead>
        <tr>
          <th className="w-16" />
          <th>题目</th>
          <th>状态</th>
        </tr>
      </thead>
      <tbody>
        {loaderData.value.contest.problems.map(({ rank, problem }) => {
          const charCode = String.fromCharCode(0x40 + rank);
          // 是否已经通过这道题目
          const accepted = problem.relatedRecords.some(
            ({ status }) => status === "Accepted"
          );
          // 是否有失败的提交记录
          const failed = problem.relatedRecords.length > 0 && !accepted;

          return (
            <tr key={rank}>
              <th className="text-center">{charCode}</th>
              <td>
                <Link
                  className="link inline-flex items-center gap-2"
                  to={charCode}
                >
                  <span>{problem.title}</span>
                  <HiOutlineArrowsExpand />
                </Link>
              </td>
              <td>
                {accepted && (
                  <HiOutlineCheck className="text-success h-6 w-6" />
                )}
                {failed && <HiOutlineX className="text-error h-6 w-6" />}
              </td>
            </tr>
          );
        })}
      </tbody>
    </table>
  );
}

export { ErrorBoundary } from "~/src/ErrorBoundary";
export { CatchBoundary } from "~/src/CatchBoundary";
