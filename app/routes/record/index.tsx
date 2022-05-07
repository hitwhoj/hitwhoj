import type { Problem, Record, User } from "@prisma/client";
import type { LoaderFunction, MetaFunction } from "@remix-run/node";
import { json } from "@remix-run/node";
import { Link, useLoaderData } from "@remix-run/react";
import { db } from "~/utils/db.server";

type LoaderData = {
  records: (Pick<Record, "rid" | "status" | "submittedAt"> & {
    problem: Pick<Problem, "pid" | "title">;
    submitter: Pick<User, "uid" | "username">;
  })[];
};

export const loader: LoaderFunction = async () => {
  const records = await db.record.findMany({
    orderBy: {
      submittedAt: "desc",
    },
    select: {
      rid: true,
      status: true,
      submittedAt: true,
      problem: {
        select: {
          pid: true,
          title: true,
        },
      },
      submitter: {
        select: {
          uid: true,
          username: true,
        },
      },
    },
    take: 20,
  });

  return json({ records });
};

export const meta: MetaFunction = () => ({
  title: "提交记录 - HITwh OJ",
});

export default function RecordList() {
  const { records } = useLoaderData<LoaderData>();

  return (
    <>
      <h1>评测记录捏</h1>
      <table>
        <thead>
          <tr>
            <th>#</th>
            <th>状态</th>
            <th>题目</th>
            <th>用户</th>
            <th>提交时间</th>
          </tr>
        </thead>
        <tbody>
          {records.map((record) => (
            <tr key={record.rid}>
              <td>
                <Link to={`${record.rid}`}>{record.rid}</Link>
              </td>
              <td>
                <Link to={`${record.rid}`}>{record.status}</Link>
              </td>
              <td>
                <Link to={`/problem/${record.problem.pid}`}>
                  {record.problem.title}
                </Link>
              </td>
              <td>
                <Link to={`/user/${record.submitter.uid}`}>
                  {record.submitter.username}
                </Link>
              </td>
              <td>{new Date(record.submittedAt).toLocaleString()}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </>
  );
}

export { ErrorBoundary } from "~/src/ErrorBoundary";
export { CatchBoundary } from "~/src/CatchBoundary";
