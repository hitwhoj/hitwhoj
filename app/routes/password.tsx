import type { ActionArgs, LoaderArgs, MetaFunction } from "@remix-run/node";
import { json } from "@remix-run/node";
import { Form, useLoaderData } from "@remix-run/react";
import { passwordHash } from "~/utils/tools";
import { useSignalTransition } from "~/utils/hooks";
import { useToasts } from "~/utils/toast";
import { useEffect } from "react";
import { useSignal } from "@preact/signals-react";
import { invariant } from "~/utils/invariant";
import { passwordScheme, usernameScheme } from "~/utils/scheme";
import { db } from "~/utils/server/db.server";

export async function loader({ request }: LoaderArgs) {
  const url = new URL(request.url);
  const username = url.searchParams.get("username");

  if (!username) {
    return json({ error: "No reset username provided" }, 400);
  }

  return json({ username });
}
export const meta: MetaFunction = () => ({
  title: "输入你的新密码 - HITwh OJ",
});

export async function action({ request }: ActionArgs) {
  const form = await request.formData();
  const username = invariant(usernameScheme, form.get("username"));
  const password = invariant(passwordScheme, form.get("password"));
  try {
    // 更新用户的密码
    await db.user.update({
      where: { username: username },
      data: {
        password: passwordHash(password as string),
      },
    });
    return json({ message: "Password updated successfully" });
  } catch (error) {
    console.error("Error updating password:", error);
    return json({ error: "Failed to update password" }, { status: 500 });
  }
}

export default function UpdatePassword() {
  const transition = useSignalTransition();

  const Toasts = useToasts();

  useEffect(() => {
    if (transition.actionSuccess) {
      Toasts.success("重设成功");
    }
  }, [transition.actionSuccess]);

  const password = useSignal("");

  return (
    <>
      <h1>重设密码</h1>
      <Form
        method="post"
        className="not-prose form-control w-full max-w-xs gap-4"
      >
        <input type="hidden" name="username" value={useLoaderData().username} />
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
          />
        </div>
        <div className="form-control">
          <button className="btn btn-primary" type="submit">
            重设密码
          </button>
        </div>
      </Form>
    </>
  );
}
