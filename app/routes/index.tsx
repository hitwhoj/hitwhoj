import { json, redirect } from "@remix-run/node";
import type { ActionArgs, LoaderArgs, MetaFunction } from "@remix-run/node";
import { useLoaderData, Form, Link } from "@remix-run/react";
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

export const meta: MetaFunction = () => ({
  title: "首页 - HITwh OJ",
});

export async function action({ request }: ActionArgs) {
  const form = await request.formData();
  const problemIdInput = invariant(idScheme, form.get("problemIdInput"));
  console.log(problemIdInput);

  return redirect(`/problem/${problemIdInput}`);
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

  const problems = await db.problem.findMany({
    where: viewPublicProblems ? { team: null, private: false } : { id: -1 },
    // TODO: order by recent commit count
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

  return json({ problems, contests });
}

export default function Index() {
  const { problems, contests } = useLoaderData<typeof loader>();

  const qqlink =
    "https://qm.qq.com/cgi-bin/qm/qr?k=uFHY05vPwIamUXG6L-xDQvhkA0acwZqA&jump_from=webapi&authKey=96ylLScWBoTxF6zMOsP7wdIbC/7PN1bMs5T74AIOpqeBE6h4NAGnYx/ngkxkVhyx";

  const issuelink = "https://git.hit.edu.cn/hitwhoj/hitwhoj/-/issues";

  return (
    <>
      <h1>Welcome to HITwh OJ</h1>
      <div className="w-full place-content-between grid grid-cols-8 md:grid-cols-12 gap-4">
        <div className="h-72 col-span-8 shadow rounded-2xl bg-base-200">
          <div className="card-body py-0">
            <h2 className="card-title">通知公告</h2>
            <p>
              欢迎加入HITwh OJ 反馈 QQ 群：
              <a href={qqlink} target="_blank">
                721141362
              </a>
            </p>
            <p>
              <a href={issuelink} target="_blank">
                Issue滞销，帮帮我们
              </a>
            </p>
          </div>
        </div>
        <div className="w-full col-span-8 md:col-span-4 grid grid-cols-2 gap-2 md:grid-cols-1">
          <div className="h-35 w-full">
            <div className="stats shadow h-full w-full bg-base-200">
              <div className="stat">
                <div className="stat-title">Today Date</div>
                <div className="stat-value">
                  {" "}
                  {new Date().toLocaleDateString()}{" "}
                </div>
                <div className="stat-title">
                  {new Date().toLocaleDateString("en-US", { weekday: "long" })}
                </div>
              </div>
            </div>
          </div>
          <div className="h-35 w-full">
            <div className="stats shadow h-full w-full bg-base-200">
              <div className="stat">
                <div className="stat-title">快速跳题</div>
                <Form className="flex w-full justify-between" method="post">
                  <input
                    className="input input-bordered w-7/12"
                    type="text"
                    name="problemIdInput"
                    required
                    placeholder="Input pid"
                  />
                  <button className="btn btn-primary w-1/3" type="submit">
                    跳转
                  </button>
                </Form>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="w-full grid grid-cols-7 md:grid-cols-12 gap-4 my-6 place-content-between">
        <div className="col-span-7 rounded-2xl p-4 shadow bg-base-200">
          <h2 className="card-title mt-0 mb-2"> 近期比赛 </h2>
          <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-x-4 gap-y-2">
            {contests.map((contest) => (
              <Link
                className="h-40 overflow-hidden inline-block border-2 border-gray-200 bg-base-100 rounded-xl no-underline "
                key={contest.id}
                to={`/contest/${contest.id}`}
              >
                <div className="w-full border-b-2 pl-4 py-1 flex items-center">
                  <span className="text-lg font-bold mr-2">
                    {contest.title}
                  </span>
                  <ContestStateTag
                    beginTime={contest.beginTime}
                    endTime={contest.endTime}
                  />
                </div>
                <div className="w-full p-2">
                  <div>
                    Begin: {new Date(contest.beginTime).toLocaleString()}
                  </div>
                  <div>End: {new Date(contest.endTime).toLocaleString()}</div>
                  <div>
                    System: <ContestSystemTag system={contest.system} />
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
        <div className="h-96 col-span-7 md:col-span-5 p-4 rounded-2xl shadow bg-base-200">
          <div className="card-body p-0 h-full w-full">
            <h2 className="card-title mt-0"> 推荐题目 </h2>
            <table className="table table-compact w-full not-prose">
              <thead>
                <tr>
                  <th>pid</th>
                  <th>题目</th>
                  <th>提交数</th>
                </tr>
              </thead>
              <tbody>
                {problems.map((problem) => (
                  <tr key={problem.id}>
                    <th className="text-center">{problem.id}</th>
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
      </div>
    </>
  );
}

export { ErrorBoundary } from "~/src/ErrorBoundary";
export { CatchBoundary } from "~/src/CatchBoundary";
