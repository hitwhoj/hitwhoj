import type { LoaderArgs, MetaFunction } from "@remix-run/node";
import { json } from "@remix-run/node";
import { Link, useLoaderData, useNavigate } from "@remix-run/react";
import { useMemo, useState } from "react";
import { HiOutlinePlus } from "react-icons/hi";
import { ContestLink } from "~/src/contest/ContestLink";
import { ContestSystemTag } from "~/src/contest/ContestSystemTag";
import { Pagination } from "~/src/Pagination";
import { selectContestListData } from "~/utils/db/contest";
import { invariant } from "~/utils/invariant";
import { findRequestUser } from "~/utils/permission";
import { Permissions } from "~/utils/permission/permission";
import { descriptionScheme, pageScheme } from "~/utils/scheme";
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
  const keyword = invariant(
    descriptionScheme,
    url.searchParams.get("keyword") || ""
  );
  const totalTeams = await db.contest.count({
    where: Object.assign(
      viewAll
        ? { team: null }
        : viewPublic
        ? { team: null, private: false }
        : { id: -1 },
      { title: { contains: keyword } }
    ),
  });
  if (totalTeams && page > Math.ceil(totalTeams / pageSize)) {
    throw new Response("Page is out of range", { status: 404 });
  }

  const contests = await db.contest.findMany({
    where: Object.assign(
      viewAll
        ? { team: null }
        : viewPublic
        ? { team: null, private: false }
        : { id: -1 },
      { title: { contains: keyword } }
    ),
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
    keyword,
  });
}

export const meta: MetaFunction = () => ({
  title: "比赛列表 - HITwh OJ",
});

export default function ContestListIndex() {
  const { contests, hasCreatePerm, totalTeams, currentPage, keyword } =
    useLoaderData<typeof loader>();
  const navigate = useNavigate();
  const totalPages = useMemo(
    () => Math.ceil(totalTeams / pageSize),
    [totalTeams]
  );
  const [contestIdInput, setContestIdInput] = useState("");
  // FIXME: useParams不能获取后面的searchParams, 所有搜索框同理
  // const urlParams = new URLSearchParams(window.location.href);
  const [contestNameInput, setContestNameInput] = useState(keyword);

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

      <div className="flex flex-row justify-between flex-wrap">
        <div className="space-x-2 mt-1">
          <input
            type="text"
            className="input input-bordered"
            placeholder="比赛 ID"
            value={contestIdInput}
            onChange={(e) => setContestIdInput(e.target.value)}
            onKeyDown={(e) =>
              e.key === "Enter" && navigate(`${contestIdInput}`)
            }
          />
          <button
            className="btn btn-primary"
            onClick={() => navigate(`${contestIdInput}`)}
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
              value={contestNameInput}
              onChange={(e) => setContestNameInput(e.target.value)}
              onKeyDown={(e) =>
                e.key === "Enter" &&
                navigate(`?page=1&keyword=${contestNameInput}`)
              }
            />
          </span>

          <button
            className="btn btn-primary"
            onClick={() =>
              navigate(`?page=${currentPage}&keyword=${contestNameInput}`)
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
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={(page) => navigate(`?page=${page}`)}
      />
    </>
  );
}

export { ErrorBoundary } from "~/src/ErrorBoundary";
export { CatchBoundary } from "~/src/CatchBoundary";
