import type { LoaderArgs, MetaFunction } from "@remix-run/node";
import { json } from "@remix-run/node";
import { Link, useLoaderData } from "@remix-run/react";
import { db } from "~/utils/server/db.server";
import { ProblemSetLink } from "~/src/problemset/ProblemSetLink";
import { Permissions } from "~/utils/permission/permission";
import { HiOutlinePlus } from "react-icons/hi";
import { findRequestUser } from "~/utils/permission";

export async function loader({ request }: LoaderArgs) {
  const self = await findRequestUser(request);
  const [viewAll, viewPublic, hasEditPerm] = await self
    .team(null)
    .hasPermission(
      Permissions.PERM_VIEW_PROBLEM_SET,
      Permissions.PERM_VIEW_PROBLEM_SET_PUBLIC,
      Permissions.PERM_EDIT_PROBLEM_SET
    );

  const problemSets = await db.problemSet.findMany({
    where: viewAll
      ? { team: null }
      : viewPublic
      ? { team: null, private: false }
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
  });

  return json({ problemSets, hasEditPerm });
}

export const meta: MetaFunction = () => ({
  title: "题单列表 - HITwh OJ",
});

export default function ProblemsetList() {
  const { problemSets, hasEditPerm } = useLoaderData<typeof loader>();

  return (
    <>
      <h1 className="flex justify-between items-center">
        <span>题单列表</span>

        {hasEditPerm && (
          <Link className="btn btn-primary gap-2" to="new">
            <HiOutlinePlus className="w-4 h-4" />
            <span>新建题单</span>
          </Link>
        )}
      </h1>

      <table className="table table-compact w-full not-prose">
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
