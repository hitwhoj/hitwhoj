import { useComputed } from "@preact/signals-react";
import type { LoaderArgs, MetaFunction } from "@remix-run/node";
import { json } from "@remix-run/node";
import { Form, Link } from "@remix-run/react";
import { HiOutlineFilter } from "react-icons/hi";
import { z } from "zod";
import { Pagination } from "~/src/Pagination";
import { ProblemLink } from "~/src/problem/ProblemLink";
import { RecordStatus } from "~/src/record/RecordStatus";
import { UserLink } from "~/src/user/UserLink";
import { selectUserData } from "~/utils/db/user";
import { useSignalLoaderData } from "~/utils/hooks";
import { invariant } from "~/utils/invariant";
import { nullableIdScheme, pageScheme, usernameScheme } from "~/utils/scheme";
import { db } from "~/utils/server/db.server";
import { formatDateTime, formatRelativeDateTime } from "~/utils/tools";

const PAGE_SIZE = 15;

export async function loader({ request }: LoaderArgs) {
  const url = new URL(request.url);

  const uid = invariant(
    usernameScheme.or(z.literal("")),
    url.searchParams.get("uid") || ""
  );
  const pid = invariant(nullableIdScheme, url.searchParams.get("pid"));
  const cid = invariant(nullableIdScheme, url.searchParams.get("cid"));

  const page = invariant(pageScheme, url.searchParams.get("page") || "1");
  const totalRecords = await db.record.count({
    where: {
      contestId: cid || null,
      submitter: {
        username: uid || undefined,
      },
      problemId: pid || undefined,
    },
  });
  if (totalRecords && page > Math.ceil(totalRecords / PAGE_SIZE)) {
    throw new Response("Page is out of range", { status: 404 });
  }

  const records = await db.record.findMany({
    where: {
      contestId: cid || null,
      submitter: {
        username: uid || undefined,
      },
      problemId: pid || undefined,
    },
    orderBy: [{ id: "desc" }],
    skip: (page - 1) * PAGE_SIZE,
    take: PAGE_SIZE,
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

  return json(
    { records, totalRecords, currentPage: page, uid, pid, cid },
    { status: 200 }
  );
}

export const meta: MetaFunction = () => ({
  title: "评测记录 - HITwh OJ",
});

export default function RecordList() {
  const loaderData = useSignalLoaderData<typeof loader>();
  const records = useComputed(() => loaderData.value.records);
  const totalRecords = useComputed(() => loaderData.value.totalRecords);
  const currentPage = useComputed(() => loaderData.value.currentPage);
  const uid = useComputed(() => loaderData.value.uid);
  const pid = useComputed(() => loaderData.value.pid);
  const cid = useComputed(() => loaderData.value.cid);

  const totalPages = useComputed(() =>
    Math.ceil(totalRecords.value / PAGE_SIZE)
  );

  return (
    <>
      <h1>评测记录</h1>

      <Form
        className="flex flex-row flex-wrap items-end justify-between gap-4"
        method="get"
        action="/record"
      >
        <div className="form-control flex-1">
          <label className="label">
            <span className="label-text">由用户</span>
          </label>
          <input
            type="text"
            className="input input-bordered"
            name="uid"
            defaultValue={uid.value || ""}
          />
        </div>
        <div className="form-control flex-1">
          <label className="label">
            <span className="label-text">由题目</span>
          </label>
          <input
            type="text"
            className="input input-bordered"
            name="pid"
            defaultValue={pid.value || ""}
          />
        </div>
        <div className="form-control flex-1">
          <label className="label">
            <span className="label-text">由比赛</span>
          </label>
          <input
            type="text"
            className="input input-bordered"
            name="cid"
            defaultValue={cid.value || ""}
          />
        </div>
        <button className="btn btn-primary gap-2">
          <HiOutlineFilter />
          <span>过滤</span>
        </button>
      </Form>
      <table className="not-prose table-compact table w-full">
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
          {records.value.map((record) => (
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
        action={`/record?uid=${uid.value || ""}&pid=${pid.value || ""}&cid=${
          cid.value || ""
        }`}
        totalPages={totalPages.value}
        currentPage={currentPage.value}
      />
    </>
  );
}

export { ErrorBoundary } from "~/src/ErrorBoundary";
export { CatchBoundary } from "~/src/CatchBoundary";
