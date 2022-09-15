import type { ActionArgs } from "@remix-run/node";
import { redirect } from "@remix-run/node";
import { json } from "@remix-run/node";
import { db } from "~/utils/server/db.server";
import { invariant } from "~/utils/invariant";
import { passwordScheme, usernameScheme } from "~/utils/scheme";
import { commitSession } from "~/utils/sessions";
import { Form, Link, useActionData, useTransition } from "@remix-run/react";
import { useContext, useEffect, useState } from "react";
import { passwordHash } from "~/utils/tools";
import { ToastContext } from "~/utils/context/toast";

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

  const { state, type } = useTransition();
  const isActionSubmit = state === "submitting" && type == "actionSubmission";
  const isActionReload = state === "loading" && type === "actionReload";
  const isActionRedirect = state === "loading" && type === "actionRedirect";
  const isLoading = isActionSubmit || isActionReload || isActionRedirect;

  const Toasts = useContext(ToastContext);

  useEffect(() => {
    if (isActionRedirect) {
      Toasts.success("登录成功");
    }
  }, [isActionRedirect]);

  const [password, setPassword] = useState("");

  return (
    <>
      <h1>注册</h1>
      <p>网站内测中，随时删档，请不要上传任何违反法律法规的内容。</p>

      <Form
        method="post"
        className="form-control w-full max-w-xs gap-4 not-prose"
      >
        <div className="form-control">
          <label className="label">
            <span className="label-text">用户名 (请使用字母数字下划线)</span>
          </label>
          <input
            className="input input-bordered w-full max-w-xs"
            type="text"
            name="username"
            required
            disabled={isLoading}
            pattern="\w+"
          />
        </div>

        <div className="form-control">
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
            disabled={isLoading}
          />
        </div>

        <div className="form-control">
          <button className="btn btn-primary" type="submit">
            注册
          </button>
          <label className="label">
            <Link className="link link-hover label-text-alt" to="/login">
              登录
            </Link>
          </label>
        </div>
      </Form>

      {data?.reason && (
        <p className="alert alert-error shadow-lg">{data.reason}</p>
      )}
    </>
  );
}

export { CatchBoundary } from "~/src/CatchBoundary";
export { ErrorBoundary } from "~/src/ErrorBoundary";
