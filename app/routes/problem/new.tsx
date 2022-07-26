import {
  Typography,
  Form as ArcoForm,
  Input,
  Button,
} from "@arco-design/web-react";
import type { ActionFunction, LoaderFunction } from "@remix-run/node";
import { redirect } from "@remix-run/node";
import { Form, useTransition } from "@remix-run/react";
import { invariant } from "~/utils/invariant";
import { permissionProblemCreate } from "~/utils/permission/problem";
import { titleScheme } from "~/utils/scheme";
import { db } from "~/utils/server/db.server";

const FormItem = ArcoForm.Item;

export const loader: LoaderFunction = async ({ request }) => {
  await permissionProblemCreate.ensure(request);

  return null;
};

export const action: ActionFunction<Response> = async ({ request }) => {
  await permissionProblemCreate.ensure(request);

  const form = await request.formData();

  const title = invariant(titleScheme, form.get("title"));

  const { id } = await db.problem.create({
    data: { title },
  });

  return redirect(`/problem/${id}`);
};

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
