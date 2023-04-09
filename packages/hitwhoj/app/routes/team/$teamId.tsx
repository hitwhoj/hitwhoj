import { NavLink, Outlet } from "@remix-run/react";
import { db } from "~/utils/server/db.server";
import { invariant } from "~/utils/invariant";
import type { LoaderArgs } from "@remix-run/node";
import { json } from "@remix-run/node";
import { findRequestUser } from "~/utils/permission";
import { HiOutlineUserGroup } from "react-icons/hi";
import { useSignalLoaderData } from "~/utils/hooks";
import { useComputed } from "@preact/signals-react";
import { PERM_TEAM } from "~/utils/new-permission/privilege";
import { teamIdScheme } from "~/utils/new-permission/scheme";

export async function loader({ request, params }: LoaderArgs) {
  const teamId = invariant(teamIdScheme, params.teamId, { status: 404 });
  const self = await findRequestUser(request);
  //1. 加入priv
  const [hasViewPerm] = await self
    .newTeam(teamId)
    .hasPrivilege(PERM_TEAM.PERM_TEAM_VIEW_INTERNAL);
  const [hasEditPerm] = await self
    .newTeam(teamId)
    .hasPrivilege(PERM_TEAM.PERM_TEAM_EDIT_INTERNAL);
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
        {hasEditPerm.value && (
          <NavLink className="tab" to="users">
            用户
          </NavLink>
        )}
        {hasEditPerm.value && (
          <NavLink className="tab" to="role">
            角色
          </NavLink>
        )}
        {hasEditPerm.value && (
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
