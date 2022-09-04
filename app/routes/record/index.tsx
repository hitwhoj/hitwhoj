import type { LoaderArgs, MetaFunction } from "@remix-run/node";
import { json } from "@remix-run/node";
import { Link, useLoaderData } from "@remix-run/react";
import { ProblemLink } from "~/src/problem/ProblemLink";
import { RecordStatus } from "~/src/record/RecordStatus";
import { UserLink } from "~/src/user/UserLink";
import { selectUserData } from "~/utils/db/user";
import { db } from "~/utils/server/db.server";
import { formatDateTime } from "~/utils/tools";

export async function loader(_: LoaderArgs) {
  const records = await db.record.findMany({
    where: { contest: null },
    orderBy: [{ id: "desc" }],
    take: 100,
    select: {
      id: true,
      status: true,
      submittedAt: true,
      problem: {
        select: {
          id: true,
          title: true,
          private: true,
        },
      },
      submitter: {
        select: {
          ...selectUserData,
        },
      },
    },
  });

  return json({ records });
}

export const meta: MetaFunction = () => ({
  title: "评测记录 - HITwh OJ",
});

export default function RecordList() {
  const { records } = useLoaderData<typeof loader>();

  return (
    <>
      <h1>评测记录</h1>
      <p>您只能查询到最近的 100 条评测记录（因为我们懒得写分页）。</p>

      <div className="not-prose">
        <table className="table w-full">
          <thead>
            <tr>
              <th className="w-16" />
              <th>状态</th>
              <th>题目</th>
              <th>用户</th>
              <th>提交时间</th>
            </tr>
          </thead>
          <tbody>
            {records.map((record) => (
              <tr key={record.id}>
                <th className="text-center">{record.id}</th>
                <td>
                  <Link to={`/record/${record.id}`}>
                    <RecordStatus status={record.status} />
                  </Link>
                </td>
                <td>
                  <ProblemLink problem={record.problem} />
                </td>
                <td>
                  <UserLink user={record.submitter} />
                </td>
                <td>{formatDateTime(record.submittedAt)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}

export { ErrorBoundary } from "~/src/ErrorBoundary";
export { CatchBoundary } from "~/src/CatchBoundary";
