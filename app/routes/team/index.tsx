import type { LoaderArgs, MetaFunction } from "@remix-run/node";
import { json } from "@remix-run/node";
import { Link, useLoaderData } from "@remix-run/react";
import { db } from "~/utils/server/db.server";
import { TeamLink } from "~/src/team/TeamLink";
import { HiOutlinePlus } from "react-icons/hi";

export const meta: MetaFunction = () => ({
  title: "团队列表 - HITwh OJ",
});

export async function loader(_: LoaderArgs) {
  const teams = await db.team.findMany({
    take: 20,
    orderBy: { name: "asc" },
  });

  return json({ teams });
}

export default function TeamList() {
  const { teams } = useLoaderData<typeof loader>();

  return (
    <>
      <h1 className="flex justify-between items-center">
        <span>团队列表</span>
        <Link className="btn btn-primary" to="new">
          <HiOutlinePlus />
          <span>新建团队</span>
        </Link>
      </h1>

      <div className="not-prose overflow-x-auto">
        <table className="table w-full">
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
      </div>
    </>
  );
}

export { CatchBoundary } from "~/src/CatchBoundary";
export { ErrorBoundary } from "~/src/ErrorBoundary";
