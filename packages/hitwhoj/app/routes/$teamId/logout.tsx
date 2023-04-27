import type { ActionArgs, SerializeFrom } from "@remix-run/node";
import { json } from "@remix-run/node";
import { findRequestUser } from "~/utils/permission";
import { destroySession, getSession } from "~/utils/sessions";

export async function action({ request }: ActionArgs) {
  const self = await findRequestUser(request);

  if (!self.userId) {
    return json(
      { success: false as const, reason: "用户未登录" },
      { status: 401 }
    );
  }

  const session = getSession(request)!;

  return json(
    { success: true as const },
    { headers: { "Set-Cookie": await destroySession(session) } }
  );
}

export type ActionData = SerializeFrom<typeof action>;
