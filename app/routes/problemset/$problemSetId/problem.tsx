import type { LoaderArgs, MetaFunction } from "@remix-run/node";
import { json } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { db } from "~/utils/server/db.server";
import { invariant } from "~/utils/invariant";
import { idScheme } from "~/utils/scheme";
import { Markdown } from "~/src/Markdown";
import { selectProblemListData } from "~/utils/db/problem";
import { ProblemLink } from "~/src/problem/ProblemLink";
import { findRequestUser } from "~/utils/permission";
import { Permissions } from "~/utils/permission/permission";
import {
  findProblemSetPrivacy,
  findProblemSetTeam,
} from "~/utils/db/problemset";

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

  const problemSet = await db.problemSet.findUnique({
    where: { id: problemSetId },
    select: {
      id: true,
      title: true,
      description: true,
      tags: true,
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
      },
    },
  });

  if (!problemSet) {
    throw new Response("Problem Set not found", { status: 404 });
  }

  return json({ problemSet });
}

export const meta: MetaFunction<typeof loader> = ({ data }) => ({
  title: `题单: ${data?.problemSet.title} - HITwh OJ`,
  description: data?.problemSet.description,
});

export default function ProblemSetIndex() {
  const { problemSet } = useLoaderData<typeof loader>();

  return (
    <>
      <Markdown>{problemSet.description}</Markdown>

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
    </>
  );
}

export { ErrorBoundary } from "~/src/ErrorBoundary";
export { CatchBoundary } from "~/src/CatchBoundary";
