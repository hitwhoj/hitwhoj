import type {
  ActionFunction,
  LoaderFunction,
  MetaFunction,
} from "@remix-run/node";
import { redirect } from "@remix-run/node";
import { useFetcher } from "@remix-run/react";
import { db } from "~/utils/server/db.server";
import { findSessionUid } from "~/utils/sessions";
import { invariant } from "~/utils/invariant";
import { teamNameScheme, descriptionScheme } from "~/utils/scheme";
import { TeamMemberRole } from "@prisma/client";
import { Button, Input, Form, Typography } from "@arco-design/web-react";
const TextArea = Input.TextArea;
const FormItem = Form.Item;

export const meta: MetaFunction = () => ({
  title: "新建团队 - HITwh OJ",
});

export const loader: LoaderFunction = async ({ request }) => {
  const self = await findSessionUid(request);
  if (!self) {
    throw redirect("/login");
  }
  return null;
};

export const action: ActionFunction<Response> = async ({ request }) => {
  const self = await findSessionUid(request);

  const form = await request.formData();
  const name = invariant(teamNameScheme, form.get("name"));
  const description = invariant(descriptionScheme, form.get("description"));

  if (!name) {
    throw new Response("team name is missing", { status: 400 });
  }

  const { id: teamId } = await db.team.create({
    data: {
      name: name,
      description: description,
      createdAt: new Date(Date.now()),
      members: {
        create: [
          {
            userId: self,
            role: TeamMemberRole.Owner,
          },
        ],
      },
    },
  });

  return redirect(`/team/${teamId}`);
};

export default function NewTeam() {
  const fetcher = useFetcher();
  const isCreating = fetcher.state !== "idle";

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
