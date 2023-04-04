import type { ActionArgs, LoaderArgs, MetaFunction } from "@remix-run/node";
import { json } from "@remix-run/node";
import { Form, useLoaderData, useTransition } from "@remix-run/react";
import { db } from "~/utils/server/db.server";
import { invariant } from "~/utils/invariant";
import { idScheme, teamInvitationCodeScheme } from "~/utils/scheme";
import { Markdown } from "~/src/Markdown";
import { formatDateTime } from "~/utils/tools";
import { findRequestUser } from "~/utils/permission";
import { Privileges } from "~/utils/permission/privilege";
import { PERM_TEAM } from "~/utils/new-permission/privilege";
import { InvitationType } from "@prisma/client";
import { Permissions } from "~/utils/permission/permission";
import { useContext, useEffect } from "react";
import { UserContext } from "~/utils/context/user";
import { ToastContext } from "~/utils/context/toast";
const TeamMemberRole = {
  Owner: "Owner",
  Admin: "Admin",
  Member: "Member",
};
export async function loader({ request, params }: LoaderArgs) {
  const teamId = invariant(idScheme, params.teamId, { status: 404 });
  const self = await findRequestUser(request);
  //
  const hasViewPerm = await self
    .team(teamId)
    .hasPrivilegeOrPermission(
      PERM_TEAM.PERM_TEAM_VIEW_INTERNAL,
      Permissions.PERM_TEAM_VIEW_INTERNAL
    );
  const team = await db.team.findUnique({
    where: { id: teamId },
    select: {
      id: true,
      name: true,
      description: true,
      createdAt: true,
      invitationType: true,
      _count: {
        select: {
          members: true,
          contests: true,
          problems: true,
          problemSets: true,
        },
      },
    },
  });

  if (!team) {
    throw new Response("Team not found", { status: 404 });
  }

  return json({ team, hasViewPerm });
}

export const action = async ({ params, request }: ActionArgs) => {
  const teamId = invariant(idScheme, params.teamId);
  const self = await findRequestUser(request);
  await self.checkPrivilege(Privileges.PRIV_OPERATE);

  await db.$transaction(async (db) => {
    const team = await db.team.findUnique({
      where: { id: teamId },
      select: { invitationType: true, invitationCode: true },
    });

    if (!team) {
      throw new Response("团队不存在", { status: 404 });
    }

    const exists = await db.teamMember.findUnique({
      where: {
        userId_teamId: {
          userId: self.userId!,
          teamId: teamId,
        },
      },
    });

    if (exists) {
      throw new Response("你已经是该团队成员了", { status: 403 });
    }

    if (team.invitationType === InvitationType.NONE) {
      throw new Response("该团队不允许加入", { status: 403 });
    }

    if (team.invitationType === InvitationType.CODE) {
      const form = await request.formData();
      const code = invariant(teamInvitationCodeScheme, form.get("code"));
      if (code !== team.invitationCode) {
        throw new Response("邀请码错误", { status: 403 });
      }
    }

    await db.teamMember.create({
      data: {
        userId: self.userId!,
        teamId: teamId,
        role: TeamMemberRole.Member,
      },
    });
  });

  return null;
};

export const meta: MetaFunction<typeof loader> = ({ data }) => ({
  title: `团队: ${data?.team.name} - HITwh OJ`,
});

export default function TeamDetail() {
  const { team, hasViewPerm } = useLoaderData<typeof loader>();
  const self = useContext(UserContext);

  const { state, type } = useTransition();
  const isActionReload = state === "loading" && type === "actionReload";
  const isActionSubmit = state === "submitting" && type === "actionSubmission";
  const isLoading = isActionReload && isActionSubmit;

  const isNotMember = self && !hasViewPerm;

  const Toasts = useContext(ToastContext);

  useEffect(() => {
    if (isActionReload) {
      Toasts.success("成功加入团队");
    }
  }, [isActionReload]);

  return (
    <>
      <table>
        <thead>
        <tr>
          <th>团队信息</th>
        </tr>
        </thead>
        <tbody>
        <tr>
          <th>创建时间</th>
          <td>{formatDateTime(team.createdAt)}</td>
        </tr>
        <tr>
          <th>成员数量</th>
          <td>{team._count.members}</td>
        </tr>
        <tr>
          <th>题目数量</th>
          <td>{team._count.problems}</td>
        </tr>
        <tr>
          <th>题单数量</th>
          <td>{team._count.problemSets}</td>
        </tr>
        <tr>
          <th>比赛数量</th>
          <td>{team._count.contests}</td>
        </tr>
        </tbody>
      </table>

      <Markdown>{team.description}</Markdown>

      {isNotMember &&
      (team.invitationType === InvitationType.NONE ? (
        <div className="alert alert-info">该团队未开放申请加入</div>
      ) : (
        <Form method="post" className="flex gap-4">
          {team.invitationType === InvitationType.CODE && (
            <input
              className="input input-bordered"
              name="code"
              placeholder="请输入邀请码"
              required
              disabled={isLoading}
            />
          )}
          <button
            className="btn btn-primary"
            type="submit"
            disabled={isLoading}
          >
            加入团队
          </button>
        </Form>
      ))}
    </>
  );
}

export { CatchBoundary } from "~/src/CatchBoundary";
export { ErrorBoundary } from "~/src/ErrorBoundary";
