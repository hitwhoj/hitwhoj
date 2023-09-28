import { json, redirect } from "@remix-run/node";
import type { ActionArgs, LoaderArgs, MetaFunction } from "@remix-run/node";
import { Form, Link } from "@remix-run/react";
import { ProblemLink } from "~/src/problem/ProblemLink";
import { selectContestListData } from "~/utils/db/contest";
import { selectProblemListData } from "~/utils/db/problem";
import { invariant } from "~/utils/invariant";
import { findRequestUser } from "~/utils/permission";
import { Permissions } from "~/utils/permission/permission";
import { idScheme } from "~/utils/scheme";
import { db } from "~/utils/server/db.server";
import { ContestSystemTag } from "~/src/contest/ContestSystemTag";
import { ContestStateTag } from "~/src/contest/ContestStateTag";
import { formatDateTime, formatDurationTime } from "~/utils/tools";
import { useSignalLoaderData } from "~/utils/hooks";
import { TeamLink } from "~/src/team/TeamLink";

export const meta: MetaFunction = () => ({
  title: "首页 - HITwh OJ",
});

export async function action({ request }: ActionArgs) {
  const form = await request.formData();
  const pid = invariant(idScheme, form.get("pid"));
  return redirect(`/problem/${pid}`);
}

const problemPageSize = 7;
const contestSize = 4;

export async function loader({ request }: LoaderArgs) {
  const self = await findRequestUser(request);
  const [viewPublicProblems] = await self
    .team(null)
    .hasPermission(Permissions.PERM_VIEW_PROBLEM_PUBLIC);
  const [viewPublicContests] = await self
    .team(null)
    .contest(null)
    .hasPermission(Permissions.PERM_VIEW_CONTEST_PUBLIC);

  // TODO: 这里的推荐算法非常暴力，需要优化
  const problems = await db.problem.findMany({
    where: viewPublicProblems ? { team: null, private: false } : { id: -1 },
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
    where: viewPublicContests ? { team: null, private: false } : { id: -1 },
    orderBy: [{ id: "asc" }],
    select: {
      ...selectContestListData,
    },
    take: contestSize,
  });

  // 最近 50 条评测记录,嵌套查询
  const lastRecords = await db.record.findMany({
    orderBy: [{ submittedAt: "asc" }],
    select: {
      submittedAt: true,
      contest: {
        select: {
          team: {
            select: {
              id: true,
              name: true,
            },
          },
        },
      },
    },
    take: 50,
  });

  // 筛选活跃团队
  const activeRecord = lastRecords.filter(
    (record) => record.contest?.team !== null
  );

  // 确定活跃次数
  const activeTimes = countOccurrences(
    activeRecord.map((record) => record.contest?.team?.name)
  );

  const activeTeams: {
    team: {
      id: number;
      name: string;
    };
    submittedAt: Date;
    times: number;
  }[] = [];

  activeRecord.map((record) => {
    if (record.contest?.team) {
      activeTeams.push({
        team: record.contest.team,
        submittedAt: record.submittedAt,
        times: activeTimes.get(record.contest.team.name)!,
      });
    }
  });

  // 对活跃团队进行排序
  activeTeams.sort((a, b) => a.submittedAt.getTime() - b.submittedAt.getTime());

  return json({ problems, contests, activeTeams });
}

// 统计一个数组中相同元素出现的次数
function countOccurrences<T>(arr: T[]): Map<string, number> {
  const countMap = new Map<string, number>();

  for (const element of arr) {
    const key = String(element); // 将元素转换为字符串以用作对象的键
    if (countMap.has(key)) {
      countMap.set(key, countMap.get(key)! + 1);
    } else {
      countMap.set(key, 1);
    }
  }

  return countMap;
}

const QQ_LINK =
  "https://qm.qq.com/cgi-bin/qm/qr?k=uFHY05vPwIamUXG6L-xDQvhkA0acwZqA&jump_from=webapi&authKey=96ylLScWBoTxF6zMOsP7wdIbC/7PN1bMs5T74AIOpqeBE6h4NAGnYx/ngkxkVhyx";
const ISSUE_LINK = "https://git.hit.edu.cn/hitwhoj/hitwhoj/-/issues";

export default function Index() {
  const loaderData = useSignalLoaderData<typeof loader>();

  return (
    <>
      <h1>Welcome to HITwh OJ</h1>
      <div className="not-prose grid grid-cols-8 place-content-between gap-4 md:grid-cols-12">
        <div className="card col-span-8 bg-info text-info-content md:col-span-12">
          <div className="card-body">
            <h2 className="card-title">纳新公告</h2>
            <p>HITwh OJ 项目组和 HITwh FP 项目组绝赞纳新中！！！</p>
            <p>
              需要熟悉 nodejs 开发环境，有 React
              开发经验，有热情学习最新最前沿的前端技术栈。
            </p>
            <p>
              详情请联系 QQ 64174234（张老师）或者 QQ 2670529647（罗江楠）。
            </p>
          </div>
        </div>
        <div className="card col-span-8 row-span-2 bg-base-200">
          <div className="card-body">
            <h2 className="card-title">通知公告</h2>
            <p className="flex items-center">
              欢迎加入 HITwh OJ 反馈 QQ 群：
              <a
                className="underline"
                href={QQ_LINK}
                target="_blank"
                rel="noreferrer"
              >
                721141362
              </a>
            </p>
            <p>
              <a
                className="underline"
                href={ISSUE_LINK}
                target="_blank"
                rel="noreferrer"
              >
                如果您发现有什么 BUG，可以在这里提交 issue
              </a>
            </p>
          </div>
        </div>
        <div className="stats col-span-4 bg-base-200">
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
        <div className="stats col-span-4 bg-base-200">
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
              <button className="btn btn-primary btn-sm w-1/3" type="submit">
                跳转
              </button>
            </Form>
          </div>
        </div>
        <div className="card col-span-8 bg-base-200 md:col-span-6">
          <div className="card-body">
            <h2 className="card-title">近期比赛</h2>
            <div className="flex flex-col gap-4">
              {loaderData.value.contests.map((contest) => (
                <Link
                  className="card bg-base-100"
                  key={contest.id}
                  to={`/contest/${contest.id}`}
                >
                  <div className="card-body">
                    <h2 className="card-title">
                      {contest.title}
                      <ContestStateTag
                        beginTime={contest.beginTime}
                        endTime={contest.endTime}
                        isdeleted={contest.isdeleted}
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
        <div className="card col-span-8 bg-base-200 md:col-span-6">
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
                      <ProblemLink problem={problem} />
                    </td>
                    <td>{problem._count.relatedRecords}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
        <div className="card col-span-8 bg-base-200 md:col-span-12">
          <div className="card-body">
            <h2 className="card-title">最近活跃团队(近50次提交)</h2>
            <table className="table-compact table">
              <thead>
                <tr>
                  <th>团队名</th>
                  <th>最近活跃时间</th>
                  <th>近50次提交人数</th>
                </tr>
              </thead>
              <tbody>
                {loaderData.value.activeTeams.map((team) => (
                  <tr key={team.team.id}>
                    <td>
                      <TeamLink team={team.team} />
                    </td>
                    <td>
                      {new Date(team.submittedAt).toLocaleDateString("zh-CN")}
                    </td>
                    <td>{team.times}</td>
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
