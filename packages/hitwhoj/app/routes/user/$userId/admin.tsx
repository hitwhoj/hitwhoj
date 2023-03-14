import { SystemUserRole } from "@prisma/client";
import type { ActionArgs, LoaderArgs } from "@remix-run/node";
import { json } from "@remix-run/node";
import { Form, useLoaderData, useTransition } from "@remix-run/react";
import {
  HiOutlineCheck,
  HiOutlineLockOpen,
  HiOutlineXCircle,
} from "react-icons/hi";
import { invariant } from "~/utils/invariant";
import { findRequestUser } from "~/utils/permission";
import { Permissions } from "~/utils/permission/permission";
import { Privileges } from "~/utils/permission/privilege";
import { idScheme, privilegeScheme, roleScheme } from "~/utils/scheme";
import { db } from "~/utils/server/db.server";

export async function loader({ request, params }: LoaderArgs) {
  const userId = invariant(idScheme, params.userId, { status: 404 });
  const self = await findRequestUser(request);
  await self.checkPrivilege(Privileges.PRIV_OPERATE);
  await self.checkPermission(
    self.userId === userId
      ? Permissions.PERM_VIEW_USER_PROFILE_SELF
      : Permissions.PERM_VIEW_USER_PROFILE
  );

  const user = await db.user.findUnique({
    where: { id: userId },
    select: {
      id: true,
      role: true,
      privilege: true,
    },
  });

  if (!user) {
    throw new Response("User not found", { status: 404 });
  }

  const [hasEditPrivPerm, hasEditRolePerm] = await self.hasPermission(
    Permissions.PERM_EDIT_USER_PRIVILEGE,
    Permissions.PERM_EDIT_USER_ROLE
  );

  return json({ user, hasEditPrivPerm, hasEditRolePerm });
}

enum ActionType {
  SetRole = "setRole",
  SetPrivilege = "setPrivilege",
}

export async function action({ request, params }: ActionArgs) {
  const userId = invariant(idScheme, params.userId, { status: 404 });

  const self = await findRequestUser(request);
  await self.checkPrivilege(Privileges.PRIV_OPERATE);

  const form = await request.formData();
  const _action = form.get("_action");

  switch (_action) {
    case ActionType.SetRole: {
      await self.checkPermission(Permissions.PERM_EDIT_USER_ROLE);
      const role = invariant(roleScheme, form.get("role"));

      await db.$transaction(async (db) => {
        const user = await db.user.findUnique({
          where: { id: userId },
          select: { id: true, role: true },
        });

        if (!user) {
          throw new Response("User not found", { status: 404 });
        }

        await db.user.update({
          where: { id: userId },
          data: { role },
        });
      });

      return null;
    }

    case ActionType.SetPrivilege: {
      await self.checkPermission(Permissions.PERM_EDIT_USER_PRIVILEGE);
      const privilege = invariant(privilegeScheme, form.get("privilege"));

      await db.$transaction(async (db) => {
        const user = await db.user.findUnique({
          where: { id: userId },
          select: { id: true, privilege: true },
        });

        if (!user) {
          throw new Response("User not found", { status: 404 });
        }

        await db.user.update({
          where: { id: userId },
          data: { privilege },
        });
      });

      return null;
    }
  }

  throw new Response("Invalid action", { status: 400 });
}

export default function UserManage() {
  const { user, hasEditPrivPerm, hasEditRolePerm } =
    useLoaderData<typeof loader>();
  const { state } = useTransition();
  const isUpdating = state !== "idle";

  const isUserBanned = !(user.privilege & Privileges.PRIV_OPERATE);

  return (
    <>
      {hasEditPrivPerm && (
        <>
          <h2>管理员操作</h2>
          <Form method="post">
            <input
              type="hidden"
              name="privilege"
              value={user.privilege ^ Privileges.PRIV_OPERATE}
            />
            <button
              className="btn btn-primary gap-2"
              type="submit"
              name="_action"
              value={ActionType.SetPrivilege}
              disabled={isUpdating}
            >
              {isUserBanned ? <HiOutlineLockOpen /> : <HiOutlineXCircle />}
              <span>{isUserBanned ? "取消封禁" : "封禁用户"}</span>
            </button>
          </Form>
        </>
      )}

      {hasEditRolePerm && (
        <>
          <h2>修改用户系统角色</h2>
          <Form method="post" className="flex gap-4">
            <select
              className="select select-bordered"
              name="role"
              defaultValue={user.role}
            >
              <option value={SystemUserRole.Root}>超级管理员</option>
              <option value={SystemUserRole.Admin}>系统管理员</option>
              <option value={SystemUserRole.User}>普通用户</option>
            </select>

            <button
              className="btn btn-primary gap-2"
              type="submit"
              name="_action"
              value={ActionType.SetRole}
              disabled={isUpdating}
            >
              <HiOutlineCheck />
              确认修改
            </button>
          </Form>
        </>
      )}

      {!hasEditPrivPerm && !hasEditRolePerm && <p>你是怎么进到这个页面的？</p>}
    </>
  );
}
