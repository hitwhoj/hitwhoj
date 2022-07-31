import { Button, Typography } from "@arco-design/web-react";
import {
  IconClose,
  IconThumbDown,
  IconThumbUp,
} from "@arco-design/web-react/icon";
import type { User } from "@prisma/client";
import type { ActionFunction, LoaderFunction } from "@remix-run/node";
import { Form, useLoaderData, useTransition } from "@remix-run/react";
import { useContext } from "react";
import { UserInfoContext } from "~/utils/context/user";
import { invariant } from "~/utils/invariant";
import { assertPermission, isAdmin } from "~/utils/permission";
import { permissionAdmin, permissionSuperUser } from "~/utils/permission/user";
import { idScheme } from "~/utils/scheme";
import { db } from "~/utils/server/db.server";

type LoaderData = {
  user: Pick<User, "id" | "role">;
};

export const loader: LoaderFunction<LoaderData> = async ({
  request,
  params,
}) => {
  const userId = invariant(idScheme, params.userId, { status: 404 });
  await assertPermission(permissionAdmin, request);

  const user = await db.user.findUnique({
    where: { id: userId },
    select: {
      id: true,
      role: true,
    },
  });

  if (!user) {
    throw new Response("User not found", { status: 404 });
  }

  return { user };
};

enum ActionType {
  SetAdmin = "setAdmin",
  UnsetAdmin = "unsetAdmin",
  BanUser = "banUser",
  UnbanUser = "unbanUser",
}

export const action: ActionFunction = async ({ request, params }) => {
  const userId = invariant(idScheme, params.userId, { status: 404 });

  const form = await request.formData();
  const _action = form.get("_action");

  switch (_action) {
    case ActionType.SetAdmin:
    case ActionType.UnsetAdmin: {
      await assertPermission(permissionSuperUser, request);

      await db.$transaction(async (db) => {
        const user = await db.user.findUnique({
          where: { id: userId },
          select: { id: true, role: true },
        });

        if (!user) {
          throw new Response("User not found", { status: 404 });
        }

        if (user.role === "Su") {
          throw new Response("Cannot change super user's role", {
            status: 400,
          });
        }

        await db.user.update({
          where: { id: userId },
          data: { role: _action === ActionType.SetAdmin ? "Admin" : "User" },
        });
      });

      return null;
    }

    case ActionType.BanUser:
    case ActionType.UnbanUser: {
      await assertPermission(permissionAdmin, request);

      await db.$transaction(async (db) => {
        const user = await db.user.findUnique({
          where: { id: userId },
          select: { id: true, role: true },
        });

        if (!user) {
          throw new Response("User not found", { status: 404 });
        }

        if (isAdmin(user.role)) {
          throw new Response("Cannot ban admin", { status: 400 });
        }

        await db.user.update({
          where: { id: userId },
          data: { role: _action === ActionType.BanUser ? "Banned" : "User" },
        });
      });

      return null;
    }
  }

  return null;
};

export default function UserManage() {
  const { user } = useLoaderData<LoaderData>();
  const { state } = useTransition();
  const isUpdating = state !== "idle";

  const self = useContext(UserInfoContext);

  return (
    <Typography>
      <Typography.Title heading={4}>
        因为是管理员所以可以滥权！
      </Typography.Title>
      <Typography.Paragraph>
        <Form method="post">
          {user.role === "Banned" ? (
            <Button
              icon={<IconClose />}
              htmlType="submit"
              name="_action"
              value={ActionType.UnbanUser}
              loading={isUpdating}
            >
              取消封禁
            </Button>
          ) : user.role === "User" ? (
            <Button
              icon={<IconThumbDown />}
              htmlType="submit"
              name="_action"
              value={ActionType.BanUser}
              loading={isUpdating}
            >
              封禁用户
            </Button>
          ) : (
            <Typography.Text>但是你什么都做不到</Typography.Text>
          )}
        </Form>
      </Typography.Paragraph>

      {self && self.role === "Su" && (
        <>
          <Typography.Title heading={4}>
            因为是超级管理员所以可以更加滥权！
          </Typography.Title>
          <Typography.Paragraph>
            <Form method="post">
              {user.role === "Admin" ? (
                <Button
                  icon={<IconClose />}
                  htmlType="submit"
                  name="_action"
                  value={ActionType.UnsetAdmin}
                  loading={isUpdating}
                >
                  取消管理员
                </Button>
              ) : (
                <Button
                  icon={<IconThumbUp />}
                  htmlType="submit"
                  name="_action"
                  value={ActionType.SetAdmin}
                  loading={isUpdating}
                >
                  设置为管理员
                </Button>
              )}
            </Form>
          </Typography.Paragraph>
        </>
      )}
    </Typography>
  );
}
