import type { LoaderArgs, MetaFunction } from "@remix-run/node";
import { json } from "@remix-run/node";
import { useLoaderData, useNavigate } from "@remix-run/react";
import { db } from "~/utils/server/db.server";
import { invariant } from "~/utils/invariant";
import { descriptionScheme, idScheme, pageScheme } from "~/utils/scheme";
import { Markdown } from "~/src/Markdown";
import { selectProblemListData } from "~/utils/db/problem";
import { ProblemLink } from "~/src/problem/ProblemLink";
import { findRequestUser } from "~/utils/permission";
import { Permissions } from "~/utils/permission/permission";
import {
  findProblemSetPrivacy,
  findProblemSetTeam,
} from "~/utils/db/problemset";
import { useMemo, useState } from "react";
import { Pagination } from "~/src/Pagination";

const pageSize = 15;

export async function loader({ request, params }: LoaderArgs) {
  const problemSetId = invariant(idScheme, params.problemSetId, {
    status: 404,
  });
  const self = await findRequestUser(request);
  await self
    .team(await findProblemSetTeam(problemSetId))
    .checkPermission(
      (await findProblemSetPrivacy(problemSetId))
        ? Permissions.PERM_VIEW_PROBLEM_SET
        : Permissions.PERM_VIEW_PROBLEM_SET_PUBLIC
    );

  const url = new URL(request.url);
  const page = invariant(pageScheme, url.searchParams.get("page") || "1");
  const keyword = invariant(
    descriptionScheme,
    url.searchParams.get("keyword") || ""
  );

  const problemSet = await db.problemSet.findUnique({
    where: { id: problemSetId },
    select: {
      id: true,
      title: true,
      description: true,
      tags: true,
      _count: {
        select: {
          problems: true,
        },
      },
      problems: {
        orderBy: { rank: "asc" },
        where: {
          problem: {
            title: {
              contains: keyword,
            },
          },
        },
        select: {
          rank: true,
          problem: {
            select: {
              ...selectProblemListData,
            },
          },
        },
        skip: (page - 1) * pageSize,
        take: pageSize,
      },
    },
  });

  const totalProblems = problemSet?._count?.problems || 0;
  if (totalProblems && page > Math.ceil(totalProblems / pageSize)) {
    throw new Response("Page is out of range", { status: 404 });
  }

  if (!problemSet) {
    throw new Response("Problem Set not found", { status: 404 });
  }

  return json({ problemSet, totalProblems, currentPage: page, keyword });
}

export const meta: MetaFunction<typeof loader> = ({ data }) => ({
  title: `题单: ${data?.problemSet.title} - HITwh OJ`,
  description: data?.problemSet.description,
});

export default function ProblemSetIndex() {
  const { problemSet, totalProblems, currentPage, keyword } =
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
      <Markdown>{problemSet.description}</Markdown>

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
          </tr>
        </thead>
        <tbody>
          {problemSet.problems.map((problem) => (
            <tr key={problem.problem.id}>
              <td className="text-center">{problem.rank}</td>
              <td>
                <ProblemLink problem={problem.problem} />
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

export { ErrorBoundary } from "~/src/ErrorBoundary";
export { CatchBoundary } from "~/src/CatchBoundary";
