import type {
  ActionFunction,
  LoaderFunction,
  MetaFunction,
} from "@remix-run/node";
import { redirect } from "@remix-run/node";
import { Form as RemixForm, useTransition } from "@remix-run/react";
import { db } from "~/utils/server/db.server";
import { invariant } from "~/utils/invariant";
import { descriptionScheme, titleScheme } from "~/utils/scheme";
import { findSessionUid } from "~/utils/sessions";
import { Button, Input, Form, Typography } from "@arco-design/web-react";
const TextArea = Input.TextArea;
const FormItem = Form.Item;

export const loader: LoaderFunction = async ({ request }) => {
  const self = await findSessionUid(request);

  if (!self) {
    throw redirect(`/login?redirect=${new URL(request.url).pathname}`);
  }

  return null;
};

export const action: ActionFunction<Response> = async ({ request }) => {
  const self = await findSessionUid(request);

  if (!self) {
    throw redirect(`/login?redirect=${new URL(request.url).pathname}`);
  }

  const form = await request.formData();

  const title = invariant(titleScheme, form.get("title"));
  const description = invariant(descriptionScheme, form.get("description"));

  const { id: problemSetId } = await db.problemSet.create({
    data: {
      title,
      description,
      creator: { connect: { id: self } },
    },
  });

  return redirect(`/problemset/${problemSetId}`);
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
      <RemixForm method="post" style={{ maxWidth: 600 }}>
        <FormItem label="标题" required layout="vertical">
          <Input name="title" disabled={loading} required />
        </FormItem>
        <FormItem label="描述" required layout="vertical">
          <TextArea name="description" required disabled={loading} />
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
