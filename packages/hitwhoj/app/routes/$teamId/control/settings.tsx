import type { ActionArgs, LoaderArgs, SerializeFrom } from "@remix-run/node";
import { json } from "@remix-run/node";
import { redirect } from "@remix-run/node";
import { invariant } from "~/utils/invariant";
import {
  descriptionScheme,
  teamNameScheme,
  teamInvitationScheme,
  teamInvitationCodeScheme,
} from "~/utils/scheme";
import { db } from "~/utils/server/db.server";
import { findRequestUser } from "~/utils/permission";
import { InvitationType } from "@prisma/client";
import { Permissions } from "~/utils/permission/permission";
import { Privileges } from "~/utils/permission/privilege";
import { TeamPermission } from "~/utils/permission/permission/team";
import { UserPermission } from "~/utils/permission/permission/user";
import { HiOutlineLogout, HiOutlineUserGroup } from "react-icons/hi";
import { MarkdownEditor } from "~/src/MarkdownEditor";
import { useComputed, useSignal } from "@preact/signals-react";
import { useSignalFetcher, useSignalLoaderData } from "~/utils/hooks";
import { useToasts } from "~/utils/toast";
import { useEffect } from "react";
import { teamIdScheme } from "~/utils/new-permission/scheme";
import { NavLink } from "@remix-run/react";
import {PERM_TEAM} from "~/utils/new-permission/privilege";

export async function loader({ request, params }: LoaderArgs) {
  const teamId = invariant(teamIdScheme, params.teamId);
  const self = await findRequestUser(request);
  await self.checkPrivilege(Privileges.PRIV_OPERATE);
  const selfTeam = self.team(teamId);
  const [hasEditPerm, hasLeavePerm] = await selfTeam.hasPermission(
    Permissions.PERM_TEAM_EDIT_INTERNAL,
    TeamPermission.Members.with(UserPermission.Nobody)
  );
  const team = await db.team.findUnique({
    where: { id: teamId },
    select: {
      name: true,
      description: true,
      invitationType: true,
      invitationCode: true,
      allowMembersInvite: true,
    },
  });

  if (!team) {
    throw new Response("Team not exists", { status: 404 });
  }

  return json({
    profile: team,
    hasEditPerm,
    hasLeavePerm,
    teamId,
  });
}

enum ActionType {
  EditProfile = "EditProfile",
  ExitTeam = "ExitTeam",
}

export async function action({ params, request }: ActionArgs) {
  const teamId = invariant(teamIdScheme, params.teamId, {status: 404});
  const self = await findRequestUser(request);
  await self.checkPrivilege(Privileges.PRIV_OPERATE);

  const form = await request.formData();
  const _action = form.get("_action");

  switch (_action) {
    // 编辑基本信息
    case ActionType.EditProfile: {
      await self
        .newTeam(teamId)
        .checkPrivilege(PERM_TEAM.PERM_TEAM_EDIT_INTERNAL);

      await db.$transaction(async (db) => {
        const name = invariant(teamNameScheme, form.get("name"));
        const description = invariant(
          descriptionScheme,
          form.get("description")
        );
        const invitationType = invariant(
          teamInvitationScheme,
          form.get("invitation")
        );
        const invitationCode =
          invitationType === InvitationType.CODE
            ? invariant(teamInvitationCodeScheme, form.get("code"))
            : "";
        const allowMembersInvite = form.has("allow_invite");

        const team = await db.team.findUnique({ where: { name } });
        if (team && team.id !== teamId) {
          throw new Response("Team name already exists.", { status: 403 });
        }

        await db.team.update({
          where: { id: teamId },
          data: {
            name,
            description,
            invitationType,
            invitationCode,
            allowMembersInvite,
          },
        });
      });

      return null;
    }

    // 退出团队
    case ActionType.ExitTeam: {
      // 检查是否是团队的成员
      await self
        .team(teamId)
        .checkPermission(TeamPermission.Members.with(UserPermission.Nobody));

      await db.teamMember.delete({
        where: {
          userId_teamId: {
            userId: self.userId!,
            teamId: teamId,
          },
        },
      });

      return redirect(`/team/${teamId}`);
    }
  }

  throw new Response("Unknown action", { status: 400 });
}

type LoaderData = SerializeFrom<typeof loader>;

