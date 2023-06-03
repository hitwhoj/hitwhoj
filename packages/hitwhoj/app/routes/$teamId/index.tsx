import { json, redirect } from "@remix-run/node";
import type { ActionArgs, LoaderArgs, MetaFunction } from "@remix-run/node";
import { Form, Link } from "@remix-run/react";
import { ProblemLink } from "~/src/newLink/ProblemLink";
import { selectContestListData } from "~/utils/db/contest";
import { selectProblemListData } from "~/utils/db/problem";
import { invariant } from "~/utils/invariant";
import { findRequestUser } from "~/utils/permission";
import { idScheme, teamInvitationCodeScheme } from "~/utils/scheme";
import { db } from "~/utils/server/db.server";
import { ContestSystemTag } from "~/src/contest/ContestSystemTag";
import { ContestStateTag } from "~/src/contest/ContestStateTag";
import { formatDateTime, formatDurationTime } from "~/utils/tools";
import { useSignalLoaderData, useSignalTransition } from "~/utils/hooks";
import { teamIdScheme } from "~/utils/new-permission/scheme";
import { useComputed } from "@preact/signals-react";
import { Markdown } from "~/src/Markdown";
import { InvitationType } from "@prisma/client";
import { useUser } from "~/utils/context";
import { PERM_TEAM } from "~/utils/new-permission/privilege";
import { Privileges } from "~/utils/permission/privilege";
import { TeamMemberRole } from "~/utils/domain/role";
const problemPageSize = 7;
const contestSize = 4;
export const meta: MetaFunction = () => ({
  title: "首页 - HITwh OJ",
});
export async function loader({ request, params }: LoaderArgs) {
  const self = await findRequestUser(request);
  const teamId = invariant(teamIdScheme, params.teamId, { status: 404 });
  const [viewPublicProblems] = await self
    .newTeam(teamId)
    .hasPrivilege(PERM_TEAM.PERM_VIEW_PROBLEM_PUBLIC);
  const [viewPublicContests] = await self
    .newTeam(teamId)
    .hasPrivilege(PERM_TEAM.PERM_VIEW_CONTEST_PUBLIC);
  const [hasViewPerm] = await self
    .newTeam(teamId)
    .hasPrivilege(PERM_TEAM.PERM_TEAM_VIEW_INTERNAL);
  const team = await db.team.findUnique({
    where: { id: teamId },
    select: {
      id: true,
      name: true,
      description: true,
      createdAt: true,
      invitationType: true,
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
  // TODO: 这里的推荐算法非常暴力，需要优化
  const problems = await db.problem.findMany({
    where: viewPublicProblems ? { teamId: teamId, private: false } : { id: -1 },
    orderBy: [{ id: "asc" }],
    select: {
      ...selectProblemListData,
      _count: {
        select: {
          relatedRecords: true,
        },
      },
    },
    take: problemPageSize,
  });

  const contests = await db.contest.findMany({
    where: viewPublicContests ? { teamId: teamId, private: false } : { id: -1 },
    orderBy: [{ id: "asc" }],
    select: {
      ...selectContestListData,
    },
    take: contestSize,
  });

  return json({ problems, contests, teamId, hasViewPerm, team });
}

enum ActionType {
  joinTeam = "joinTeam",
  jumpProblem = "jumpProblem",
}
export async function action({ request, params }: ActionArgs) {
  const form = await request.formData();
  const _action = form.get("_action");
  switch (_action) {
    case ActionType.jumpProblem: {
      const pid = invariant(idScheme, form.get("pid"));
      const teamId = invariant(teamIdScheme, params.teamId, { status: 404 });
      const problem = await db.problem.findMany({
        where: { id: pid, teamId: teamId },
      });
      if (!problem) {
        throw new Response("团队中不存在此题", { status: 404 });
      }
      return redirect(`/${teamId}/problem/${pid}`);
    }
    case ActionType.joinTeam: {
      const teamId = invariant(teamIdScheme, params.teamId);
      const self = await findRequestUser(request);
      await self.checkPrivilege(Privileges.PRIV_OPERATE);
      await db.$transaction(async (db) => {
        const team = await db.team.findMany({
          where: { id: teamId },
          select: { invitationType: true, invitationCode: true },
        });

        if (!team) {
          throw new Response("团队不存在", { status: 404 });
        }

        const exists = await db.teamMember.findUnique({
          where: {
            userId_teamId: {
              userId: self.userId!,
              teamId: teamId,
            },
          },
        });

        if (exists) {
          throw new Response("你已经是该团队成员了", { status: 403 });
        }

        if (team.invitationType === InvitationType.NONE) {
          throw new Response("该团队不允许加入", { status: 403 });
        }

        if (team.invitationType === InvitationType.CODE) {
          const form = await request.formData();
          const code = invariant(teamInvitationCodeScheme, form.get("code"));
          if (code !== team.invitationCode) {
            throw new Response("邀请码错误", { status: 403 });
          }
        }

        await db.teamMember.create({
          data: {
            userId: self.userId!,
            teamId: teamId,
            roleName: TeamMemberRole.Member,
          },
        });
      });
      return null;
    }
  }
  throw new Response("Invalid action", { status: 400 });
}
export default function Index() {
  const loaderData = useSignalLoaderData<typeof loader>();
  const teamId = useComputed(() => loaderData.value.teamId);
  const team = useComputed(() => loaderData.value.team);
  const hasViewPerm = useComputed(() => loaderData.value.hasViewPerm);

  const self = useUser();

  const transition = useSignalTransition();

  const isNotMember = useComputed(() => self.value && !hasViewPerm.value);
  return (
    <>
      <h1>Welcome to {team.value.name} 团队</h1>
      <div className="not-prose grid grid-cols-8 place-content-between gap-4 md:grid-cols-12">
        <div className="card bg-info text-info-content col-span-8 md:col-span-12">
          <div className="card-body">
            <h2 className="card-title">纳新公告</h2>
            <p>HITwh OJ 项目组和 HITwh FP 项目组绝赞纳新中！！！</p>
            <p>
              需要熟悉 nodejs 开发环境，有 React
              开发经验，有热情学习最新最前沿的前端技术栈。
            </p>
            <p>详情请联系 QQ 3224177294 或者发送邮件到 contact#hitwh.moe。</p>
          </div>
        </div>
        <div className="card bg-base-200 col-span-8 row-span-2">
          <div className="card-body">
            <h2 className="card-title">团队信息</h2>
            <div>
              <table>
                <tbody>
                  <tr>
                    <th>创建时间</th>
                    <td>{formatDateTime(team.value.createdAt)}</td>
                  </tr>
                  <tr>
                    <th>成员数量</th>
                    <td>{team.value._count.members}</td>
                  </tr>
                  <tr>
                    <th>题目数量</th>
                    <td>{team.value._count.problems}</td>
                  </tr>
                  <tr>
                    <th>题单数量</th>
                    <td>{team.value._count.problemSets}</td>
                  </tr>
                  <tr>
                    <th>比赛数量</th>
                    <td>{team.value._count.contests}</td>
                  </tr>
                </tbody>
              </table>

              <Markdown>{team.value.description}</Markdown>

              {isNotMember.value &&
                (team.value.invitationType === InvitationType.NONE ? (
                  <div className="alert alert-info">该团队未开放申请加入</div>
                ) : (
                  <Form method="post" className="flex gap-4">
                    {team.value.invitationType === InvitationType.CODE && (
                      <input
                        className="input input-bordered"
                        name="code"
                        placeholder="请输入邀请码"
                        required
                        disabled={transition.isRunning}
                      />
                    )}
                    <button
                      className="btn btn-primary"
                      type="submit"
                      disabled={transition.isRunning}
                      name="_action"
                      value={ActionType.joinTeam}
                    >
                      加入团队
                    </button>
                  </Form>
                ))}
            </div>
          </div>
        </div>
        <div className="stats bg-base-200 col-span-4">
          <div className="stat">
            <div className="stat-title">今天</div>
            <div className="stat-value">
              {new Date().toLocaleDateString("zh-CN")}
            </div>
            <div className="stat-desc">
              {new Date().toLocaleDateString("zh-CN", { weekday: "long" })}
            </div>
          </div>
        </div>
        <div className="stats bg-base-200 col-span-4">
          <div className="stat">
            <div className="stat-title">快速跳题</div>
            <Form className="input-group" method="post">
              <input
                className="input input-bordered input-sm w-2/3"
                type="text"
                name="pid"
                required
                placeholder="请输入题目编号"
              />
              <button
                className="btn btn-primary btn-sm w-1/3"
                type="submit"
                name="_action"
                value={ActionType.jumpProblem}
              >
                跳转
              </button>
            </Form>
          </div>
        </div>
        <div className="card bg-base-200 col-span-8 md:col-span-6">
          <div className="card-body">
            <h2 className="card-title">近期比赛</h2>
            <div className="flex flex-col gap-4">
              {loaderData.value.contests.map((contest) => (
                <Link
                  className="card bg-base-100"
                  key={contest.id}
                  to={`/${teamId}/contest/${contest.id}`}
                >
                  <div className="card-body">
                    <h2 className="card-title">
                      {contest.title}
                      <ContestStateTag
                        beginTime={contest.beginTime}
                        endTime={contest.endTime}
                      />
                      <ContestSystemTag system={contest.system} />
                    </h2>
                    <p>
                      开始时间：{formatDateTime(contest.beginTime)}
                      <br />
                      比赛时长：
                      {formatDurationTime(
                        new Date(contest.endTime).getTime() -
                          new Date(contest.beginTime).getTime()
                      )}
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>
        <div className="card bg-base-200 col-span-8 md:col-span-6">
          <div className="card-body">
            <h2 className="card-title">推荐题目</h2>
            <table className="table-compact table">
              <thead>
                <tr>
                  <th>题目</th>
                  <th>提交数</th>
                </tr>
              </thead>
              <tbody>
                {loaderData.value.problems.map((problem) => (
                  <tr key={problem.id}>
                    <td>
                      <ProblemLink problem={problem} teamId={teamId} />
                    </td>
                    <td>{problem._count.relatedRecords}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </>
  );
}

export { ErrorBoundary } from "~/src/ErrorBoundary";
export { CatchBoundary } from "~/src/CatchBoundary";
