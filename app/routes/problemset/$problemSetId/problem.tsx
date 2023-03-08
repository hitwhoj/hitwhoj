import type { LoaderArgs, MetaFunction } from "@remix-run/node";
import { json } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { db } from "~/utils/server/db.server";
import { invariant } from "~/utils/invariant";
import { idScheme, pageScheme } from "~/utils/scheme";
import { Markdown } from "~/src/Markdown";
import { selectProblemListData } from "~/utils/db/problem";
import { ProblemLink } from "~/src/problem/ProblemLink";
import { findRequestUser } from "~/utils/permission";
import { Permissions } from "~/utils/permission/permission";
import {
  findProblemSetPrivacy,
  findProblemSetTeam,
} from "~/utils/db/problemset";
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

  return json({ problemSet, totalProblems, currentPage: page });
}

export const meta: MetaFunction<typeof loader> = ({ data }) => ({
  title: `题单: ${data?.problemSet.title} - HITwh OJ`,
  description: data?.problemSet.description,
});

export default function ProblemSetIndex() {
  const { problemSet, totalProblems, currentPage } =
    useLoaderData<typeof loader>();
  const totalPages = Math.ceil(totalProblems / pageSize);

  return (
    <>
      <Markdown>{problemSet.description}</Markdown>

      <table className="not-prose table-compact table w-full">
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
        action={`/problemset/${problemSet.id}/problem`}
        totalPages={totalPages}
        currentPage={currentPage}
      />
    </>
  );
}

export { ErrorBoundary } from "~/src/ErrorBoundary";
export { CatchBoundary } from "~/src/CatchBoundary";
