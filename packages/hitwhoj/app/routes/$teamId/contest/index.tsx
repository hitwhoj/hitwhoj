import { useComputed } from "@preact/signals-react";
import type { LoaderArgs, MetaFunction } from "@remix-run/node";
import { json } from "@remix-run/node";
import { Link } from "@remix-run/react";
import { HiOutlinePlus } from "react-icons/hi";
import { ContestLink } from "~/src/newLink/ContestLink";
import { ContestSystemTag } from "~/src/contest/ContestSystemTag";
import { Pagination } from "~/src/Pagination";
import { selectContestListData } from "~/utils/db/contest";
import { useSignalLoaderData } from "~/utils/hooks";
import { invariant } from "~/utils/invariant";
import { findRequestUser } from "~/utils/permission";
import { Permissions } from "~/utils/permission/permission";
import { pageScheme } from "~/utils/scheme";
import { db } from "~/utils/server/db.server";
import { formatDateTime } from "~/utils/tools";
import { teamIdScheme } from "~/utils/new-permission/scheme";

const PAGE_SIZE = 15;

export async function loader({ request, params }: LoaderArgs) {
  const self = await findRequestUser(request);
  const teamId = invariant(teamIdScheme, params.teamId, { status: 404 });
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
      ? { teamId: teamId }
      : viewPublic
      ? { teamId: teamId, private: false }
      : { id: -1 },
  });
  if (totalTeams && page > Math.ceil(totalTeams / PAGE_SIZE)) {
    throw new Response("Page is out of range", { status: 404 });
  }

  const contests = await db.contest.findMany({
    where: viewAll
      ? { teamId: teamId }
      : viewPublic
      ? { teamId: teamId, private: false }
      : { id: -1 },
    orderBy: [{ id: "asc" }],
    select: {
      ...selectContestListData,
    },
    skip: (page - 1) * PAGE_SIZE,
    take: PAGE_SIZE,
  });

  return json({
    contests,
    hasCreatePerm,
    totalTeams,
    currentPage: page,
    teamId,
  });
}

export const meta: MetaFunction = () => ({
  title: "比赛列表 - HITwh OJ",
});

export default function ContestListIndex() {
  const loaderData = useSignalLoaderData<typeof loader>();
  const contests = useComputed(() => loaderData.value.contests);
  const hasCreatePerm = useComputed(() => loaderData.value.hasCreatePerm);
  const totalTeams = useComputed(() => loaderData.value.totalTeams);
  const currentPage = useComputed(() => loaderData.value.currentPage);

  const totalPages = useComputed(() => Math.ceil(totalTeams.value / PAGE_SIZE));
  const teamId = useComputed(() => loaderData.value.teamId);
  return (
    <>
      <h2 className="flex items-center justify-between">
        <span>团队比赛</span>
        {hasCreatePerm.value && (
          <Link className="btn btn-primary gap-2" to={`/${teamId}/contest/new`}>
            <HiOutlinePlus className="h-4 w-4" />
            <span>新建比赛</span>
          </Link>
        )}
      </h2>

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
          {contests.value.map((contest) => (
            <tr key={contest.id}>
              <th className="text-center">{contest.id}</th>
              <td>
                <ContestLink contest={contest} teamId={teamId.value} />
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
        totalPages={totalPages.value}
        currentPage={currentPage.value}
      />
    </>
  );
}

export { ErrorBoundary } from "~/src/ErrorBoundary";
export { CatchBoundary } from "~/src/CatchBoundary";
