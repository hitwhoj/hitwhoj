import type {
  ActionFunction,
  LoaderFunction,
  MetaFunction,
} from "@remix-run/node";
import { redirect } from "@remix-run/node";
import { Form as RemixForm, useTransition } from "@remix-run/react";
import { db } from "~/utils/server/db.server";
import { invariant } from "~/utils/invariant";
import { titleScheme } from "~/utils/scheme";
import { Button, Input, Form, Typography } from "@arco-design/web-react";
import { permissionProblemSetCreate } from "~/utils/permission/problemset";

const FormItem = Form.Item;

export const loader: LoaderFunction = async ({ request }) => {
  await permissionProblemSetCreate.ensure(request);

  return null;
};

export const action: ActionFunction<Response> = async ({ request }) => {
  await permissionProblemSetCreate.ensure(request);

  const form = await request.formData();
  const title = invariant(titleScheme, form.get("title"));

  const { id: problemSetId } = await db.problemSet.create({
    data: {
      title,
    },
  });

  return redirect(`/problemset/${problemSetId}/edit`);
};

export const meta: MetaFunction = () => ({
  title: "创建题单 - HITwh OJ",
});

export default function ProblemSetNew() {
  const { state } = useTransition();
  const loading = state !== "idle";

  return (
    <Typography>
      <Typography.Title heading={3}>创建题单</Typography.Title>
      <RemixForm method="post" style={{ maxWidth: 300 }}>
        <FormItem label="标题" required layout="vertical">
          <Input name="title" disabled={loading} required />
        </FormItem>
        <FormItem>
          <Button type="primary" htmlType="submit" loading={loading}>
            创建题单
          </Button>
        </FormItem>
      </RemixForm>
    </Typography>
  );
}

export { ErrorBoundary } from "~/src/ErrorBoundary";
export { CatchBoundary } from "~/src/CatchBoundary";
