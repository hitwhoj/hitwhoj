import type { ActionArgs, LoaderArgs, MetaFunction } from "@remix-run/node";
import { redirect } from "@remix-run/node";
import { useFetcher } from "@remix-run/react";
import { db } from "~/utils/server/db.server";
import { invariant } from "~/utils/invariant";
import {
  teamNameScheme,
  descriptionScheme,
  teamInvitationScheme,
  teamInvitationCodeScheme,
} from "~/utils/scheme";
import { InvitationType, TeamMemberRole } from "@prisma/client";
import {
  Button,
  Input,
  Form,
  Typography,
  Select,
} from "@arco-design/web-react";
import { useState } from "react";
import { findRequestUser } from "~/utils/permission";
const TextArea = Input.TextArea;
const FormItem = Form.Item;
const Option = Select.Option;

export async function loader({ request }: LoaderArgs) {
  const self = await findRequestUser(request);
  if (!self.userId) {
    throw redirect(`/login?redirect=${new URL(request.url).pathname}`);
  }

  return null;
}

export const meta: MetaFunction = () => ({
  title: "新建团队 - HITwh OJ",
});

export async function action({ request }: ActionArgs) {
  const self = await findRequestUser(request);

  const form = await request.formData();
  const name = invariant(teamNameScheme, form.get("name"));
  const description = invariant(descriptionScheme, form.get("description"));
  const invitationType = invariant(
    teamInvitationScheme,
    form.get("invitation")
  );
  const invitationCode =
    invitationType === InvitationType.CODE
      ? invariant(teamInvitationCodeScheme, form.get("code"))
      : "";

  if (!name) {
    throw new Response("team name is missing", { status: 400 });
  }

  const { id: teamId } = await db.team.create({
    data: {
      name: name,
      description: description,
      invitationType: invitationType,
      invitationCode: invitationCode,
      members: {
        create: [
          {
            userId: self.userId!,
            role: TeamMemberRole.Owner,
          },
        ],
      },
    },
  });

  return redirect(`/team/${teamId}`);
}

export default function NewTeam() {
  const fetcher = useFetcher();
  const isCreating = fetcher.state !== "idle";
  const [invitationType, setInvitationType] = useState<InvitationType>(
    InvitationType.FREE
  );

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
    <Typography>
      <Typography.Title heading={3}>创建团队</Typography.Title>
      <Typography.Paragraph>创建一个新的团队！</Typography.Paragraph>
      <fetcher.Form method="post" style={{ maxWidth: 600 }}>
        <FormItem label="名称" required layout="vertical" disabled={isCreating}>
          <Input type="text" name="name" placeholder="团队名称" required />
        </FormItem>
        <FormItem label="描述" required layout="vertical" disabled={isCreating}>
          <TextArea
            name="description"
            required
            autoSize={{
              minRows: 3,
              maxRows: 10,
            }}
            placeholder="介绍信息"
          />
        </FormItem>
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
            disabled={isCreating}
          >
            {Object.values(InvitationType).map((type) => (
              <Option key={type} value={invitationType2Description[type]} />
            ))}
          </Select>
        </FormItem>
        {invitationType === InvitationType.CODE && (
          <FormItem label="邀请码" required layout="vertical">
            <Input name="code" defaultValue="" disabled={isCreating} />
          </FormItem>
        )}
        <FormItem>
          <Button type="primary" htmlType="submit" loading={isCreating}>
            创建团队
          </Button>
        </FormItem>
      </fetcher.Form>
    </Typography>
  );
}

export { CatchBoundary } from "~/src/CatchBoundary";
export { ErrorBoundary } from "~/src/ErrorBoundary";