function EditProfile({
  name,
  description,
  invitationType: type,
  invitationCode: code,
  allowMembersInvite: allow,
}: LoaderData["profile"]) {
  const fetcher = useSignalFetcher();

  const Toasts = useToasts();

  useEffect(() => {
    if (fetcher.actionSuccess) {
      Toasts.success("更新团队信息成功");
    }
  }, [fetcher.actionSuccess]);

  const invitationType = useSignal(type);
  return (
    <fetcher.Form method="post" className="form-control gap-4">
      <div className="form-control w-full max-w-xs">
        <label className="label">
          <span className="label-text">团队名称</span>
        </label>
        <input
          className="input input-bordered"
          name="name"
          defaultValue={name}
          disabled={fetcher.isRunning}
          required
        />
      </div>

      <div className="form-control">
        <label className="label">
          <span className="label-text">团队描述</span>
        </label>
        <MarkdownEditor name="description" defaultValue={description} />
      </div>

      <div className="form-control">
        <label className="label">
          <span className="label-text">邀请制</span>
        </label>
        <div className="flex gap-4">
          <select
            className="select select-bordered"
            name="invitation"
            value={invitationType.value}
            onChange={(event) =>
              (invitationType.value = event.target.value as InvitationType)
            }
            disabled={fetcher.isRunning}
          >
            <option value={InvitationType.FREE}>所有人均可加入</option>
            <option value={InvitationType.CODE}>需要填写邀请码</option>
            <option value={InvitationType.NONE}>禁止任何人加入</option>
          </select>
          {invitationType.value === InvitationType.CODE && (
            <input
              className="input input-bordered"
              name="code"
              defaultValue={code}
              placeholder="邀请码"
              disabled={fetcher.isRunning}
              required
            />
          )}
        </div>
      </div>

      <div className="form-control">
        <label className="label cursor-pointer justify-start gap-2">
          <input
            className="checkbox checkbox-primary"
            type="checkbox"
            name="allow_invite"
            defaultChecked={allow}
            disabled={fetcher.isRunning}
          />
          <span className="label-text">允许团队成员邀请其他用户直接加入</span>
        </label>
      </div>

      <div className="form-control w-full max-w-xs">
        <button
          className="btn btn-primary"
          type="submit"
          disabled={fetcher.isRunning}
          name="_action"
          value={ActionType.EditProfile}
        >
          确认更新
        </button>
      </div>
    </fetcher.Form>
  );
}

function ExitTeam() {
  const fetcher = useSignalFetcher();

  const Toasts = useToasts();

  useEffect(() => {
    if (fetcher.actionSuccess) {
      Toasts.success("成功退出团队");
    }
  }, [fetcher.actionSuccess]);

  return (
    <fetcher.Form method="post">
      <button
        className="btn btn-error gap-2"
        type="submit"
        disabled={fetcher.isRunning}
        name="_action"
        value={ActionType.ExitTeam}
      >
        <HiOutlineLogout />
        <span>退出团队</span>
      </button>
    </fetcher.Form>
  );
}

export default function TeamSettings() {
  const loaderData = useSignalLoaderData<typeof loader>();
  const profile = useComputed(() => loaderData.value.profile);
  const hasLeavePerm = useComputed(() => loaderData.value.hasLeavePerm);
  const hasEditPerm = useComputed(() => loaderData.value.hasEditPerm);
  const teamId = useComputed(() => loaderData.value.teamId);
  return (
    <>
      <h1 className="flex items-center gap-4">
        <HiOutlineUserGroup className="shrink-0" />
        <span>{profile.value.name}</span>
      </h1>
      <div className="not-prose tabs tabs-boxed bg-base-100">
        <NavLink className="tab" to={`/${teamId}/control/role`}>
          角色
        </NavLink>
        <NavLink className="tab" to={`/${teamId}/control/users`}>
          用户
        </NavLink>
        <NavLink className="tab" to={`/${teamId}/control/privilege`}>
          权限
        </NavLink>
        <NavLink className="tab" to={`/${teamId}/control/settings`}>
          设置
        </NavLink>
      </div>
      {hasEditPerm.value && (
        <>
          <h2>团队设置</h2>
          <EditProfile {...profile.value} />
        </>
      )}
      {hasLeavePerm.value && (
        <>
          <h2>危险区域</h2>
          <ExitTeam />
        </>
      )}
    </>
  );
}

export { CatchBoundary } from "~/src/CatchBoundary";
export { ErrorBoundary } from "~/src/ErrorBoundary";
