import { NavLink, Outlet, useLoaderData } from "@remix-run/react";
import { db } from "~/utils/server/db.server";
import { invariant } from "~/utils/invariant";
import { idScheme } from "~/utils/scheme";
import type { LoaderArgs } from "@remix-run/node";
import { json } from "@remix-run/node";
import { findRequestUser } from "~/utils/permission";
import { Permissions } from "~/utils/permission/permission";
import { HiOutlineUserGroup } from "react-icons/hi";
import { PERM_TEAM } from "~/utils/new-permission/privilege";

export async function loader({ request, params }: LoaderArgs) {
  const teamId = invariant(idScheme, params.teamId, { status: 404 });
  const self = await findRequestUser(request);

  //1. 加入priv
  const [hasViewPerm] = await self
    .team(teamId)
    .hasPrivilegeOrPermission(
      PERM_TEAM.PERM_TEAM_VIEW_INTERNAL,
      Permissions.PERM_TEAM_VIEW_INTERNAL
    );
  const [hasEditPerm] = await self
    .team(teamId)
    .hasPrivilegeOrPermission(
      PERM_TEAM.PERM_TEAM_EDIT_INTERNAL,
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
  const { team, hasEditPerm, hasViewPerm } = useLoaderData<typeof loader>();

  return (
    <>
      <h1 className="flex items-center gap-4">
        <HiOutlineUserGroup className="shrink-0" />
        <span>{team.name}</span>
      </h1>

      <div className="not-prose tabs tabs-boxed bg-base-100">
        <NavLink className="tab" to="profile">
          信息
        </NavLink>
        {hasViewPerm && (
          <NavLink className="tab" to="contest">
            比赛
          </NavLink>
        )}
        {hasEditPerm && (
          <NavLink className="tab" to="settings">
            设置
          </NavLink>
        )}
        {hasViewPerm && (
          <NavLink className="tab" to="members">
            成员
          </NavLink>
        )}
        {hasEditPerm && (
          <NavLink className="tab" to="users">
            用户
          </NavLink>
        )}
        {hasEditPerm && (
          <NavLink className="tab" to="role">
            角色
          </NavLink>
        )}
        {hasEditPerm && (
          <NavLink className="tab" to="privilege">
            权限
          </NavLink>
        )}
      </div>
      <Outlet />
    </>
  );
}

export { CatchBoundary } from "~/src/CatchBoundary";
export { ErrorBoundary } from "~/src/ErrorBoundary";
