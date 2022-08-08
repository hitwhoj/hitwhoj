import { Button, Select, Space, Typography } from "@arco-design/web-react";
import {
  IconCheck,
  IconClose,
  IconThumbDown,
} from "@arco-design/web-react/icon";
import type { ActionArgs, LoaderArgs } from "@remix-run/node";
import { json } from "@remix-run/node";
import { Form, useLoaderData, useTransition } from "@remix-run/react";
import { useState } from "react";
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

      return;
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

      return;
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
  const [role, setRole] = useState(user.role);

  return (
    <Typography>
      {hasEditPrivPerm && (
        <>
          <Typography.Title heading={4}>
            因为是管理员所以可以滥权！
          </Typography.Title>
          <Typography.Paragraph>
            <Form method="post">
              <input
                type="hidden"
                name="privilege"
                value={user.privilege ^ Privileges.PRIV_OPERATE}
              />
              <Button
                icon={isUserBanned ? <IconClose /> : <IconThumbDown />}
                type="primary"
                status="danger"
                htmlType="submit"
                name="_action"
                value={ActionType.SetPrivilege}
                loading={isUpdating}
              >
                {isUserBanned ? "取消封禁" : "封禁用户"}
              </Button>
            </Form>
          </Typography.Paragraph>
        </>
      )}

      {hasEditRolePerm && (
        <>
          <Typography.Title heading={4}>
            因为是超级管理员所以可以更加滥权！
          </Typography.Title>
          <Typography.Paragraph>
            <Form method="post">
              <input type="hidden" name="role" value={role} />
              <Space>
                <Select onChange={(value) => setRole(value)} value={role}>
                  <Select.Option value="Root">超级管理员</Select.Option>
                  <Select.Option value="Admin">系统管理员</Select.Option>
                  <Select.Option value="User">普通用户</Select.Option>
                </Select>

                <Button
                  icon={<IconCheck />}
                  type="primary"
                  status="danger"
                  htmlType="submit"
                  name="_action"
                  value={ActionType.SetRole}
                  loading={isUpdating}
                >
                  确认修改
                </Button>
              </Space>
            </Form>
          </Typography.Paragraph>
        </>
      )}

      {!hasEditPrivPerm && !hasEditRolePerm && (
        <Typography.Paragraph>你什么也做不到</Typography.Paragraph>
      )}
    </Typography>
  );
}
