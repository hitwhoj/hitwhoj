import type { LoaderArgs, MetaFunction } from "@remix-run/node";
import { json } from "@remix-run/node";
import { Link, useLoaderData } from "@remix-run/react";
import { db } from "~/utils/server/db.server";
import { TeamLink } from "~/src/team/TeamLink";
import { HiOutlinePlus } from "react-icons/hi";
import { invariant } from "~/utils/invariant";
import { pageScheme } from "~/utils/scheme";
import { Pagination } from "~/src/Pagination";

export const meta: MetaFunction = () => ({
  title: "团队列表 - HITwh OJ",
});

const pageSize = 15;

export async function loader({ request }: LoaderArgs) {
  const url = new URL(request.url);
  const page = invariant(pageScheme, url.searchParams.get("page") || "1");

  const totalTeams = await db.team.count({});
  if (totalTeams && page > Math.ceil(totalTeams / pageSize)) {
    throw new Response("Page is out of range", { status: 404 });
  }

  const teams = await db.team.findMany({
    orderBy: { name: "asc" },
    skip: (page - 1) * pageSize,
    take: pageSize,
  });

  return json({ teams, totalTeams, currentPage: page });
}

export default function TeamList() {
  const { teams, totalTeams, currentPage } = useLoaderData<typeof loader>();
  const totalPages = Math.ceil(totalTeams / pageSize);

  return (
    <>
      <h1 className="flex justify-between items-center">
        <span>团队列表</span>
        <Link className="btn btn-primary" to="new">
          <HiOutlinePlus />
          <span>新建团队</span>
        </Link>
      </h1>

      <table className="table table-compact w-full not-prose">
        <thead>
          <tr>
            <th className="w-16" />
            <th>团队</th>
          </tr>
        </thead>
        <tbody>
          {teams.map((team) => (
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
        totalPages={totalPages}
        currentPage={currentPage}
      />
    </>
  );
}

export { CatchBoundary } from "~/src/CatchBoundary";
export { ErrorBoundary } from "~/src/ErrorBoundary";
