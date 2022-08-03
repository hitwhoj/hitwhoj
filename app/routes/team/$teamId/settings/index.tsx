import { redirect } from "@remix-run/node";
import type { ActionFunction, LoaderFunction } from "@remix-run/node";
import { invariant } from "~/utils/invariant";
import { descriptionScheme, idScheme, teamNameScheme } from "~/utils/scheme";
import { db } from "~/utils/server/db.server";
import { findSessionUid } from "~/utils/sessions";
import { TeamMemberRole } from "@prisma/client";
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
} from "@arco-design/web-react";
import { IconCheck } from "@arco-design/web-react/icon";
const FormItem = arcoForm.Item;
const TextArea = Input.TextArea;

type LoaderData = {
  profile: Pick<Team, "name" | "description">;
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
  };
};

enum ActionType {
  EditProfile = "EditProfile",
  DissolveTeam = "DissolveTeam",
  ModifyInvitation = "ModifyInvitation",
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

    // 解散团队
    case ActionType.DissolveTeam: {
      if (teamMember.role !== TeamMemberRole.Owner) {
        throw new Response("Permisson denied: Only owner can dissolve team.", {
          status: 403,
        });
      }

      await db.teamMember.deleteMany({ where: { teamId } });
      await db.team.delete({ where: { id: teamId } });

      return redirect(`/team`);
    }

    // 修改邀请制
    case ActionType.ModifyInvitation: {
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

function DissolveTeam() {
  const [confirm, setConfirm] = useState(false);

  return (
    <Typography>
      {/* TODO: 在这里加个返回按钮 */}
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
  const { profile } = useLoaderData<LoaderData>();

  return (
    <Typography>
      <Typography.Title heading={4}>团队资料</Typography.Title>
      <Typography.Paragraph>
        <EditProfile {...profile} />
      </Typography.Paragraph>
      <Typography.Title heading={4}>邀请设置</Typography.Title>
      <Typography.Paragraph></Typography.Paragraph>
      <Typography.Title heading={4}>危险区域</Typography.Title>
      <Typography.Paragraph>
        <DissolveTeam />
      </Typography.Paragraph>
    </Typography>
  );
}

export { CatchBoundary } from "~/src/CatchBoundary";
export { ErrorBoundary } from "~/src/ErrorBoundary";
