import { useComputed } from "@preact/signals-react";
import { json, type LoaderArgs, type MetaFunction } from "@remix-run/node";
import { Link } from "@remix-run/react";
import { HiOutlinePlus } from "react-icons/hi";
import { Pagination } from "~/src/Pagination";
import { ProblemSetLink } from "~/src/problemset/ProblemSetLink";
import { useSignalLoaderData } from "~/utils/hooks";
import { invariant } from "~/utils/invariant";
import { findRequestUser } from "~/utils/permission";
import { Permissions } from "~/utils/permission/permission";
import { idScheme, pageScheme } from "~/utils/scheme";
import { db } from "~/utils/server/db.server";
const PAGE_SIZE = 15;
export async function loader({ request, params }: LoaderArgs) {
  const self = await findRequestUser(request);
  const teamId = await invariant(idScheme, params.teamId, { status: 404 });

  const [viewAll, viewPublic, hasEditPerm] = await self
    .team(teamId)
    .hasPermission(
      Permissions.PERM_VIEW_PROBLEM_SET,
      Permissions.PERM_VIEW_PROBLEM_SET_PUBLIC,
      Permissions.PERM_EDIT_PROBLEM_SET
    );
  const url = new URL(request.url);
  const page = invariant(pageScheme, url.searchParams.get("page") || "1");
  const totalProblemSets = await db.problemSet.count({
    where: viewAll
      ? { teamId: teamId }
      : viewPublic
      ? { teamId: teamId, private: false }
      : { id: -1 },
  });
  if (totalProblemSets && page > Math.ceil(totalProblemSets / PAGE_SIZE)) {
    throw new Response("Page is out of range", { status: 404 });
  }
  const problemSets = await db.problemSet.findMany({
    where: viewAll
      ? { teamId: teamId }
      : viewPublic
      ? { teamId: teamId, private: false }
      : { id: -1 },

    orderBy: [{ id: "asc" }],
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
    skip: (page - 1) * PAGE_SIZE,
    take: PAGE_SIZE,
  });
  return json({
    problemSets,
    hasEditPerm,
    totalProblemSets,
    currentPage: page,
  });
}
export const meta: MetaFunction = () => ({
  title: "团队题单 - HITwh OJ",
});
export default function ProblemsetList() {
  const loaderData = useSignalLoaderData<typeof loader>();
  const problemSets = useComputed(() => loaderData.value.problemSets);
  const hasEditPerm = useComputed(() => loaderData.value.hasEditPerm);
  const totalProblemSets = useComputed(() => loaderData.value.totalProblemSets);
  const currentPage = useComputed(() => loaderData.value.currentPage);

  const totalPages = useComputed(() =>
    Math.ceil(totalProblemSets.value / PAGE_SIZE)
  );

  return (
    <>
      <h2 className="flex items-center justify-between">
        <span>题单列表</span>

        {hasEditPerm.value && (
          <Link className="btn btn-primary gap-2" to="new">
            <HiOutlinePlus className="h-4 w-4" />
            <span>新建题单</span>
          </Link>
        )}
      </h2>

      <table className="not-prose table-compact table w-full">
        <thead>
          <tr>
            <th className="w-16" />
            <th>题单</th>
            <th>题目数量</th>
          </tr>
        </thead>
        <tbody>
          {problemSets.value.map((problemset, index) => (
            <tr key={problemset.id}>
              <th className="text-center">
                {index + 1 + (Number(currentPage) - 1) * PAGE_SIZE}
              </th>
              <td>
                <ProblemSetLink problemset={problemset} />
              </td>
              <td>{problemset._count.problems}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <Pagination
        action="/problemset"
        totalPages={totalPages.value}
        currentPage={currentPage.value}
      />
    </>
  );
}

export { ErrorBoundary } from "~/src/ErrorBoundary";
export { CatchBoundary } from "~/src/CatchBoundary";
