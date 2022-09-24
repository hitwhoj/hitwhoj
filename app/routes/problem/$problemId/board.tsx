import type { LoaderArgs } from "@remix-run/node";
import { json } from "@remix-run/node";
import { Link, useLoaderData } from "@remix-run/react";
import { RecordStatus } from "~/src/record/RecordStatus";
import { UserLink } from "~/src/user/UserLink";
import { selectUserData } from "~/utils/db/user";
import { invariant } from "~/utils/invariant";
import { idScheme } from "~/utils/scheme";
import { db } from "~/utils/server/db.server";
import { formatDateTime, formatNumber } from "~/utils/tools";

export async function loader({ params }: LoaderArgs) {
  const problemId = invariant(idScheme, params.problemId, { status: 404 });

  const records = await db.record.findMany({
    where: {
      status: "Accepted",
      problemId,
      contestId: null,
    },
    distinct: ["submitterId"],
    orderBy: [{ time: "asc" }, { submittedAt: "asc" }],
    select: {
      id: true,
      status: true,
      time: true,
      memory: true,
      submitter: { select: { ...selectUserData } },
      submittedAt: true,
    },
  });

  return json({ records });
}

export default function ProblemBoard() {
  const { records } = useLoaderData<typeof loader>();

  return (
    <>
      <h2>谁跑的最快</h2>

      <table className="table table-compact w-full not-prose">
        <thead>
          <tr>
            <th className="w-16" />
            <th>状态</th>
            <th>用户</th>
            <th className="hidden sm:table-cell">时间</th>
            <th className="hidden sm:table-cell">内存</th>
            <th className="hidden md:table-cell">提交时间</th>
          </tr>
        </thead>
        <tbody>
          {records.map((record, index) => (
            <tr key={record.id}>
              <th className="text-center">{index + 1}</th>
              <td>
                <Link to={`/record/${record.id}`}>
                  <RecordStatus status={record.status} />
                </Link>
              </td>
              <td>
                <UserLink user={record.submitter} />
              </td>
              <td className="hidden sm:table-cell">
                {formatNumber(record.time)}ms
              </td>
              <td className="hidden sm:table-cell">
                {formatNumber(record.memory)}bytes
              </td>
              <td className="hidden md:table-cell">
                {formatDateTime(record.submittedAt)}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </>
  );
}
