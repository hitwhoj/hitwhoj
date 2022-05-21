import { Button, Form, Input } from "@arco-design/web-react";
import type { User } from "@prisma/client";
import type {
  ActionFunction,
  LoaderFunction,
  MetaFunction,
} from "@remix-run/node";
import {
  Form as RemixForm,
  useLoaderData,
  useTransition,
} from "@remix-run/react";
import { z } from "zod";
import { db } from "~/utils/server/db.server";
import { invariant } from "~/utils/invariant";
import {
  bioScheme,
  emailScheme,
  emptyStringScheme,
  idScheme,
  nicknameScheme,
  usernameScheme,
} from "~/utils/scheme";
import { checkUserWritePermission } from "../__permission";

type LoaderData = {
  user: Pick<User, "username" | "nickname" | "email" | "avatar" | "bio">;
};

export const loader: LoaderFunction<LoaderData> = async ({
  request,
  params,
}) => {
  const userId = invariant(idScheme, params.userId, { status: 404 });

  await checkUserWritePermission(request, userId);

  const user = await db.user.findUnique({
    where: { id: userId },
    select: {
      username: true,
      nickname: true,
      avatar: true,
      email: true,
      bio: true,
    },
  });

  if (!user) {
    throw new Response("User not found", { status: 404 });
  }

  return { user };
};

export const meta: MetaFunction<LoaderData> = ({ data }) => ({
  title: `编辑用户: ${data?.user.nickname || data?.user.username} - HITwh OJ`,
});

export const action: ActionFunction = async ({ request, params }) => {
  const userId = invariant(idScheme, params.userId, { status: 404 });

  await checkUserWritePermission(request, userId);

  const form = await request.formData();

  const username = invariant(usernameScheme, form.get("username"));
  const nickname = invariant(
    nicknameScheme.or(emptyStringScheme),
    form.get("nickname")
  );
  // TODO: avatar should not be like this
  const avatar = invariant(
    z.string().url("Avatar must be a valid URL").or(emptyStringScheme),
    form.get("avatar")
  );
  const email = invariant(emailScheme.or(emptyStringScheme), form.get("email"));
  const bio = invariant(bioScheme.or(emptyStringScheme), form.get("bio"));

  const user = await db.user.findUnique({
    where: { username },
    select: { id: true },
  });

  if (user && user.id !== userId) {
    throw new Response("Username already taken", { status: 400 });
  }

  await db.user.update({
    where: { id: userId },
    data: {
      username,
      nickname,
      avatar,
      email,
      bio,
    },
  });

  return null;
};

export default function UserEdit() {
  const { user } = useLoaderData<LoaderData>();
  const { state } = useTransition();
  const loading = state === "submitting";

  return (
    <RemixForm
      method="post"
      className="arco-form arco-form-horizontal arco-form-size-default"
      style={{ maxWidth: 600 }}
    >
      <Form.Item label="用户名" required>
        <Input
          name="username"
          style={{ width: 270 }}
          defaultValue={user.username}
          disabled={loading}
          required
          pattern="[a-zA-Z0-9_]+"
        />
      </Form.Item>
      <Form.Item label="用户昵称">
        <Input
          name="nickname"
          defaultValue={user.nickname}
          disabled={loading}
          style={{ width: 270 }}
        />
      </Form.Item>
      <Form.Item label="电子邮箱">
        <Input
          name="email"
          type="email"
          defaultValue={user.email}
          disabled={loading}
          style={{ width: 270 }}
        />
      </Form.Item>
      <Form.Item label="头像地址">
        <Input
          name="avatar"
          defaultValue={user.avatar}
          placeholder="https://"
          disabled={loading}
          style={{ width: 270 }}
        />
      </Form.Item>
      <Form.Item label="个人介绍">
        <Input
          name="bio"
          defaultValue={user.bio}
          disabled={loading}
          style={{ width: 270 }}
        />
      </Form.Item>
      <Form.Item wrapperCol={{ offset: 5 }}>
        <Button type="primary" htmlType="submit" loading={loading}>
          确认修改
        </Button>
      </Form.Item>
    </RemixForm>
  );
}

export { ErrorBoundary } from "~/src/ErrorBoundary";
export { CatchBoundary } from "~/src/CatchBoundary";
