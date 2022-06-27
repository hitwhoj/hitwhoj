import type { ActionFunction } from "@remix-run/node";
import { json } from "@remix-run/node";
import { destroySession, findSession } from "~/utils/sessions";

export type ActionData =
  | {
      success: true;
    }
  | {
      success: false;
      reason: string;
    };

export const action: ActionFunction<Response> = async ({ request }) => {
  const session = await findSession(request);

  if (!session) {
    return json({ success: false, reason: "用户未登录" }, { status: 401 });
  }

  return json(
    { success: true },
    {
      headers: {
        "Set-Cookie": await destroySession(session),
      },
    }
  );
};
