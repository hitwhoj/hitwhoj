import type { ActionFunction, LoaderFunction } from "@remix-run/node";
import { redirect } from "@remix-run/node";
import { useFetcher } from "@remix-run/react";
import { db } from "~/utils/server/db.server";
import { findSessionUid } from "~/utils/sessions";
import { invariant } from "~/utils/invariant";
import { teamNameScheme, descriptionScheme } from "~/utils/scheme";
import { TeamMemberRole } from "@prisma/client";
import { Button, Input, Form } from "@arco-design/web-react";
const TextArea = Input.TextArea;
const FormItem = Form.Item;

export const loader: LoaderFunction = async ({ request }) => {
  const userId = await findSessionUid(request);
  if (!userId) {
    throw redirect("/login");
  }
  return null;
};

export const action: ActionFunction<Response> = async ({ request }) => {
  const form = await request.formData();
  const name = invariant(teamNameScheme.safeParse(form.get("name")));
  const description = invariant(
    descriptionScheme.safeParse(form.get("description"))
  );

  if (!name) {
    throw new Response("team name is missing", { status: 400 });
  }
  const userId = await findSessionUid(request);
  if (!userId) {
    throw redirect("/login");
  }
  const { id: teamId } = await db.team.create({
    data: {
      name: name,
      description: description,
      createdAt: new Date(Date.now()),
      members: {
        create: [{ userId: userId, role: TeamMemberRole.Owner }],
      },
    },
  });

  return redirect(`/team/${teamId}`);
};

export default function NewTeam() {
  const fetcher = useFetcher();
  const isCreating = fetcher.state === "submitting";

  return (
    <>
      <h1>创建团队</h1>
      <fetcher.Form method="post" style={{ maxWidth: 600 }}>
        <FormItem label="名称" required labelCol={{ span: 3 }}>
          <Input type="text" name="name" placeholder="Team name" required />
        </FormItem>
        <FormItem label="描述" required labelCol={{ span: 3 }}>
          <TextArea
            name="description"
            required
            autoSize={{
              minRows: 3,
              maxRows: 10,
            }}
            placeholder="description(optional)"
          />
        </FormItem>
        <FormItem label=" " labelCol={{ span: 3 }}>
          <Button type="primary" htmlType="submit" loading={isCreating}>
            创建团队
          </Button>
        </FormItem>
      </fetcher.Form>
    </>
  );
}
