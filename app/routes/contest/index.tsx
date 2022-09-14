import type { LoaderArgs, MetaFunction } from "@remix-run/node";
import { json } from "@remix-run/node";
import { Link, useLoaderData } from "@remix-run/react";
import { HiOutlinePlus } from "react-icons/hi";
import { ContestLink } from "~/src/contest/ContestLink";
import { ContestSystemTag } from "~/src/contest/ContestSystemTag";
import { selectContestListData } from "~/utils/db/contest";
import { findRequestUser } from "~/utils/permission";
import { Permissions } from "~/utils/permission/permission";
import { db } from "~/utils/server/db.server";
import { formatDateTime } from "~/utils/tools";

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
  });

  return json({ contests, hasCreatePerm });
}

export const meta: MetaFunction = () => ({
  title: "比赛列表 - HITwh OJ",
});

export default function ContestListIndex() {
  const { contests, hasCreatePerm } = useLoaderData<typeof loader>();

  return (
    <>
      <h1 className="flex justify-between items-center">
        <span>比赛列表</span>
        {hasCreatePerm && (
          <Link className="btn btn-primary gap-2" to="/contest/new">
            <HiOutlinePlus className="w-4 h-4" />
            <span>新建比赛</span>
          </Link>
        )}
      </h1>

      <table className="table w-full not-prose">
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

export { ErrorBoundary } from "~/src/ErrorBoundary";
export { CatchBoundary } from "~/src/CatchBoundary";
