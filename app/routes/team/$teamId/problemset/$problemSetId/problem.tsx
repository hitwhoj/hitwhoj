import { useComputed } from "@preact/signals-react";
import { json, type LoaderArgs } from "@remix-run/node";
import { Markdown } from "~/src/Markdown";
import { Pagination } from "~/src/Pagination";
import { ProblemLink } from "~/src/problem/ProblemLink";
import { selectProblemListData } from "~/utils/db/problem";
import { findProblemSetPrivacy } from "~/utils/db/problemset";
import { useSignalLoaderData } from "~/utils/hooks";
import { invariant } from "~/utils/invariant";
import { findRequestUser } from "~/utils/permission";
import { Permissions } from "~/utils/permission/permission";
import { idScheme, pageScheme } from "~/utils/scheme";
import { db } from "~/utils/server/db.server";
const PAGE_SIZE = 15;
export async function loader({ request, params }: LoaderArgs) {
  const teamId = await invariant(idScheme, params.teamId, { status: 404 });
  const problemSetId = invariant(idScheme, params.problemSetId, {
    status: 404,
  });
  const self = await findRequestUser(request);
  await self
    .team(teamId)
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
        skip: (page - 1) * PAGE_SIZE,
        take: PAGE_SIZE,
      },
    },
  });

  const totalProblems = problemSet?._count?.problems || 0;
  if (totalProblems && page > Math.ceil(totalProblems / PAGE_SIZE)) {
    throw new Response("Page is out of range", { status: 404 });
  }

  if (!problemSet) {
    throw new Response("Problem Set not found", { status: 404 });
  }

  return json({ problemSet, totalProblems, currentPage: page });
}
export default function ProblemSetIndex() {
  const loaderData = useSignalLoaderData<typeof loader>();
  const problemSet = useComputed(() => loaderData.value.problemSet);
  const totalProblems = useComputed(() => loaderData.value.totalProblems);
  const currentPage = useComputed(() => loaderData.value.currentPage);
  const totalPages = useComputed(() =>
    Math.ceil(totalProblems.value / PAGE_SIZE)
  );

  return (
    <>
      <Markdown>{problemSet.value.description}</Markdown>

      <table className="not-prose table-compact table w-full">
        <thead>
          <tr>
            <th className="w-16" />
            <th>题目</th>
          </tr>
        </thead>
        <tbody>
          {problemSet.value.problems.map((problem) => (
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
        action={`/problemset/${problemSet.value.id}/problem`}
        totalPages={totalPages.value}
        currentPage={currentPage.value}
      />
    </>
  );
}

export { ErrorBoundary } from "~/src/ErrorBoundary";
export { CatchBoundary } from "~/src/CatchBoundary";
