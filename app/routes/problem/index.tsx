import type { LoaderArgs, MetaFunction } from "@remix-run/node";
import { json } from "@remix-run/node";
import { Link, useLoaderData, useNavigate } from "@remix-run/react";
import { selectProblemListData } from "~/utils/db/problem";
import { db } from "~/utils/server/db.server";
import { ProblemLink } from "~/src/problem/ProblemLink";
import { findRequestUser } from "~/utils/permission";
import { Permissions } from "~/utils/permission/permission";
import { HiOutlinePlus } from "react-icons/hi";
import { descriptionScheme, pageScheme } from "~/utils/scheme";
import { invariant } from "~/utils/invariant";
import { useMemo, useState } from "react";
import { Pagination } from "~/src/Pagination";

const pageSize = 15;

export async function loader({ request }: LoaderArgs) {
  const self = await findRequestUser(request);
  const [viewAll, viewPublic, hasCreatePerm] = await self
    .team(null)
    .hasPermission(
      Permissions.PERM_VIEW_PROBLEM,
      Permissions.PERM_VIEW_PROBLEM_PUBLIC,
      Permissions.PERM_CREATE_PROBLEM
    );

  const url = new URL(request.url);
  const page = invariant(pageScheme, url.searchParams.get("page") || "1");
  // FIXME: urlencode处理(例如A%20+%20B -> 获取到的是A   B), 特殊符号似乎不能自动处理
  const keyword = invariant(
    descriptionScheme,
    url.searchParams.get("keyword") || ""
  );
  const totalProblems = await db.problem.count({
    where: Object.assign(
      viewAll
        ? { team: null }
        : viewPublic
        ? { team: null, private: false }
        : { id: -1 },
      { title: { contains: keyword } }
    ),
  });
  if (totalProblems && page > Math.ceil(totalProblems / pageSize)) {
    throw new Response("Page is out of range", { status: 404 });
  }

  const problems = await db.problem.findMany({
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
      ...selectProblemListData,
      _count: {
        select: {
          relatedRecords: true,
        },
      },
    },
    skip: (page - 1) * pageSize,
    take: pageSize,
  });

  return json(
    { problems, hasCreatePerm, totalProblems, currentPage: page, keyword },
    { status: 200 }
  );
}

export const meta: MetaFunction = () => ({
  title: "题目列表 - HITwh OJ",
});

export default function ProblemIndex() {
  const { problems, hasCreatePerm, totalProblems, currentPage, keyword } =
    useLoaderData<typeof loader>();
  const navigate = useNavigate();
  const totalPages = useMemo(
    () => Math.ceil(totalProblems / pageSize),
    [totalProblems]
  );
  const [problemIdInput, setProblemIdInput] = useState("");
  const [problemNameInput, setProblemNameInput] = useState(keyword);

  return (
    <>
      <h1 className="flex justify-between items-center">
        <span>题目列表</span>
        {hasCreatePerm && (
          <Link to="/problem/new" className="btn btn-primary gap-2">
            <HiOutlinePlus className="w-4 h-4" />
            <span>新建题目</span>
          </Link>
        )}
      </h1>

      <div className="flex flex-row justify-between flex-wrap">
        <div className="space-x-2 mt-1">
          <input
            type="text"
            className="input input-bordered"
            placeholder="题目 ID"
            value={problemIdInput}
            onChange={(e) => setProblemIdInput(e.target.value)}
            onKeyDown={(e) =>
              e.key === "Enter" && navigate(`${problemIdInput}`)
            }
          />
          <button
            className="btn btn-primary"
            onClick={() => navigate(`${problemIdInput}`)}
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
              value={problemNameInput}
              onChange={(e) => setProblemNameInput(e.target.value)}
              onKeyDown={(e) =>
                e.key === "Enter" &&
                navigate(`?page=1&keyword=${problemNameInput}`)
              }
            />
          </span>

          <button
            className="btn btn-primary"
            onClick={() =>
              navigate(`?page=${currentPage}&keyword=${problemNameInput}`)
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
            <th>题目</th>
            <th>提交</th>
          </tr>
        </thead>
        <tbody>
          {problems.map((problem) => (
            <tr key={problem.id}>
              <th className="text-center">{problem.id}</th>
              <td>
                <ProblemLink problem={problem} />
              </td>
              <td>{problem._count.relatedRecords}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <Pagination
        totalPages={totalPages}
        currentPage={currentPage}
        onPageChange={(page) =>
          navigate(`?page=${page}&keyword=${problemNameInput}`)
        }
      />
    </>
  );
}

export { ErrorBoundary } from "~/src/ErrorBoundary";
export { CatchBoundary } from "~/src/CatchBoundary";
