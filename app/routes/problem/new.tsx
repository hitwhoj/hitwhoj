import {
  Typography,
  Form as ArcoForm,
  Input,
  Button,
} from "@arco-design/web-react";
import type { ActionArgs, LoaderArgs } from "@remix-run/node";
import { redirect } from "@remix-run/node";
import { Form, useTransition } from "@remix-run/react";
import { invariant } from "~/utils/invariant";
import { findRequestUser } from "~/utils/permission";
import { Permissions } from "~/utils/permission/permission";
import { Privileges } from "~/utils/permission/privilege";
import { titleScheme } from "~/utils/scheme";
import { db } from "~/utils/server/db.server";

const FormItem = ArcoForm.Item;

export async function loader({ request }: LoaderArgs) {
  const self = await findRequestUser(request);
  await self.checkPrivilege(Privileges.PRIV_OPERATE);
  await self.team(null).checkPermission(Permissions.PERM_CREATE_PROBLEM);

  return null;
}

export async function action({ request }: ActionArgs) {
  const self = await findRequestUser(request);
  await self.checkPrivilege(Privileges.PRIV_OPERATE);
  await self.team(null).checkPermission(Permissions.PERM_CREATE_PROBLEM);

  const form = await request.formData();

  const title = invariant(titleScheme, form.get("title"));

  const { id } = await db.problem.create({
    data: { title },
  });

  return redirect(`/problem/${id}/edit`);
}

export default function ProblemNew() {
  const { state } = useTransition();
  const isUpdating = state !== "idle";

  return (
    <Typography>
      <Typography.Title heading={3}>新建题目</Typography.Title>

      <Typography.Paragraph>
        这个页面非常简洁，因为只有管理员能看到，所以没有任何额外的功能。
      </Typography.Paragraph>

      <Typography.Paragraph>
        <Form method="post">
          <FormItem layout="vertical" label="题目名称" required>
            <Input name="title" required disabled={isUpdating} />
          </FormItem>
          <FormItem layout="vertical">
            <Button type="primary" htmlType="submit" loading={isUpdating}>
              创建题目
            </Button>
          </FormItem>
        </Form>
      </Typography.Paragraph>
    </Typography>
  );
}

export { ErrorBoundary } from "~/src/ErrorBoundary";
export { CatchBoundary } from "~/src/CatchBoundary";
