import type { ActionArgs, SerializeFrom } from "@remix-run/node";
import { json } from "@remix-run/node";
import { db } from "~/utils/server/db.server";
import { invariant } from "~/utils/invariant";
import { passwordScheme, usernameScheme } from "~/utils/scheme";
import { commitSession } from "~/utils/sessions";
import { passwordHash } from "~/utils/tools";
import { User } from "~/utils/permission/role/user";
import { Privileges } from "~/utils/permission/privilege";

export async function action({ request }: ActionArgs) {
  const form = await request.formData();

  const username = invariant(usernameScheme, form.get("username"));
  const password = invariant(passwordScheme, form.get("password"));

  const user = await db.user.findUnique({
    where: { username },
    select: { password: true, id: true },
  });

  if (!user) {
    return json({ success: false as const, reason: "用户不存在" }, 400);
  }

  if (user.password !== passwordHash(password)) {
    return json({ success: false as const, reason: "密码错误" }, 400);
  }

  const self = new User(user.id);
  await self.checkPrivilege(Privileges.PRIV_LOGIN);

  return json(
    { success: true as const },
    { headers: { "Set-Cookie": await commitSession(user.id) } }
  );
}

export type ActionData = SerializeFrom<typeof action>;
