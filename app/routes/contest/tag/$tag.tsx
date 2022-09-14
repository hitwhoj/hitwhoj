import type { LoaderArgs, MetaFunction } from "@remix-run/node";
import { useLoaderData, useParams } from "@remix-run/react";
import { invariant } from "~/utils/invariant";
import { tagScheme } from "~/utils/scheme";
import { selectContestListData } from "~/utils/db/contest";
import { db } from "~/utils/server/db.server";
import { ContestLink } from "~/src/contest/ContestLink";
import { ContestSystemTag } from "~/src/contest/ContestSystemTag";
import { formatDateTime } from "~/utils/tools";
import { findRequestUser } from "~/utils/permission";
import { Permissions } from "~/utils/permission/permission";

export async function loader({ request, params }: LoaderArgs) {
  const tag = invariant(tagScheme, params.tag, { status: 404 });
  const self = await findRequestUser(request);
  const [viewAll, viewPublic] = await self
    .team(null)
    .contest(null)
    .hasPermission(
      Permissions.PERM_VIEW_CONTEST,
      Permissions.PERM_VIEW_CONTEST_PUBLIC
    );

  const contests = await db.contest.findMany({
    where: viewAll
      ? { team: null, tags: { some: { name: tag } } }
      : viewPublic
      ? { team: null, tags: { some: { name: tag } }, private: false }
      : { id: -1 },
    orderBy: [{ id: "asc" }],
    select: {
      ...selectContestListData,
    },
  });

  return { contests };
}

export const meta: MetaFunction<typeof loader> = ({ params }) => ({
  title: `比赛标签: ${params.tag} - HITwh OJ`,
});

export default function ContestTag() {
  const { tag } = useParams();
  const { contests } = useLoaderData<typeof loader>();

  return (
    <>
      <h1>比赛标签：{tag}</h1>

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
