import type { LoaderArgs, MetaFunction } from "@remix-run/node";
import { json } from "@remix-run/node";
import { Link, useLoaderData } from "@remix-run/react";
import { HiOutlinePlus } from "react-icons/hi";
import { ContestLink } from "~/src/contest/ContestLink";
import { ContestSystemTag } from "~/src/contest/ContestSystemTag";
import { Pagination } from "~/src/Pagination";
import { selectContestListData } from "~/utils/db/contest";
import { invariant } from "~/utils/invariant";
import { findRequestUser } from "~/utils/permission";
import { Permissions } from "~/utils/permission/permission";
import { pageScheme } from "~/utils/scheme";
import { db } from "~/utils/server/db.server";
import { formatDateTime } from "~/utils/tools";

const pageSize = 15;

export async function loader({ request }: LoaderArgs) {
  const self = await findRequestUser(request);
  const [hasCreatePerm] = await self
    .team(null)
    .hasPermission(Permissions.PERM_CREATE_CONTEST);
  const [viewAll, viewPublic] = await self
    .team(null)
    .contest(null)
    .hasPermission(
      Permissions.PERM_VIEW_CONTEST,
      Permissions.PERM_VIEW_CONTEST_PUBLIC
    );

  const url = new URL(request.url);
  const page = invariant(pageScheme, url.searchParams.get("page") || "1");
  const totalTeams = await db.contest.count({
    where: viewAll
      ? { team: null }
      : viewPublic
      ? { team: null, private: false }
      : { id: -1 },
  });
  if (totalTeams && page > Math.ceil(totalTeams / pageSize)) {
    throw new Response("Page is out of range", { status: 404 });
  }

  const contests = await db.contest.findMany({
    where: viewAll
      ? { team: null }
      : viewPublic
      ? { team: null, private: false }
      : { id: -1 },
    orderBy: [{ id: "asc" }],
    select: {
      ...selectContestListData,
    },
    skip: (page - 1) * pageSize,
    take: pageSize,
  });

  return json({
    contests,
    hasCreatePerm,
    totalTeams,
    currentPage: page,
  });
}

export const meta: MetaFunction = () => ({
  title: "比赛列表 - HITwh OJ",
});

export default function ContestListIndex() {
  const { contests, hasCreatePerm, totalTeams, currentPage } =
    useLoaderData<typeof loader>();
  const totalPages = Math.ceil(totalTeams / pageSize);

  return (
    <>
      <h1 className="flex items-center justify-between">
        <span>比赛列表</span>
        {hasCreatePerm && (
          <Link className="btn btn-primary gap-2" to="/contest/new">
            <HiOutlinePlus className="h-4 w-4" />
            <span>新建比赛</span>
          </Link>
        )}
      </h1>

      <table className="not-prose table-compact table w-full">
        <thead>
          <tr>
            <th className="w-16" />
            <th>标题</th>
            <th>赛制</th>
            <th>开始时间</th>
            <th>结束时间</th>
          </tr>
        </thead>
        <tbody>
          {contests.map((contest) => (
            <tr key={contest.id}>
              <th className="text-center">{contest.id}</th>
              <td>
                <ContestLink contest={contest} />
              </td>
              <td>
                <ContestSystemTag system={contest.system} />
              </td>
              <td>{formatDateTime(contest.beginTime)}</td>
              <td>{formatDateTime(contest.endTime)}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <Pagination
        action="/contest"
        totalPages={totalPages}
        currentPage={currentPage}
      />
    </>
  );
}

export { ErrorBoundary } from "~/src/ErrorBoundary";
export { CatchBoundary } from "~/src/CatchBoundary";
