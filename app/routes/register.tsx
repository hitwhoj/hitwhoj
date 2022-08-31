import type { ActionArgs } from "@remix-run/node";
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

// TODO 完善注册功能
export async function action({ request }: ActionArgs) {
  const form = await request.formData();

  const username = invariant(usernameScheme, form.get("username"));
  const password = invariant(passwordScheme, form.get("password"));

  const result = await db.$transaction(async (db) => {
    if (await db.user.findUnique({ where: { username } })) {
      return { success: false as const, reason: "用户已存在" };
    }

    const hashedPassword = passwordHash(password);
    return {
      success: true as const,
      user: await db.user.create({
        data: { username, password: hashedPassword },
      }),
    };
  });

  if (!result.success) {
    return json(result, 400);
  }

  return redirect("/", {
    headers: { "Set-Cookie": await commitSession(result.user.id) },
  });
}

export default function Register() {
  const data = useActionData<typeof action>();

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
