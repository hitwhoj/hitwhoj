import type { LoaderArgs, MetaFunction } from "@remix-run/node";
import { json } from "@remix-run/node";
import { Link, useLoaderData, useNavigate, useParams } from "@remix-run/react";
import { useMemo, useState } from "react";
import { Pagination } from "~/src/Pagination";
import { ProblemLink } from "~/src/problem/ProblemLink";
import { RecordStatus } from "~/src/record/RecordStatus";
import { UserLink } from "~/src/user/UserLink";
import { selectUserData } from "~/utils/db/user";
import { invariant } from "~/utils/invariant";
import { nullableIdScheme, pageScheme } from "~/utils/scheme";
import { db } from "~/utils/server/db.server";
import { formatDateTime, formatRelativeDateTime } from "~/utils/tools";

const pageSize = 15;

export async function loader({ request }: LoaderArgs) {
  const url = new URL(request.url);

  console.log(url.searchParams);

  const uid = invariant(nullableIdScheme, url.searchParams.get("uid"));
  const pid = invariant(nullableIdScheme, url.searchParams.get("pid"));

  const page = invariant(pageScheme, url.searchParams.get("page") || "1");
  const totalRecords = await db.record.count({
    where: {
      contest: null,
      submitterId: uid || undefined,
      problemId: pid || undefined,
    },
  });
  // FIXME: 没有记录的时候会报错
  if (page > Math.ceil(totalRecords / pageSize)) {
    throw new Response("Page is out of range", { status: 404 });
  }

  const records = await db.record.findMany({
    where: {
      contest: null,
      submitterId: uid || undefined,
      problemId: pid || undefined,
    },
    orderBy: [{ id: "desc" }],
    skip: (page - 1) * pageSize,
    take: pageSize,
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

  return json({ records, totalRecords, currentPage: page }, { status: 200 });
}

export const meta: MetaFunction = () => ({
  title: "评测记录 - HITwh OJ",
});

export default function RecordList() {
  const { records, totalRecords, currentPage } = useLoaderData<typeof loader>();
  const navigate = useNavigate();
  const totalPages = useMemo(
    () => Math.ceil(totalRecords / pageSize),
    [totalRecords]
  );
  const [recordIdInput, setRecordIdInput] = useState("");
  const [userIdInput, setUserIdInput] = useState(useParams().uid || "");
  const [problemIdInput, setProblemIdInput] = useState(useParams().pid || "");

  return (
    <>
      <h1>评测记录</h1>
      <div className="flex flex-row justify-between flex-wrap">
        <div className="space-x-2 mt-1">
          <input
            type="text"
            className="input input-bordered"
            placeholder="记录 ID"
            value={recordIdInput}
            onChange={(e) => setRecordIdInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && navigate(`${recordIdInput}`)}
          />
          <button
            className="btn btn-primary"
            onClick={() => navigate(`${recordIdInput}`)}
          >
            前往
          </button>
        </div>
        <div className="space-x-2 mt-1">
          <span>
            <input
              type="text"
              className="input input-bordered"
              placeholder="用户 ID"
              value={userIdInput}
              onChange={(e) => setUserIdInput(e.target.value)}
              onKeyDown={(e) =>
                e.key === "Enter" &&
                navigate(
                  `?page=${currentPage}&uid=${userIdInput}&pid=${problemIdInput}`
                )
              }
            />
            <input
              type="text"
              className="input input-bordered"
              placeholder="题目 ID"
              value={problemIdInput}
              onChange={(e) => setProblemIdInput(e.target.value)}
              onKeyDown={(e) =>
                e.key === "Enter" &&
                navigate(
                  `?page=${currentPage}&uid=${userIdInput}&pid=${problemIdInput}`
                )
              }
            />
          </span>

          <button
            className="btn btn-primary"
            onClick={() =>
              navigate(
                `?page=${currentPage}&uid=${userIdInput}&pid=${problemIdInput}`
              )
            }
          >
            查询
          </button>
        </div>
      </div>
      <table className="table table-compact w-full not-prose">
        <thead>
          <tr>
            <th className="w-16" />
            <th>状态</th>
            <th className="hidden md:table-cell">题目</th>
            <th>用户</th>
            <th className="hidden xl:table-cell">提交时间</th>
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
              <td className="hidden md:table-cell">
                <ProblemLink problem={record.problem} />
              </td>
              <td>
                <UserLink user={record.submitter} />
              </td>
              <td className="hidden xl:table-cell">
                <span
                  className="tooltip"
                  data-tip={formatDateTime(record.submittedAt)}
                >
                  {formatRelativeDateTime(record.submittedAt)}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={(page) => navigate(`?page=${page}`)}
      />
    </>
  );
}

export { ErrorBoundary } from "~/src/ErrorBoundary";
export { CatchBoundary } from "~/src/CatchBoundary";
