import type { ActionArgs } from "@remix-run/node";
import { redirect } from "@remix-run/node";
import { json } from "@remix-run/node";
import { db } from "~/utils/server/db.server";
import { invariant } from "~/utils/invariant";
import { passwordScheme, usernameScheme } from "~/utils/scheme";
import { commitSession } from "~/utils/sessions";
import { passwordHash } from "~/utils/tools";
import { User } from "~/utils/permission/role/user";
import { Privileges } from "~/utils/permission/privilege";
import { Form, Link, useActionData } from "@remix-run/react";
import { useSignal, useSignalEffect } from "@preact/signals-react";
import { useSignalTransition } from "~/utils/hooks";
import { useToasts } from "~/utils/toast";

export async function action({ request }: ActionArgs) {
  const form = await request.formData();

  const username = invariant(usernameScheme, form.get("username"));
  const password = invariant(passwordScheme, form.get("password"));

  const user = await db.user.findUnique({
    where: { username },
    select: { password: true, id: true },
  });

  if (!user) {
    return json({ reason: "用户不存在" }, 400);
  }

  if (user.password !== passwordHash(password)) {
    return json({ reason: "密码错误" }, 400);
  }

  const self = new User(user.id);
  await self.checkPrivilege(Privileges.PRIV_LOGIN);

  return redirect("/", {
    headers: { "Set-Cookie": await commitSession(user.id) },
  });
}

export default function Register() {
  const data = useActionData<typeof action>();

  const { loading, success } = useSignalTransition();

  const Toasts = useToasts();

  useSignalEffect(() => {
    if (success.value) {
      Toasts.success("登录成功");
    }
  });

  const password = useSignal("");

  return (
    <>
      <h1>登录</h1>
      <p>网站内测中，随时删档，请不要上传任何违反法律法规的内容。</p>

      <Form
        method="post"
        className="not-prose form-control w-full max-w-xs gap-4"
      >
        <div className="form-control">
          <label className="label">
            <span className="label-text">用户名</span>
          </label>
          <input
            className="input input-bordered w-full max-w-xs"
            type="text"
            name="username"
            required
            disabled={loading.value}
            pattern="\w+"
          />
        </div>

        <div className="form-control">
          <input
            type="hidden"
            name="password"
            value={passwordHash(password.value)}
          />
          <label className="label">
            <span className="label-text">密码</span>
          </label>
          <input
            className="input input-bordered w-full max-w-xs"
            type="password"
            value={password.value}
            onChange={(event) => (password.value = event.currentTarget.value)}
            required
            disabled={loading.value}
          />
        </div>

        <div className="form-control">
          <button className="btn btn-primary" type="submit">
            登录
          </button>
          <label className="label">
            <Link className="link link-hover label-text-alt" to="/register">
              注册
            </Link>
            <Link className="link link-hover label-text-alt" to="/reset">
              忘记密码
            </Link>
          </label>
        </div>

        {data?.reason && (
          <p className="alert alert-error shadow-lg">{data.reason}</p>
        )}
      </Form>
    </>
  );
}
