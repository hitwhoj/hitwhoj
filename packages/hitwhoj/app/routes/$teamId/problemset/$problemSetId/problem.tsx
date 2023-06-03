import type { LoaderArgs, MetaFunction } from "@remix-run/node";
import { json } from "@remix-run/node";
import { db } from "~/utils/server/db.server";
import { invariant } from "~/utils/invariant";
import { idScheme, pageScheme } from "~/utils/scheme";
import { Markdown } from "~/src/Markdown";
import { selectProblemListData } from "~/utils/db/problem";
import { ProblemLink } from "~/src/newLink/ProblemLink";
import { findRequestUser } from "~/utils/permission";
import {
  findProblemSetPrivacy,
  findProblemSetTeam,
} from "~/utils/db/problemset";
import { Pagination } from "~/src/Pagination";
import { useSignalLoaderData } from "~/utils/hooks";
import { useComputed } from "@preact/signals-react";
import { teamIdScheme } from "~/utils/new-permission/scheme";
import { PERM_TEAM } from "~/utils/new-permission/privilege";

const PAGE_SIZE = 15;

export async function loader({ request, params }: LoaderArgs) {
  const problemSetId = invariant(idScheme, params.problemSetId, {
    status: 404,
  });
  const teamId = invariant(teamIdScheme, params.teamId, { status: 404 });
  const self = await findRequestUser(request);
  await self
    .newTeam(await findProblemSetTeam(problemSetId))
    .checkPrivilege(
      (await findProblemSetPrivacy(problemSetId))
        ? PERM_TEAM.PERM_VIEW_PROBLEM_SET
        : PERM_TEAM.PERM_VIEW_PROBLEM_SET_PUBLIC
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

  return json({ problemSet, totalProblems, currentPage: page, teamId });
}

export const meta: MetaFunction<typeof loader> = ({ data }) => ({
  title: `题单: ${data?.problemSet.title} - HITwh OJ`,
  description: data?.problemSet.description,
});

export default function ProblemSetIndex() {
  const teamId = useComputed(() => loaderData.value.teamId);
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
                <ProblemLink problem={problem.problem} teamId={teamId.value} />
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
