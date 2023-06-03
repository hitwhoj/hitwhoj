import type { LoaderArgs, MetaFunction } from "@remix-run/node";
import { json } from "@remix-run/node";
import { Link } from "@remix-run/react";
import { db } from "~/utils/server/db.server";
import { TeamLink } from "~/src/newLink/TeamLink";
import { HiOutlinePlus } from "react-icons/hi";
import { invariant } from "~/utils/invariant";
import { pageScheme } from "~/utils/scheme";
import { Pagination } from "~/src/Pagination";
import { findRequestUser } from "~/utils/permission";
import { useSignalLoaderData } from "~/utils/hooks";
import { useComputed } from "@preact/signals-react";
import { Privileges } from "~/utils/new-permission/privilege";

export const meta: MetaFunction = () => ({
  title: "团队列表 - HITwh OJ",
});

const PAGE_SIZE = 15;

export async function loader({ request }: LoaderArgs) {
  const self = await findRequestUser(request);
  const [hasCreatePerm] = await self.hasPrivilege(Privileges.PRIV_TEAM_CREATE);

  const url = new URL(request.url);
  const page = invariant(pageScheme, url.searchParams.get("page") || "1");

  const totalTeams = await db.team.count({});
  if (totalTeams && page > Math.ceil(totalTeams / PAGE_SIZE)) {
    throw new Response("Page is out of range", { status: 404 });
  }

  const teams = await db.team.findMany({
    orderBy: { id: "asc" },
    skip: (page - 1) * PAGE_SIZE,
    take: PAGE_SIZE,
  });
  return json({ teams, totalTeams, currentPage: page, hasCreatePerm });
}

export default function TeamList() {
  const loaderData = useSignalLoaderData<typeof loader>();
  const teams = useComputed(() => loaderData.value.teams);
  const totalTeams = useComputed(() => loaderData.value.totalTeams);
  const currentPage = useComputed(() => loaderData.value.currentPage);
  const hasCreatePerm = useComputed(() => loaderData.value.hasCreatePerm);

  const totalPages = useComputed(() => Math.ceil(totalTeams.value / PAGE_SIZE));

  return (
    <>
      <h1 className="flex items-center justify-between">
        <span>团队列表</span>
        {hasCreatePerm.value && (
          <Link className="btn btn-primary" to="new">
            <HiOutlinePlus />
            <span>新建团队</span>
          </Link>
        )}
      </h1>

      <table className="not-prose table-compact table w-full">
        <thead>
          <tr>
            <th className="w-16" />
            <th>团队</th>
          </tr>
        </thead>
        <tbody>
          {teams.value.map((team) => (
            <tr key={team.id}>
              <th className="text-center">{team.id}</th>
              <td>
                <TeamLink team={team} />
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <Pagination
        action="/team"
        totalPages={totalPages.value}
        currentPage={currentPage.value}
      />
    </>
  );
}

export { CatchBoundary } from "~/src/CatchBoundary";
export { ErrorBoundary } from "~/src/ErrorBoundary";
