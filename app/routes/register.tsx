import type { ActionArgs } from "@remix-run/node";
import { redirect } from "@remix-run/node";
import { json } from "@remix-run/node";
import { db } from "~/utils/server/db.server";
import { invariant } from "~/utils/invariant";
import { passwordScheme, usernameScheme } from "~/utils/scheme";
import { commitSession } from "~/utils/sessions";
import { Form, useActionData, useTransition } from "@remix-run/react";
import { useEffect, useState } from "react";
import { passwordHash } from "~/utils/tools";

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
      // FIXME
      // Message.error("注册失败：" + data.reason);
    }
  }, [data]);

  const { state } = useTransition();
  const isSubmitting = state !== "idle";

  const [password, setPassword] = useState("");

  return (
    <>
      <h1>注册</h1>
      <p>网站内测中，随时删档，请不要上传任何违反法律法规的内容。</p>
      <Form method="post" className="form-control w-full max-w-xs">
        <label className="label">
          <span className="label-text">用户名 (请使用字母数字下划线)</span>
        </label>
        <input
          className="input input-bordered w-full max-w-xs"
          type="text"
          name="username"
          required
          disabled={isSubmitting}
        />
        <input type="hidden" name="password" value={passwordHash(password)} />
        <label className="label">
          <span className="label-text">密码</span>
        </label>
        <input
          className="input input-bordered w-full max-w-xs"
          type="password"
          value={password}
          onChange={(event) => setPassword(event.currentTarget.value)}
          required
          disabled={isSubmitting}
        />
        <button className="btn btn-primary mt-8" type="submit">
          注册
        </button>
      </Form>
    </>
  );
}

export { CatchBoundary } from "~/src/CatchBoundary";
export { ErrorBoundary } from "~/src/ErrorBoundary";
