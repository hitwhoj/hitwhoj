import type { ActionArgs, LoaderArgs } from "@remix-run/node";
import { json } from "@remix-run/node";
import { Link } from "@remix-run/react";
import { db } from "~/utils/server/db.server";
import { TeamMemberRole} from "~/utils/domain/role";
import { invariant } from "~/utils/invariant";
import { idScheme, teamMemberRoleScheme } from "~/utils/scheme";
import { UserAvatar } from "~/src/user/UserAvatar";
import { findRequestUser } from "~/utils/permission";
import { Permissions } from "~/utils/permission/permission";
import { Privileges } from "~/utils/permission/privilege";
import {
  findTeamAllowMembersInvite,
  findTeamMemberRole,
} from "~/utils/new-permission/db/team";
import { selectUserData } from "~/utils/db/user";
import { HiOutlineCog, HiOutlineLogout, HiOutlinePlus } from "react-icons/hi";
import { useSignalFetcher, useSignalLoaderData } from "~/utils/hooks";
import { useComputed } from "@preact/signals-react";
import { useToasts } from "~/utils/toast";
import { useEffect } from "react";
import {teamIdScheme} from "~/utils/new-permission/scheme";
import {PERM_TEAM} from "~/utils/new-permission/privilege";

export async function loader({ request, params }: LoaderArgs) {
  const teamId = invariant(teamIdScheme, params.teamId, { status: 404 });
  const self = await findRequestUser(request);
  await self.newTeam(teamId).checkPrivilege(PERM_TEAM.PERM_TEAM_VIEW_INTERNAL);
  const [hasEditPerm, hasInvitePerm, hasKickAdminPerm, hasKickMemberPerm] =
    await self
      .newTeam(teamId)
      .hasPrivilege(
        PERM_TEAM.PERM_TEAM_EDIT_MEMBER_ROLE,
        (await findTeamAllowMembersInvite(teamId))
          ? PERM_TEAM.PERM_TEAM_INVITE_MEMBER
          : PERM_TEAM.PERM_TEAM_INVITE_ADMIN,
        PERM_TEAM.PERM_TEAM_KICK_ADMIN,
        PERM_TEAM.PERM_TEAM_KICK_MEMBER
      );

  const members = await db.teamMember.findMany({
    where: { teamId },
    select: {
      user: { select: selectUserData },
      role: true,
    },
  });

  return json({
    members,
    hasEditPerm,
    hasInvitePerm,
    hasKickAdminPerm,
    hasKickMemberPerm,
  });
}

enum ActionType {
  AddMember = "AddMember",
  DeleteMember = "DeleteMember",
  ChangeRole = "ChangeRole",
}

export async function action({ params, request }: ActionArgs) {
  const teamId = invariant(teamIdScheme, params.teamId, { status: 404 });
  const self = await findRequestUser(request);
  await self.checkPrivilege(Privileges.PRIV_OPERATE);

  const form = await request.formData();
  const _action = form.get("_action");
  const memberId = invariant(idScheme, form.get("member"));

  switch (_action) {
    case ActionType.AddMember: {
      await self
        .newTeam(teamId)
        .checkPrivilege(
          (await findTeamAllowMembersInvite(teamId))
            ? PERM_TEAM.PERM_TEAM_INVITE_MEMBER
            : PERM_TEAM.PERM_TEAM_INVITE_ADMIN
        );

      await db.$transaction(async (db) => {
        const exists = await db.teamMember.findUnique({
          where: { userId_teamId: { teamId, userId: memberId } },
        });

        if (exists) {
          throw new Response("User is already in this team", { status: 400 });
        }

        await db.teamMember.create({
          data: { teamId, userId: memberId },
        });
      });
      return null;
    }

    case ActionType.DeleteMember: {
      await self
        .newTeam(teamId)
        .checkPrivilege(
          (await findTeamMemberRole(teamId, memberId)) === TeamMemberRole.Member
            ? PERM_TEAM.PERM_TEAM_KICK_MEMBER
            : PERM_TEAM.PERM_TEAM_KICK_ADMIN
        );

      await db.$transaction(async (db) => {
        const exists = await db.teamMember.findUnique({
          where: { userId_teamId: { teamId, userId: memberId } },
        });

        if (!exists) {
          throw new Response("User is not in this team", { status: 400 });
        }

        await db.teamMember.delete({
          where: { userId_teamId: { userId: memberId, teamId } },
        });
      });

      return null;
    }

    case ActionType.ChangeRole: {
      await self
        .team(teamId)
        .checkPermission(Permissions.PERM_TEAM_EDIT_MEMBER_ROLE);

      const role = invariant(teamMemberRoleScheme, form.get("role"));

      await db.$transaction(async (db) => {
        const exists = await db.teamMember.findUnique({
          where: { userId_teamId: { teamId, userId: memberId } },
        });

        if (!exists) {
          throw new Response("User is not in this team", { status: 400 });
        }

        await db.teamMember.update({
          where: { userId_teamId: { userId: memberId, teamId } },
          data: { role },
        });
      });

      return null;
    }
  }

  throw new Response("Unknown action type", { status: 400 });
}

