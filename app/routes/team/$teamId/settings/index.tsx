import { redirect } from "@remix-run/node";
import type { ActionFunction, LoaderFunction } from "@remix-run/node";
import { invariant } from "~/utils/invariant";
import {
  descriptionScheme,
  idScheme,
  teamNameScheme,
  teamInvitationScheme,
  teamInvitationCodeScheme,
} from "~/utils/scheme";
import { db } from "~/utils/server/db.server";
import { findSessionUid } from "~/utils/sessions";
import { TeamMemberRole, InvitationType } from "@prisma/client";
import type { Team } from "@prisma/client";
import { Form, useFetcher, useLoaderData } from "@remix-run/react";
import { useState } from "react";
import {
  Alert,
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
const FormItem = arcoForm.Item;
const TextArea = Input.TextArea;
const Option = Select.Option;

type LoaderData = {
  profile: Pick<Team, "name" | "description">;
  invitation: {
    type: InvitationType;
    code: string | null;
  };
};

export const loader: LoaderFunction<LoaderData> = async ({ params }) => {
  const teamId = invariant(idScheme, params.teamId);
  const team = await db.team.findUnique({
    where: { id: teamId },
  });

  if (!team) {
    throw new Response("Team not exists", { status: 404 });
  }

  return {
    profile: {
      name: team.name,
      description: team.description,
    },
    invitation: {
      type: team.invitationType,
      code: team.invitationCode,
    },
  };
};

enum ActionType {
  EditProfile = "EditProfile",
  DissolveTeam = "DissolveTeam",
  ModifyInvitation = "ModifyInvitation",
  ExitTeam = "ExitTeam",
  TransferTeam = "TransferTeam",
}

export const action: ActionFunction<Response> = async ({ params, request }) => {
  const teamId = invariant(idScheme, params.teamId);
  const self = await findSessionUid(request);

  const teamMember = await db.teamMember.findUnique({
    where: { userId_teamId: { teamId, userId: self } },
    select: { role: true },
  });

  if (!teamMember) {
    throw new Response("You are not in this team", { status: 403 });
  }

  const form = await request.formData();
  const _action = form.get("_action");

  switch (_action) {
    // 编辑基本信息
    case ActionType.EditProfile: {
      if (
        teamMember.role !== TeamMemberRole.Admin &&
        teamMember.role !== TeamMemberRole.Owner
      ) {
        throw new Response(
          "Permisson denied: Only owner or admin can modify team profile.",
          {
            status: 403,
          }
        );
      }

      const name = invariant(teamNameScheme, form.get("name"));
      const description = invariant(descriptionScheme, form.get("description"));

      const team = await db.team.findMany({
        where: {
          name,
          id: {
            not: teamId,
          },
        },
      });

      if (team) {
        throw new Response("Team name already exists.", { status: 400 });
      }

      await db.team.update({
        where: { id: teamId },
        data: {
          name,
          description,
        },
      });

      return new Response("Team profile updated", { status: 200 });
    }

    // 修改邀请制
    case ActionType.ModifyInvitation: {
      const invitationType = invariant(
        teamInvitationScheme,
        form.get("invitation")
      );
      const invitationCode =
        invitationType === InvitationType.CODE
          ? invariant(teamInvitationCodeScheme, form.get("code"))
          : "";

      await db.team.update({
        where: { id: teamId },
        data: {
          invitationType,
          invitationCode,
        },
      });

      return new Response("Team invitation updated", { status: 200 });
    }

    // 退出团队
    case ActionType.ExitTeam: {
      if (teamMember.role === TeamMemberRole.Owner) {
        throw new Response(
          "Owner can't exit team, please transfer ownership first or dissolve team.",
          {
            status: 403,
          }
        );
      }

      await db.teamMember.delete({
        where: {
          userId_teamId: {
            teamId,
            userId: self,
          },
        },
      });

      return redirect(`/team/${teamId}`);
    }

    // 解散团队
    case ActionType.DissolveTeam: {
      if (teamMember.role !== TeamMemberRole.Owner) {
        throw new Response(
          "Permisson denied: Only owner can dissolve team directly.",
          {
            status: 403,
          }
        );
      }

      await db.teamMember.deleteMany({ where: { teamId } });
      await db.team.delete({ where: { id: teamId } });

      return redirect(`/team`);
    }

    // 转让团队
    case ActionType.TransferTeam: {
      if (teamMember.role !== TeamMemberRole.Owner) {
        throw new Response("Permisson denied: Only owner can transfer team.", {
          status: 403,
        });
      }

      const newId = invariant(idScheme, form.get("new_id"));

      if (newId === self) {
        throw new Response("You can't transfer to yourself.", { status: 400 });
      }

      const member = await db.teamMember.findUnique({
        where: { userId_teamId: { teamId, userId: newId } },
      });

      if (!member) {
        throw new Response("Member not exists or not in this team", {
          status: 404,
        });
      }

      await db.$transaction([
        db.teamMember.update({
          where: { userId_teamId: { teamId, userId: newId } },
          data: {
            role: TeamMemberRole.Owner,
          },
        }),
        db.teamMember.update({
          where: { userId_teamId: { teamId, userId: self } },
          data: {
            role: TeamMemberRole.Admin,
          },
        }),
      ]);

      return new Response("Team transferred", { status: 200 });
    }
  }

  throw new Response("I'm a teapot", { status: 418 });
};

function EditProfile({
  name,
  description,
}: {
  name: string;
  description: string;
}) {
  const fetcher = useFetcher();
  const isUpdating = fetcher.state === "submitting";

  if (fetcher.state === "loading") {
    Message.success("更新团队信息成功");
  }

  return (
    <fetcher.Form method="post" style={{ maxWidth: 600 }}>
      <FormItem label="团队名称" required layout="vertical">
        <Input name="name" defaultValue={name} disabled={isUpdating} required />
      </FormItem>

      <FormItem label="团队描述" required layout="vertical">
        <TextArea
          name="description"
          defaultValue={description}
          disabled={isUpdating}
          autoSize={{
            minRows: 3,
            maxRows: 10,
          }}
        />
      </FormItem>

      <FormItem>
        <Button
          type="primary"
          htmlType="submit"
          icon={<IconCheck />}
          loading={isUpdating}
          name="_action"
          value={ActionType.EditProfile}
        >
          确认更新
        </Button>
      </FormItem>
    </fetcher.Form>
  );
}

function EditInvitation({
  type,
  code,
}: {
  type: InvitationType;
  code: string | null;
}) {
  const fetcher = useFetcher();
  const isUpdating = fetcher.state === "submitting";
  const [invitationType, setInvitationType] = useState(type);

  if (fetcher.state === "loading") {
    Message.success("更新邀请信息成功");
  }

  const invitationType2Description = {
    [InvitationType.FREE]: "所有人均可加入",
    [InvitationType.CODE]: "需要填写邀请码",
    [InvitationType.NONE]: "禁止任何人加入",
  };
  const description2InvitationType: {
    [description: string]: InvitationType;
  } = {
    所有人均可加入: InvitationType.FREE,
    需要填写邀请码: InvitationType.CODE,
    禁止任何人加入: InvitationType.NONE,
  };

  return (
    <fetcher.Form method="post" style={{ maxWidth: 600 }}>
      <FormItem label="邀请制" required layout="vertical">
        <input
          type="hidden"
          name="invitation"
          value={invitationType}
          required
        />
        <Select
          value={invitationType2Description[invitationType]}
          onChange={(value: string) =>
            setInvitationType(description2InvitationType[value])
          }
          style={{ width: 150 }}
          disabled={isUpdating}
        >
          {Object.values(InvitationType).map((type) => (
            <Option key={type} value={invitationType2Description[type]} />
          ))}
        </Select>
      </FormItem>

      {invitationType === InvitationType.CODE && (
        <FormItem label="邀请码" required layout="vertical">
          <Input
            name="code"
            defaultValue={code || ""}
            required
            disabled={isUpdating}
          />
        </FormItem>
      )}

      <FormItem>
        <Button
          type="primary"
          htmlType="submit"
          icon={<IconCheck />}
          loading={isUpdating}
          name="_action"
          value={ActionType.ModifyInvitation}
        >
          确认更新
        </Button>
      </FormItem>
    </fetcher.Form>
  );
}

function ExitTeam() {
  const fetcher = useFetcher();
  const isExisting = fetcher.state === "submitting";
  const [confirm, setConfirm] = useState(false);

  return (
    <Typography>
      <Typography.Title heading={5}>退出团队</Typography.Title>
      <Typography.Paragraph>
        <Checkbox
          onChange={() => setConfirm((confirm) => !confirm)}
          checked={confirm}
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
            loading={isExisting}
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

function TransferTeam() {
  const [confirm, setConfirm] = useState(false);
  const fetcher = useFetcher();
  const isUpdating = fetcher.state === "submitting";

  if (fetcher.state === "loading") {
    Message.success("转让团队成功");
  }

  return (
    <Typography>
      <Typography.Title heading={5}>转让团队</Typography.Title>
      <Typography.Paragraph>
        <Checkbox
          onChange={() => setConfirm((confirm) => !confirm)}
          checked={confirm}
        >
          我知道我在干什么
        </Checkbox>
      </Typography.Paragraph>
      <fetcher.Form method="post">
        <FormItem label="新的团队拥有者id" required layout="vertical">
          <Space>
            <Input name="new_id" required disabled={isUpdating} />
          </Space>
        </FormItem>
        <Button
          htmlType="submit"
          type="primary"
          status="danger"
          disabled={!confirm}
          name="_action"
          value={ActionType.TransferTeam}
        >
          转让团队
        </Button>
      </fetcher.Form>
    </Typography>
  );
}

function DissolveTeam() {
  const [confirm, setConfirm] = useState(false);

  return (
    <Typography>
      <Typography.Title heading={5}>解散团队</Typography.Title>
      <Typography.Paragraph>
        <Alert
          type="warning"
          content="团队相关的所有比赛、题目和评测都会被删除"
        />
      </Typography.Paragraph>
      <Typography.Paragraph>
        <Checkbox
          onChange={() => setConfirm((confirm) => !confirm)}
          checked={confirm}
        >
          我知道我在干什么
        </Checkbox>
      </Typography.Paragraph>
      <Form method="post">
        <Button
          htmlType="submit"
          type="primary"
          status="danger"
          disabled={!confirm}
          name="_action"
          value={ActionType.DissolveTeam}
        >
          解散团队
        </Button>
      </Form>
    </Typography>
  );
}

export default function TeamSettings() {
  const { profile, invitation } = useLoaderData<LoaderData>();

  return (
    <Typography>
      <Typography.Title heading={4}>团队资料</Typography.Title>
      <Typography.Paragraph>
        <EditProfile {...profile} />
      </Typography.Paragraph>
      <Typography.Title heading={4}>邀请设置</Typography.Title>
      <Typography.Paragraph>
        <EditInvitation {...invitation} />
      </Typography.Paragraph>
      <Typography.Title heading={4}>危险区域</Typography.Title>
      <Typography.Paragraph>
        <ExitTeam />
      </Typography.Paragraph>
      <Typography.Paragraph>
        <TransferTeam />
      </Typography.Paragraph>
      <Typography.Paragraph>
        <DissolveTeam />
      </Typography.Paragraph>
    </Typography>
  );
}

export { CatchBoundary } from "~/src/CatchBoundary";
export { ErrorBoundary } from "~/src/ErrorBoundary";
