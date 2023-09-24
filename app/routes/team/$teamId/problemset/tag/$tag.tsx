import { useComputed } from "@preact/signals-react";
import { json, type LoaderArgs } from "@remix-run/node";
import { useParams } from "@remix-run/react";
import { TeamProblemSetLink } from "~/src/problemset/TeamProblemSetLink";
import { useSignalLoaderData } from "~/utils/hooks";
import { invariant } from "~/utils/invariant";
import { findRequestUser } from "~/utils/permission";
import { Permissions } from "~/utils/permission/permission";
import { idScheme, tagScheme } from "~/utils/scheme";
import { db } from "~/utils/server/db.server";

export async function loader({ request, params }: LoaderArgs) {
  const teamId = invariant(idScheme, params.teamId, { status: 404 });
  const tag = invariant(tagScheme, params.tag, { status: 404 });
  const self = await findRequestUser(request);
  const [viewAll, viewPublic] = await self
    .team(teamId)
    .hasPermission(
      Permissions.PERM_VIEW_PROBLEM_SET,
      Permissions.PERM_VIEW_PROBLEM_SET_PUBLIC
    );

  const problemSets = await db.problemSet.findMany({
    where: viewAll
      ? { teamId: teamId, tags: { some: { name: tag } } }
      : viewPublic
      ? { teamId: teamId, tags: { some: { name: tag } }, private: false }
      : { id: -1 },
    orderBy: { id: "asc" },
    select: {
      id: true,
      title: true,
      private: true,
      _count: {
        select: {
          problems: true,
        },
      },
    },
  });

  if (!problemSets.length) {
    throw new Response("Problem Set Tag not found", { status: 404 });
  }

  return json({ problemSets, teamId });
}
export default function ProblemSetTag() {
  const { tag } = useParams();
  const loaderData = useSignalLoaderData<typeof loader>();
  const problemSets = useComputed(() => loaderData.value.problemSets);

  return (
    <>
      <h1>题单标签：{tag}</h1>

      <table className="not-prose table-compact table w-full">
        <thead>
          <tr>
            <th className="w-16" />
            <th>题单</th>
            <th>题目数量</th>
          </tr>
        </thead>
        <tbody>
          {problemSets.value.map((problemset) => (
            <tr key={problemset.id}>
              <th className="text-center">{problemset.id}</th>
              <td>
                <TeamProblemSetLink
                  problemset={problemset}
                  teamId={loaderData.value.teamId}
                />
              </td>
              <td>{problemset._count.problems}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </>
  );
}

export { ErrorBoundary } from "~/src/ErrorBoundary";
export { CatchBoundary } from "~/src/CatchBoundary";
