import {
  ActionFunction,
  Form as RemixForm,
  LoaderFunction,
  MetaFunction,
  redirect,
  useTransition,
} from "remix";
import { db } from "~/utils/db.server";
import { invariant } from "~/utils/invariant";
import { descriptionScheme, titleScheme } from "~/utils/scheme";
import { findSessionUid } from "~/utils/sessions";
import { Button, Input, Form } from "@arco-design/web-react";
const TextArea = Input.TextArea;
const FormItem = Form.Item;

export const loader: LoaderFunction = async ({ request }) => {
  const uid = await findSessionUid(request);

  if (!uid) {
    return redirect(`/login?redirect=${new URL(request.url).pathname}`);
  }

  return null;
};

export const action: ActionFunction = async ({ request }) => {
  const uid = await findSessionUid(request);

  if (!uid) {
    return redirect(`/login?redirect=${new URL(request.url).pathname}`);
  }

  const form = await request.formData();

  const title = invariant(titleScheme.safeParse(form.get("title")));
  const description = invariant(
    descriptionScheme.safeParse(form.get("description"))
  );

  const { sid } = await db.problemSet.create({
    data: {
      title,
      description,
      user: { connect: { uid } },
    },
  });

  return redirect(`/problemset/${sid}`);
};

export const meta: MetaFunction = () => ({
  title: "创建题单 - HITwh OJ",
});

export default function ProblemSetNew() {
  const { state } = useTransition();
  const loading = state !== "idle";

  return (
    <>
      <h1>创建题单</h1>
      <RemixForm method="post" style={{ maxWidth: 600 }}>
        <FormItem label="标题" required labelCol={{ span: 3 }}>
          <Input
            name="title"
            style={{ width: "100%" }}
            disabled={loading}
            required
          />
        </FormItem>
        <FormItem label="描述" required labelCol={{ span: 3 }}>
          <TextArea
            name="description"
            required
            autoSize={{
              minRows: 10,
              maxRows: 10,
            }}
          />
        </FormItem>
        <FormItem label=" " labelCol={{ span: 3 }}>
          <Button type="primary" htmlType="submit" loading={loading}>
            创建题单
          </Button>
        </FormItem>
      </RemixForm>
    </>
  );
}

export { ErrorBoundary } from "~/src/ErrorBoundary";
export { CatchBoundary } from "~/src/CatchBoundary";
