import type { ActionFunction } from "@remix-run/node";
import { json } from "@remix-run/node";
import { db } from "~/utils/server/db.server";
import { invariant } from "~/utils/invariant";
import { passwordScheme, usernameScheme } from "~/utils/scheme";
import { commitSession } from "~/utils/sessions";

export type RegisterActionData =
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

  const oldUser = await db.user.findUnique({ where: { username } });

  if (oldUser) {
    return json(
      { success: false, reason: "用户名已经被注册" },
      { status: 400 }
    );
  }

  const { id: userId } = await db.user.create({ data: { username, password } });

  return json(
    { success: true },
    { headers: { "Set-Cookie": await commitSession(userId) } }
  );
};

export default function Register() {
  return <div>TODO</div>;
}

export { CatchBoundary } from "~/src/CatchBoundary";
export { ErrorBoundary } from "~/src/ErrorBoundary";
