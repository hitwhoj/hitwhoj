import type { ActionArgs, LoaderArgs } from "@remix-run/node";
import { json } from "@remix-run/node";
import { Link, useFetcher, useLoaderData } from "@remix-run/react";
import { db } from "~/utils/server/db.server";
import { TeamMemberRole } from "@prisma/client";
import { invariant } from "~/utils/invariant";
import { idScheme, teamMemberRoleScheme } from "~/utils/scheme";
import { useContext, useEffect } from "react";
import { UserAvatar } from "~/src/user/UserAvatar";
import { findRequestUser } from "~/utils/permission";
import { Permissions } from "~/utils/permission/permission";
import { Privileges } from "~/utils/permission/privilege";
import {
  findTeamAllowMembersInvite,
  findTeamMemberRole,
} from "~/utils/db/team";
import { selectUserData } from "~/utils/db/user";
import { HiOutlineCog, HiOutlineLogout, HiOutlinePlus } from "react-icons/hi";
import { ToastContext } from "~/utils/context/toast";

export async function loader({ request, params }: LoaderArgs) {
  const teamId = invariant(idScheme, params.teamId);
  const self = await findRequestUser(request);
  await self.team(teamId).checkPermission(Permissions.PERM_TEAM_VIEW_INTERNAL);
  const [hasEditPerm, hasInvitePerm, hasKickAdminPerm, hasKickMemberPerm] =
    await self
      .team(teamId)
      .hasPermission(
        Permissions.PERM_TEAM_EDIT_MEMBER_ROLE,
        (await findTeamAllowMembersInvite(teamId))
          ? Permissions.PERM_TEAM_INVITE_MEMBER
          : Permissions.PERM_TEAM_INVITE_ADMIN,
        Permissions.PERM_TEAM_KICK_ADMIN,
        Permissions.PERM_TEAM_KICK_MEMBER
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
  const teamId = invariant(idScheme, params.teamId);
  const self = await findRequestUser(request);
  await self.checkPrivilege(Privileges.PRIV_OPERATE);

  const form = await request.formData();
  const _action = form.get("_action");
  const memberId = invariant(idScheme, form.get("member"));

  switch (_action) {
    case ActionType.AddMember: {
      await self
        .team(teamId)
        .checkPermission(
          (await findTeamAllowMembersInvite(teamId))
            ? Permissions.PERM_TEAM_INVITE_MEMBER
            : Permissions.PERM_TEAM_INVITE_ADMIN
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
        .team(teamId)
        .checkPermission(
          (await findTeamMemberRole(teamId, memberId)) === TeamMemberRole.Member
            ? Permissions.PERM_TEAM_KICK_MEMBER
            : Permissions.PERM_TEAM_KICK_ADMIN
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
  const fetcher = useFetcher();
  const isActionSubmit =
    fetcher.state === "submitting" && fetcher.type === "actionSubmission";
  const isActionReload =
    fetcher.state === "loading" && fetcher.type === "actionReload";
  const isLoading = isActionSubmit || isActionReload;

  const Toasts = useContext(ToastContext);

  useEffect(() => {
    if (isActionReload) {
      Toasts.success("踢出成功");
    }
  }, [isActionReload]);

  return (
    <fetcher.Form
      method="post"
      className="tooltip tooltip-error"
      data-tip="踢出团队"
    >
      <input type="hidden" name="member" value={id} />
      <button
        className="btn btn-error btn-square"
        type="submit"
        name="_action"
        value={ActionType.DeleteMember}
        disabled={isLoading}
      >
        <HiOutlineLogout className="w-6 h-6" />
      </button>
    </fetcher.Form>
  );
}

function SetMemberRole({ id, role }: { id: number; role: TeamMemberRole }) {
  const fetcher = useFetcher();
  const isActionSubmit =
    fetcher.state === "submitting" && fetcher.type === "actionSubmission";
  const isActionReload =
    fetcher.state === "loading" && fetcher.type === "actionReload";
  const isLoading = isActionSubmit || isActionReload;

  const Toasts = useContext(ToastContext);

  useEffect(() => {
    if (isActionReload) {
      Toasts.success("设定成员角色成功");
    }
  }, [isActionReload]);

  const isOwner = role === "Owner";
  const isAdmin = role === "Admin";
  const isMember = role === "Member";

  return (
    <fetcher.Form method="post" className="dropdown">
      <input type="hidden" name="member" value={id} />
      <input type="hidden" name="_action" value={ActionType.ChangeRole} />
      <label tabIndex={0} className="btn btn-square">
        <HiOutlineCog className="w-6 h-6" />
      </label>
      <ul className="dropdown-content shadow-2xl menu p-2 bg-base-300 w-72 rounded-box">
        <li className={isOwner ? "disabled" : ""}>
          <button
            type="submit"
            name="role"
            value={TeamMemberRole.Owner}
            disabled={isOwner || isLoading}
          >
            设置为所有人
          </button>
        </li>
        <li className={isAdmin ? "disabled" : ""}>
          <button
            type="submit"
            name="role"
            value={TeamMemberRole.Admin}
            disabled={isAdmin || isLoading}
          >
            设置为管理员
          </button>
        </li>
        <li className={isMember ? "disabled" : ""}>
          <button
            type="submit"
            name="role"
            value={TeamMemberRole.Member}
            disabled={isMember || isLoading}
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
  const {
    members,
    hasEditPerm,
    hasInvitePerm,
    hasKickAdminPerm,
    hasKickMemberPerm,
  } = useLoaderData<typeof loader>();

  return (
    <>
      <h2 className="flex justify-between items-center">
        <span>团队成员</span>
        {hasInvitePerm && (
          <button className="btn btn-primary gap-2">
            <HiOutlinePlus />
            <span>添加成员</span>
          </button>
        )}
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 not-prose">
        {members.map((member) => (
          <div
            key={member.user.id}
            className="card bg-base-200 overflow-visible"
          >
            <div className="card-body">
              <div className="flex justify-between items-center">
                <div className="flex gap-4 items-center">
                  <UserAvatar
                    user={member.user}
                    className="w-16 h-16 bg-base-100 text-2xl shrink-0"
                  />
                  <div>
                    <Link
                      to={`/user/${member.user.id}`}
                      className="block link link-hover font-bold"
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
                <div className="flex gap-4 items-center shrink-0">
                  {hasEditPerm && (
                    <SetMemberRole id={member.user.id} role={member.role} />
                  )}
                  {hasKickAdminPerm && member.role === "Admin" && (
                    <DeleteMember id={member.user.id} />
                  )}
                  {hasKickMemberPerm && member.role === "Member" && (
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
