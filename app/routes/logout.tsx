import type { ActionFunction } from "@remix-run/node";
import { json } from "@remix-run/node";
import { findRequestUser } from "~/utils/permission";
import { destroySession, getSession } from "~/utils/sessions";

export type ActionData = { success: true } | { success: false; reason: string };

export const action: ActionFunction<Response> = async ({ request }) => {
  const self = await findRequestUser(request);

  if (!self.userId) {
    return json({ success: false, reason: "用户未登录" }, { status: 401 });
  }

  const session = getSession(request)!;

  return json(
    { success: true },
    { headers: { "Set-Cookie": await destroySession(session) } }
  );
};
