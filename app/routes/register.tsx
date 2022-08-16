import type { ActionFunction } from "@remix-run/node";
import { redirect } from "@remix-run/node";
import { json } from "@remix-run/node";
import { db } from "~/utils/server/db.server";
import { invariant } from "~/utils/invariant";
import { passwordScheme, usernameScheme } from "~/utils/scheme";
import { commitSession } from "~/utils/sessions";
import {
  Typography,
  Form as AcroForm,
  Button,
  Input,
  Message,
} from "@arco-design/web-react";
import { Form, useActionData, useTransition } from "@remix-run/react";
import { useEffect, useState } from "react";
import { passwordHash } from "~/utils/tools";

const FormItem = AcroForm.Item;

export type ActionData = {
  success: false;
  reason: string;
};

export const action: ActionFunction<Response> = async ({ request }) => {
  const form = await request.formData();

  const username = invariant(usernameScheme, form.get("username"));
  const password = invariant(passwordScheme, form.get("password"));

  const { id: userId } = await db.$transaction(async (db) => {
    const user = await db.user.findUnique({ where: { username } });
    if (user) {
      throw json({ success: false, reason: "Username already taken" }, 400);
    }

    const hashedPassword = passwordHash(password);
    return await db.user.create({
      data: { username, password: hashedPassword },
    });
  });

  return redirect("/", {
    headers: { "Set-Cookie": await commitSession(userId) },
  });
};

export default function Register() {
  const data = useActionData<ActionData>();

  useEffect(() => {
    if (data?.success === false) {
      Message.error("注册失败：" + data.reason);
    }
  }, [data]);

  const { state } = useTransition();
  const isSubmitting = state !== "idle";

  const [password, setPassword] = useState("");

  return (
    <Typography>
      <Typography.Title heading={3}>注册</Typography.Title>

      <Typography.Paragraph>
        网站内测中，随时删档，请不要上传任何违反法律法规的内容。
      </Typography.Paragraph>

      <Typography.Paragraph>
        <Form method="post">
          <FormItem
            layout="vertical"
            label="用户名 (请使用字母数字下划线)"
            required
          >
            <Input name="username" required disabled={isSubmitting} />
          </FormItem>

          <FormItem layout="vertical" label="密码" required>
            <input type="hidden" name="password" value={password} />
            <Input.Password
              required
              disabled={isSubmitting}
              onChange={(password) => setPassword(passwordHash(password))}
            />
          </FormItem>

          <FormItem layout="vertical">
            <Button type="primary" htmlType="submit" loading={isSubmitting}>
              注册
            </Button>
          </FormItem>
        </Form>
      </Typography.Paragraph>
    </Typography>
  );
}

export { CatchBoundary } from "~/src/CatchBoundary";
export { ErrorBoundary } from "~/src/ErrorBoundary";
