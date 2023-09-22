import { NavLink, Outlet } from "@remix-run/react";
import { db } from "~/utils/server/db.server";
import { invariant } from "~/utils/invariant";
import { idScheme } from "~/utils/scheme";
import type { LoaderArgs } from "@remix-run/node";
import { json } from "@remix-run/node";
import { findRequestUser } from "~/utils/permission";
import { Permissions } from "~/utils/permission/permission";
import { HiOutlineUserGroup } from "react-icons/hi";
import { useSignalLoaderData } from "~/utils/hooks";
import { useComputed } from "@preact/signals-react";

export async function loader({ request, params }: LoaderArgs) {
  const teamId = invariant(idScheme, params.teamId, { status: 404 });
  const self = await findRequestUser(request);
  const [hasViewPerm, hasEditPerm] = await self
    .team(teamId)
    .hasPermission(
      Permissions.PERM_TEAM_VIEW_INTERNAL,
      Permissions.PERM_TEAM_EDIT_INTERNAL
    );

  const team = await db.team.findUnique({
    where: { id: teamId },
    select: { name: true },
  });

  if (!team) {
    throw new Response("团队不存在", { status: 404 });
  }

  return json({ team, hasViewPerm, hasEditPerm });
}

export default function Record() {
  const loaderData = useSignalLoaderData<typeof loader>();
  const team = useComputed(() => loaderData.value.team);
  const hasEditPerm = useComputed(() => loaderData.value.hasEditPerm);
  const hasViewPerm = useComputed(() => loaderData.value.hasViewPerm);

  return (
    <>
      <h1 className="flex items-center gap-4">
        <HiOutlineUserGroup className="shrink-0" />
        <span>{team.value.name}</span>
      </h1>

      <div className="not-prose tabs tabs-boxed bg-base-100">
        <NavLink className="tab" to="profile">
          信息
        </NavLink>
        {hasViewPerm.value && (
          <NavLink className="tab" to="members">
            成员
          </NavLink>
        )}
        {hasViewPerm.value && (
          <NavLink className="tab" to="contest">
            比赛
          </NavLink>
        )}
        {hasEditPerm.value && (
          <NavLink className="tab" to="settings">
            设置
          </NavLink>
        )}
        {hasViewPerm.value && (
          <NavLink className="tab" to="problemset">
            题单
          </NavLink>
        )}
        {/* {hasViewPerm.value && (
          <NavLink className="tab" to="settings">
            题目
          </NavLink>
        )} */}
      </div>

      <Outlet />
    </>
  );
}

export { CatchBoundary } from "~/src/CatchBoundary";
export { ErrorBoundary } from "~/src/ErrorBoundary";
