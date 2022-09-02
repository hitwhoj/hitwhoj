import type { ActionArgs, LoaderArgs, MetaFunction } from "@remix-run/node";
import { redirect } from "@remix-run/node";
import { db } from "~/utils/server/db.server";
import { invariant } from "~/utils/invariant";
import { teamNameScheme } from "~/utils/scheme";
import { TeamMemberRole } from "@prisma/client";
import {
  Button,
  Input,
  Form as ArcoForm,
  Typography,
  Form,
  Message,
} from "@arco-design/web-react";
import { findRequestUser } from "~/utils/permission";
import { useTransition } from "@remix-run/react";
import { useEffect } from "react";
import { Privileges } from "~/utils/permission/privilege";
import { Permissions } from "~/utils/permission/permission";
const FormItem = ArcoForm.Item;

export async function loader({ request }: LoaderArgs) {
  const self = await findRequestUser(request);
  await self.checkPrivilege(Privileges.PRIV_OPERATE);
  await self.checkPermission(Permissions.PERM_TEAM_CREATE);

  return null;
}

export const meta: MetaFunction = () => ({
  title: "新建团队 - HITwh OJ",
});

export async function action({ request }: ActionArgs) {
  const self = await findRequestUser(request);
  await self.checkPrivilege(Privileges.PRIV_OPERATE);
  await self.checkPermission(Permissions.PERM_TEAM_CREATE);

  const form = await request.formData();
  const name = invariant(teamNameScheme, form.get("name"));

  const { id: teamId } = await db.team.create({
    data: {
      name: name,
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
  const { state, type } = useTransition();
  const isActionSubmit = state === "submitting" && type === "actionSubmission";
  const isActionRedirect = state === "loading" && type === "actionReload";
  const isLoading = isActionSubmit || isActionRedirect;

  useEffect(() => {
    if (isActionRedirect) Message.success("创建成功");
  }, [isActionRedirect]);

  return (
    <Typography>
      <Typography.Title heading={3}>创建团队</Typography.Title>
      <Typography.Paragraph>创建一个新的团队！</Typography.Paragraph>
      <Form method="post">
        <FormItem label="名称" required layout="vertical" disabled={isLoading}>
          <Input type="text" name="name" placeholder="团队名称" required />
        </FormItem>
        <FormItem>
          <Button type="primary" htmlType="submit" loading={isLoading}>
            创建团队
          </Button>
        </FormItem>
      </Form>
    </Typography>
  );
}

export { CatchBoundary } from "~/src/CatchBoundary";
export { ErrorBoundary } from "~/src/ErrorBoundary";