function DeleteMember({ id }: { id: number }) {
  const fetcher = useSignalFetcher();

  const Toasts = useToasts();

  useEffect(() => {
    if (fetcher.actionSuccess) {
      Toasts.success("踢出成功");
    }
  }, [fetcher.actionSuccess]);

  return (
    <fetcher.Form
      method="post"
      className="tooltip tooltip-error"
      data-tip="踢出团队"
    >
      <input type="hidden" name="member" value={id} />
      <button
        className="btn btn-square btn-error"
        type="submit"
        name="_action"
        value={ActionType.DeleteMember}
        disabled={fetcher.isRunning}
      >
        <HiOutlineLogout className="h-6 w-6" />
      </button>
    </fetcher.Form>
  );
}

function SetMemberRole({ id, role }: { id: number; role: TeamMemberRole }) {
  const fetcher = useSignalFetcher();

  const Toasts = useToasts();

  useEffect(() => {
    if (fetcher.actionSuccess) {
      Toasts.success("设定成员角色成功");
    }
  }, [fetcher.actionSuccess]);

  const isOwner = role === "Owner";
  const isAdmin = role === "Admin";
  const isMember = role === "Member";

  return (
    <fetcher.Form method="post" className="dropdown dropdown-hover">
      <input type="hidden" name="member" value={id} />
      <input type="hidden" name="_action" value={ActionType.ChangeRole} />
      <label tabIndex={0} className="btn btn-square">
        <HiOutlineCog className="h-6 w-6" />
      </label>
      <ul className="dropdown-content menu rounded-box bg-base-300 w-72 p-2 shadow-2xl">
        <li className={isOwner ? "disabled" : ""}>
          <button
            type="submit"
            name="role"
            value={TeamMemberRole.Owner}
            disabled={isOwner || fetcher.isRunning}
          >
            设置为所有人
          </button>
        </li>
        <li className={isAdmin ? "disabled" : ""}>
          <button
            type="submit"
            name="role"
            value={TeamMemberRole.Admin}
            disabled={isAdmin || fetcher.isRunning}
          >
            设置为管理员
          </button>
        </li>
        <li className={isMember ? "disabled" : ""}>
          <button
            type="submit"
            name="role"
            value={TeamMemberRole.Member}
            disabled={isMember || fetcher.isRunning}
          >
            设置为成员
          </button>
        </li>
      </ul>
    </fetcher.Form>
  );
}

const memberRoleTranslation: Record<TeamMemberRole, string> = {
  Owner: "所有人",
  Admin: "管理员",
  Member: "成员",
};

export default function MemberList() {
  const loaderData = useSignalLoaderData<typeof loader>();
  const members = useComputed(() => loaderData.value.members);
  const hasEditPerm = useComputed(() => loaderData.value.hasEditPerm);
  const hasInvitePerm = useComputed(() => loaderData.value.hasInvitePerm);
  const hasKickAdminPerm = useComputed(() => loaderData.value.hasKickAdminPerm);
  const hasKickMemberPerm = useComputed(
    () => loaderData.value.hasKickMemberPerm
  );

  return (
    <>
      <h2 className="flex items-center justify-between">
        <span>团队成员</span>
        {hasInvitePerm.value && (
          <button className="btn btn-primary gap-2">
            <HiOutlinePlus />
            <span>添加成员</span>
          </button>
        )}
      </h2>

      <div className="not-prose grid grid-cols-1 gap-4 md:grid-cols-2">
        {members.value.map((member) => (
          <div
            key={member.user.id}
            className="card bg-base-200 overflow-visible"
          >
            <div className="card-body">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <UserAvatar
                    user={member.user}
                    className="bg-base-100 h-16 w-16 shrink-0 text-2xl"
                  />
                  <div>
                    <Link
                      to={`/user/${member.user.id}`}
                      className="link link-hover block font-bold"
                    >
                      {member.user.nickname || member.user.username}
                    </Link>
                    <div
                      className={`badge ${
                        member.role === "Owner"
                          ? "badge-primary"
                          : member.role === "Admin"
                          ? "badge-secondary"
                          : ""
                      }`}
                    >
                      {memberRoleTranslation[member.role]}
                    </div>
                  </div>
                </div>
                <div className="flex shrink-0 items-center gap-4">
                  {hasEditPerm.value && (
                    <SetMemberRole id={member.user.id} role={member.role} />
                  )}
                  {hasKickAdminPerm.value && member.role === "Admin" && (
                    <DeleteMember id={member.user.id} />
                  )}
                  {hasKickMemberPerm.value && member.role === "Member" && (
                    <DeleteMember id={member.user.id} />
                  )}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </>
  );
}

export { CatchBoundary } from "~/src/CatchBoundary";
export { ErrorBoundary } from "~/src/ErrorBoundary";
