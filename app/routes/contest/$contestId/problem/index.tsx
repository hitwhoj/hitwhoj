import { Space, Statistic } from "@arco-design/web-react";
import { IconCheck, IconClose } from "@arco-design/web-react/icon";
import type { LoaderArgs } from "@remix-run/node";
import { json } from "@remix-run/node";
import { Link, useLoaderData, useNavigate } from "@remix-run/react";
import { TableList } from "~/src/TableList";
import { invariant } from "~/utils/invariant";
import { findRequestUser } from "~/utils/permission";
import { Permissions } from "~/utils/permission/permission";
import { findContestStatus, findContestTeam } from "~/utils/db/contest";
import { idScheme } from "~/utils/scheme";
import { db } from "~/utils/server/db.server";
import { ContestPermission } from "~/utils/permission/permission/contest";

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
    <TableList
      data={contest.problems.map(({ rank, problem }) => ({
        id: rank,
        ...problem,
      }))}
      columns={[
        {
          title: "#",
          render: ({ id: rank }) => String.fromCharCode(0x40 + rank),
          align: "center",
          minimize: true,
        },
        {
          title: "题目",
          render({ id: rank, title, relatedRecords: records }) {
            const problemId = String.fromCharCode(0x40 + rank);
            // 是否已经通过这道题目
            const accepted = records.some(
              ({ status }) => status === "Accepted"
            );
            // 是否有失败的提交记录
            const failed = records.length > 0 && !accepted;

            return (
              <Link to={problemId} target="_blank">
                <Space>
                  {title}
                  {accepted ? (
                    <IconCheck style={{ color: "rgb(var(--green-6))" }} />
                  ) : failed ? (
                    <IconClose style={{ color: "rgb(var(--red-6))" }} />
                  ) : null}
                </Space>
              </Link>
            );
          },
        },
      ]}
    />
  );
}

export { ErrorBoundary } from "~/src/ErrorBoundary";
export { CatchBoundary } from "~/src/CatchBoundary";
