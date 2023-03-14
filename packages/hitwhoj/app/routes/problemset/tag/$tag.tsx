import type { LoaderArgs, MetaFunction } from "@remix-run/node";
import { json } from "@remix-run/node";
import { useLoaderData, useParams } from "@remix-run/react";
import { db } from "~/utils/server/db.server";
import { invariant } from "~/utils/invariant";
import { tagScheme } from "~/utils/scheme";
import { ProblemSetLink } from "~/src/problemset/ProblemSetLink";
import { findRequestUser } from "~/utils/permission";
import { Permissions } from "~/utils/permission/permission";

export async function loader({ request, params }: LoaderArgs) {
  const tag = invariant(tagScheme, params.tag, { status: 404 });
  const self = await findRequestUser(request);
  const [viewAll, viewPublic] = await self
    .team(null)
    .hasPermission(
      Permissions.PERM_VIEW_PROBLEM_SET,
      Permissions.PERM_VIEW_PROBLEM_SET_PUBLIC
    );

  const problemSets = await db.problemSet.findMany({
    where: viewAll
      ? { team: null, tags: { some: { name: tag } } }
      : viewPublic
      ? { team: null, tags: { some: { name: tag } }, private: false }
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

  return json({ problemSets });
}

export const meta: MetaFunction = ({ params }) => ({
  title: `题单标签: ${params.tag} - HITwh OJ`,
});

export default function ProblemSetTag() {
  const { tag } = useParams();
  const { problemSets } = useLoaderData<typeof loader>();

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
          {problemSets.map((problemset) => (
            <tr key={problemset.id}>
              <th className="text-center">{problemset.id}</th>
              <td>
                <ProblemSetLink problemset={problemset} />
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
