import type { ActionArgs, LoaderArgs } from "@remix-run/node";
import { json } from "@remix-run/node";
import { redirect } from "@remix-run/node";
import { invariant } from "~/utils/invariant";
import {
  descriptionScheme,
  idScheme,
  teamNameScheme,
  teamInvitationScheme,
  teamInvitationCodeScheme,
} from "~/utils/scheme";
import { db } from "~/utils/server/db.server";
import { findRequestUser } from "~/utils/permission";
import { InvitationType } from "@prisma/client";
import { Permissions } from "~/utils/permission/permission";
import { useFetcher, useLoaderData } from "@remix-run/react";
import { useEffect, useState } from "react";
import {
  Button,
  Checkbox,
  Typography,
  Form as arcoForm,
  Input,
  Message,
  Select,
  Space,
} from "@arco-design/web-react";
import { IconCheck } from "@arco-design/web-react/icon";
import { Privileges } from "~/utils/permission/privilege";
import type { UseDataFunctionReturn } from "@remix-run/react/dist/components";
import { TeamPermission } from "~/utils/permission/permission/team";
import { UserPermission } from "~/utils/permission/permission/user";
const FormItem = arcoForm.Item;
const TextArea = Input.TextArea;
const Option = Select.Option;

export async function loader({ request, params }: LoaderArgs) {
  const teamId = invariant(idScheme, params.teamId);
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
  });
}

enum ActionType {
  EditProfile = "EditProfile",
  ExitTeam = "ExitTeam",
}

export async function action({ params, request }: ActionArgs) {
  const teamId = invariant(idScheme, params.teamId);
  const self = await findRequestUser(request);
  await self.checkPrivilege(Privileges.PRIV_OPERATE);

  const form = await request.formData();
  const _action = form.get("_action");

  switch (_action) {
    // 编辑基本信息
    case ActionType.EditProfile: {
      await self
        .team(teamId)
        .checkPermission(Permissions.PERM_TEAM_EDIT_INTERNAL);

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
        const allowMembersInvite = form.get("allow_invite") === "true";

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

type LoaderData = UseDataFunctionReturn<typeof loader>;

function EditProfile({
  name,
  description,
  invitationType: type,
  invitationCode: code,
  allowMembersInvite: allow,
}: LoaderData["profile"]) {
  const fetcher = useFetcher();
  const isActionSubmit =
    fetcher.state === "submitting" && fetcher.type === "actionSubmission";
  const isActionReload =
    fetcher.state === "loading" && fetcher.type === "actionReload";
  const isLoading = isActionSubmit || isActionReload;
  const [invitationType, setInvitationType] = useState(type);
  const [allowMembersInvite, setAllowMembersInvite] = useState(allow);

  const invitationType2Description = {
    [InvitationType.FREE]: "所有人均可加入",
    [InvitationType.CODE]: "需要填写邀请码",
    [InvitationType.NONE]: "禁止任何人加入",
  };

  useEffect(() => {
    if (isActionReload) {
      Message.success("更新团队信息成功");
    }
  }, [isActionReload]);

  return (
    <fetcher.Form method="post" style={{ maxWidth: 600 }}>
      <FormItem label="团队名称" required layout="vertical">
        <Input name="name" defaultValue={name} disabled={isLoading} required />
      </FormItem>

      <FormItem label="团队描述" required layout="vertical">
        <TextArea
          name="description"
          defaultValue={description}
          disabled={isLoading}
          autoSize={{
            minRows: 3,
            maxRows: 10,
          }}
        />
      </FormItem>

      <FormItem label="邀请制" required layout="vertical">
        <input
          type="hidden"
          name="invitation"
          value={invitationType}
          required
        />
        <Space>
          <Select
            value={invitationType}
            onChange={(value) => setInvitationType(value)}
            style={{ width: 150 }}
            disabled={isLoading}
          >
            {Object.values(InvitationType).map((type) => (
              <Option key={type} value={type}>
                {invitationType2Description[type]}
              </Option>
            ))}
          </Select>
          {invitationType === InvitationType.CODE && (
            <Input
              name="code"
              defaultValue={code}
              placeholder="邀请码"
              disabled={isLoading}
              required
            />
          )}
        </Space>
      </FormItem>

      <FormItem>
        <input type="hidden" name="allow_invite" value={String(allow)} />
        <Checkbox
          checked={allowMembersInvite}
          onChange={(allow) => setAllowMembersInvite(allow)}
        >
          允许团队成员邀请其他用户直接加入
        </Checkbox>
      </FormItem>

      <FormItem>
        <Button
          type="primary"
          htmlType="submit"
          icon={<IconCheck />}
          loading={isLoading}
          name="_action"
          value={ActionType.EditProfile}
        >
          确认更新
        </Button>
      </FormItem>
    </fetcher.Form>
  );
}

function ExitTeam() {
  const fetcher = useFetcher();
  const isActionSubmit =
    fetcher.state === "submitting" && fetcher.type === "actionSubmission";
  const isActionReload =
    fetcher.state === "loading" && fetcher.type === "actionReload";
  const isLoading = isActionSubmit || isActionReload;
  const [confirm, setConfirm] = useState(false);

  return (
    <Typography>
      <Typography.Title heading={5}>退出团队</Typography.Title>
      <Typography.Paragraph>
        <Checkbox
          onChange={() => setConfirm((confirm) => !confirm)}
          checked={confirm}
          disabled={isLoading}
        >
          我知道我在干什么
        </Checkbox>
      </Typography.Paragraph>
      <Typography.Paragraph>
        <fetcher.Form method="post">
          <Button
            htmlType="submit"
            type="primary"
            status="danger"
            loading={isLoading}
            disabled={!confirm}
            name="_action"
            value={ActionType.ExitTeam}
          >
            退出团队
          </Button>
        </fetcher.Form>
      </Typography.Paragraph>
    </Typography>
  );
}

export default function TeamSettings() {
  const { profile, hasLeavePerm, hasEditPerm } = useLoaderData<typeof loader>();

  return (
    <Typography>
      {hasEditPerm && (
        <>
          <Typography.Title heading={4}>团队设置</Typography.Title>
          <Typography.Paragraph>
            <EditProfile {...profile} />
          </Typography.Paragraph>
        </>
      )}
      {hasLeavePerm && (
        <>
          <Typography.Title heading={4}>危险区域</Typography.Title>
          <Typography.Paragraph>
            <ExitTeam />
          </Typography.Paragraph>
        </>
      )}
    </Typography>
  );
}

export { CatchBoundary } from "~/src/CatchBoundary";
export { ErrorBoundary } from "~/src/ErrorBoundary";
