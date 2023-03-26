import type { LoaderArgs, MetaFunction } from "@remix-run/node";
import { json } from "@remix-run/node";
import { Link, NavLink, Outlet } from "@remix-run/react";
import { db } from "~/utils/server/db.server";
import { invariant } from "~/utils/invariant";
import { idScheme } from "~/utils/scheme";
import { findRequestUser } from "~/utils/permission";
import { Permissions } from "~/utils/permission/permission";
import {
  findProblemSetPrivacy,
  findProblemSetTeam,
} from "~/utils/db/problemset";
import { HiOutlineEyeOff, HiOutlineTag } from "react-icons/hi";
import { useSignalLoaderData } from "~/utils/hooks";
import { useComputed } from "@preact/signals-react";

export async function loader({ request, params }: LoaderArgs) {
  const problemSetId = invariant(idScheme, params.problemSetId, {
    status: 404,
  });
  const self = await findRequestUser(request);
  const team = self.team(await findProblemSetTeam(problemSetId));
  await team.checkPermission(
    (await findProblemSetPrivacy(problemSetId))
      ? Permissions.PERM_VIEW_PROBLEM_SET
      : Permissions.PERM_VIEW_PROBLEM_SET_PUBLIC
  );
  const [hasEditPerm] = await team.hasPermission(
    Permissions.PERM_EDIT_PROBLEM_SET
  );

  const problemSet = await db.problemSet.findUnique({
    where: { id: problemSetId },
    select: {
      title: true,
      description: true,
      private: true,
      tags: { select: { name: true } },
    },
  });

  if (!problemSet) {
    throw new Response("Problem Set not found", { status: 404 });
  }

  return json({ problemSet, hasEditPerm });
}

export const meta: MetaFunction<typeof loader> = ({ data }) => ({
  title: `题单: ${data?.problemSet.title} - HITwh OJ`,
  description: data?.problemSet.description,
});

export default function Problemset() {
  const loaderData = useSignalLoaderData<typeof loader>();
  const problemSet = useComputed(() => loaderData.value.problemSet);
  const hasEditPerm = useComputed(() => loaderData.value.hasEditPerm);

  return (
    <>
      <h1>{problemSet.value.title}</h1>

      {(problemSet.value.tags.length > 0 || problemSet.value.private) && (
        <div className="not-prose flex flex-wrap gap-2">
          {problemSet.value.private && (
            <span className="badge badge-warning gap-1">
              <HiOutlineEyeOff />
              <span>隐藏</span>
            </span>
          )}
          {problemSet.value.tags.map(({ name }) => (
            <Link
              className="badge gap-1"
              to={`/problemset/tag/${name}`}
              key={name}
            >
              <HiOutlineTag />
              <span>{name}</span>
            </Link>
          ))}
        </div>
      )}

      <p className="not-prose tabs tabs-boxed bg-base-100">
        <NavLink className="tab" to="problem">
          详情
        </NavLink>
        {hasEditPerm.value && (
          <NavLink className="tab" to="edit">
            编辑
          </NavLink>
        )}
      </p>

      <Outlet />
    </>
  );
}

export { ErrorBoundary } from "~/src/ErrorBoundary";
export { CatchBoundary } from "~/src/CatchBoundary";
