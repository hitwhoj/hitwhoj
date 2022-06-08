import type { ActionFunction } from "@remix-run/node";
import { json } from "@remix-run/node";
import { db } from "~/utils/server/db.server";
import { invariant } from "~/utils/invariant";
import { passwordScheme, usernameScheme } from "~/utils/scheme";
import { commitSession } from "~/utils/sessions";

export type LoginActionData =
  | {
      success: true;
    }
  | {
      success: false;
      reason: string;
    };

export const action: ActionFunction<Response> = async ({ request }) => {
  const form = await request.formData();

  const username = invariant(usernameScheme, form.get("username"));
  const password = invariant(passwordScheme, form.get("password"));

  const user = await db.user.findUnique({
    where: { username },
    select: { password: true, id: true },
  });

  if (!user) {
    return json({ success: false, reason: "用户不存在" }, { status: 400 });
  }

  if (user.password !== password) {
    return json({ success: false, reason: "密码错误" }, { status: 400 });
  }

  return json(
    { success: true },
    { headers: { "Set-Cookie": await commitSession(user.id) } }
  );
};
