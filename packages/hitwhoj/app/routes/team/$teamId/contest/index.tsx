import type { LoaderArgs, MetaFunction } from "@remix-run/node";
import { json } from "@remix-run/node";
import { Link, useLoaderData } from "@remix-run/react";
import { idScheme } from "~/utils/scheme";
import { invariant } from "~/utils/invariant";
import { selectContestListData } from "~/utils/db/contest";
import { db } from "~/utils/server/db.server";
import { ContestLink } from "~/src/contest/ContestLink";
import { ContestSystemTag } from "~/src/contest/ContestSystemTag";
import { formatDateTime } from "~/utils/tools";
import { findRequestUser } from "~/utils/permission";
import { Permissions } from "~/utils/permission/permission";
import { HiOutlinePlus } from "react-icons/hi";

export async function loader({ params, request }: LoaderArgs) {
  const teamId = invariant(idScheme, params.teamId, { status: 404 });
  const self = await findRequestUser(request);
  await self.team(teamId).checkPermission(Permissions.PERM_TEAM_VIEW_INTERNAL);
  const [hasCreatePerm] = await self
    .team(teamId)
    .hasPermission(Permissions.PERM_CREATE_CONTEST);
  const [viewAll, viewPublic] = await self
    .team(teamId)
    .contest(null)
    .hasPermission(
      Permissions.PERM_VIEW_CONTEST,
      Permissions.PERM_VIEW_CONTEST_PUBLIC
    );

  const contests = await db.contest.findMany({
    where: viewAll
      ? { teamId }
      : viewPublic
      ? { teamId, private: false }
      : { id: -1 },
    orderBy: [{ id: "desc" }],
    select: {
      ...selectContestListData,
    },
  });

  return json({ contests, hasCreatePerm });
}

export const meta: MetaFunction = () => ({
  title: `团队比赛列表 - HITwh OJ`,
});

export default function HomeworkList() {
  const { contests, hasCreatePerm } = useLoaderData<typeof loader>();

  return (
    <>
      <h2 className="flex items-center justify-between">
        <span>团队比赛</span>
        {hasCreatePerm && (
          <Link className="btn btn-primary gap-2" to="new">
            <HiOutlinePlus />
            <span>创建比赛</span>
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
    </>
  );
}

export { CatchBoundary } from "~/src/CatchBoundary";
export { ErrorBoundary } from "~/src/ErrorBoundary";
