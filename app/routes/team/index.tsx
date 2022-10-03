import type { LoaderArgs, MetaFunction } from "@remix-run/node";
import { json } from "@remix-run/node";
import { Link, useLoaderData, useNavigate } from "@remix-run/react";
import { db } from "~/utils/server/db.server";
import { TeamLink } from "~/src/team/TeamLink";
import { HiOutlinePlus } from "react-icons/hi";
import { invariant } from "~/utils/invariant";
import { descriptionScheme, pageScheme } from "~/utils/scheme";
import { useMemo, useState } from "react";
import { Pagination } from "~/src/Pagination";

export const meta: MetaFunction = () => ({
  title: "团队列表 - HITwh OJ",
});

const pageSize = 15;

export async function loader({ request }: LoaderArgs) {
  const url = new URL(request.url);
  const page = invariant(pageScheme, url.searchParams.get("page") || "1");
  const keyword = invariant(
    descriptionScheme,
    url.searchParams.get("keyword") || ""
  );

  const totalTeams = await db.team.count({
    where: { name: { contains: keyword } },
  });
  if (totalTeams && page > Math.ceil(totalTeams / pageSize)) {
    throw new Response("Page is out of range", { status: 404 });
  }

  const teams = await db.team.findMany({
    where: { name: { contains: keyword } },
    orderBy: { name: "asc" },
    skip: (page - 1) * pageSize,
    take: pageSize,
  });

  return json({ teams, totalTeams, currentPage: page, keyword });
}

export default function TeamList() {
  const { teams, totalTeams, currentPage, keyword } =
    useLoaderData<typeof loader>();
  const navigate = useNavigate();
  const totalPages = useMemo(
    () => Math.ceil(totalTeams / pageSize),
    [totalTeams]
  );
  const [teamIdInput, setTeamIdInput] = useState("");
  const [teamNameInput, setTeamNameInput] = useState(keyword);

  return (
    <>
      <h1 className="flex justify-between items-center">
        <span>团队列表</span>
        <Link className="btn btn-primary" to="new">
          <HiOutlinePlus />
          <span>新建团队</span>
        </Link>
      </h1>

      <div className="flex flex-row justify-between flex-wrap">
        <div className="space-x-2 mt-1">
          <input
            type="text"
            className="input input-bordered"
            placeholder="团队 ID"
            value={teamIdInput}
            onChange={(e) => setTeamIdInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && navigate(`${teamIdInput}`)}
          />
          <button
            className="btn btn-primary"
            onClick={() => navigate(`${teamIdInput}`)}
          >
            前往
          </button>
        </div>
        <div className="space-x-2 mt-1">
          <span>
            <input
              type="text"
              className="input input-bordered"
              placeholder="标题"
              value={teamNameInput}
              onChange={(e) => setTeamNameInput(e.target.value)}
              onKeyDown={(e) =>
                e.key === "Enter" &&
                navigate(`?page=1&keyword=${teamNameInput}`)
              }
            />
          </span>

          <button
            className="btn btn-primary"
            onClick={() =>
              navigate(`?page=${currentPage}&keyword=${teamNameInput}`)
            }
          >
            搜索
          </button>
        </div>
      </div>

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
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={(page) => navigate(`?page=${page}`)}
      />
    </>
  );
}

export { CatchBoundary } from "~/src/CatchBoundary";
export { ErrorBoundary } from "~/src/ErrorBoundary";
