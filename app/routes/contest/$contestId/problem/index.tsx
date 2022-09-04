import { Statistic } from "@arco-design/web-react";
import type { LoaderArgs } from "@remix-run/node";
import { json } from "@remix-run/node";
import { Link, useLoaderData, useNavigate } from "@remix-run/react";
import { invariant } from "~/utils/invariant";
import { findRequestUser } from "~/utils/permission";
import { Permissions } from "~/utils/permission/permission";
import { findContestStatus, findContestTeam } from "~/utils/db/contest";
import { idScheme } from "~/utils/scheme";
import { db } from "~/utils/server/db.server";
import { ContestPermission } from "~/utils/permission/permission/contest";
import { HiOutlineCheck, HiOutlineX } from "react-icons/hi";

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
  // or show a counting down page for user
  else if (isContestants) {
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
  // or throw 403
  else {
    throw new Response("Permission Denied", { status: 403 });
  }
}

export default function ContestProblemIndex() {
  const data = useLoaderData<typeof loader>();
  const navigate = useNavigate();

  if (data.countdown) {
    return (
      <div style={{ textAlign: "center", marginTop: 100 }}>
        <Statistic.Countdown
          title="距离比赛开始还有"
          value={new Date(data.contest.beginTime)}
          format="D 天 H 时 m 分 s 秒"
          onFinish={() => navigate(".")}
        />
      </div>
    );
  }

  const { contest } = data;

  return (
    <div className="not-prose overflow-x-auto">
      <table className="table w-full">
        <thead>
          <tr>
            <th className="w-16" />
            <th>题目</th>
            <th>状态</th>
          </tr>
        </thead>
        <tbody>
          {contest.problems.map(({ rank, problem }) => {
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
                  <Link className="link" to={charCode}>
                    {problem.title}
                  </Link>
                </td>
                <td>
                  {accepted && <HiOutlineCheck className="text-success" />}
                  {failed && <HiOutlineX className="text-error" />}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

export { ErrorBoundary } from "~/src/ErrorBoundary";
export { CatchBoundary } from "~/src/CatchBoundary";
