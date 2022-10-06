import type { LoaderArgs, MetaFunction } from "@remix-run/node";
import { json } from "@remix-run/node";
import { Link, useLoaderData } from "@remix-run/react";
import { selectProblemListData } from "~/utils/db/problem";
import { db } from "~/utils/server/db.server";
import { ProblemLink } from "~/src/problem/ProblemLink";
import { findRequestUser } from "~/utils/permission";
import { Permissions } from "~/utils/permission/permission";
import { HiOutlinePlus } from "react-icons/hi";
import { pageScheme } from "~/utils/scheme";
import { invariant } from "~/utils/invariant";
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
  const totalProblems = await db.problem.count({
    where: viewAll
      ? { team: null }
      : viewPublic
      ? { team: null, private: false }
      : { id: -1 },
  });
  if (totalProblems && page > Math.ceil(totalProblems / pageSize)) {
    throw new Response("Page is out of range", { status: 404 });
  }

  const problems = await db.problem.findMany({
    where: viewAll
      ? { team: null }
      : viewPublic
      ? { team: null, private: false }
      : { id: -1 },
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

  return json({ problems, hasCreatePerm, totalProblems, currentPage: page });
}

export const meta: MetaFunction = () => ({
  title: "题目列表 - HITwh OJ",
});

export default function ProblemIndex() {
  const { problems, hasCreatePerm, totalProblems, currentPage } =
    useLoaderData<typeof loader>();
  const totalPages = Math.ceil(totalProblems / pageSize);

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
        action="/problem"
        totalPages={totalPages}
        currentPage={currentPage}
      />
    </>
  );
}

export { ErrorBoundary } from "~/src/ErrorBoundary";
export { CatchBoundary } from "~/src/CatchBoundary";
