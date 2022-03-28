import { Button, Form, Input } from "@arco-design/web-react";
import { User } from "@prisma/client";
import {
  ActionFunction,
  json,
  LoaderFunction,
  redirect,
  useLoaderData,
  Form as RemixForm,
} from "remix";
import { z } from "zod";
import { db } from "~/utils/db.server";
import { invariant } from "~/utils/invariant";
import {
  bioScheme,
  emailScheme,
  emptyStringScheme,
  idScheme,
  nicknameScheme,
  usernameScheme,
} from "~/utils/scheme";
import { findSessionUid } from "~/utils/sessions";

type LoaderData = {
  user: Pick<User, "username" | "nickname" | "email" | "avatar" | "bio">;
};

export const loader: LoaderFunction = async ({ request, params }) => {
  const self = await findSessionUid(request);

  if (!self) {
    return redirect(`/login?redirect=${new URL(request.url).pathname}`);
  }

  const uid = invariant(idScheme.safeParse(params.uid), { status: 404 });

  const user = await db.user.findUnique({
    where: { uid },
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

  return json({ user });
};

export const action: ActionFunction = async ({ request, params }) => {
  const self = await findSessionUid(request);

  if (!self) {
    return redirect(`/login?redirect=${new URL(request.url).pathname}`);
  }

  const uid = invariant(idScheme.safeParse(params.uid), { status: 404 });

  // FIXME: 检查权限
  if (self !== uid) {
    throw new Response("Permission denied", { status: 403 });
  }

  const form = await request.formData();

  const username = invariant(usernameScheme.safeParse(form.get("username")));
  const nickname = invariant(nicknameScheme.safeParse(form.get("nickname")));
  const avatar = invariant(
    z
      .string()
      .url("Avatar must be a valid URL")
      .or(emptyStringScheme)
      .safeParse(form.get("avatar"))
  );
  const email = invariant(
    emailScheme.or(emptyStringScheme).safeParse(form.get("email"))
  );
  const bio = invariant(
    bioScheme.or(emptyStringScheme).safeParse(form.get("bio"))
  );

  const user = await db.user.findUnique({
    where: { username },
    select: { uid: true },
  });

  if (user && user.uid !== uid) {
    throw new Response("Username already taken", { status: 400 });
  }

  await db.user.update({
    where: { uid },
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
          required
        />
      </Form.Item>
      <Form.Item label="用户昵称">
        <Input
          name="nickname"
          defaultValue={user.nickname}
          style={{ width: 270 }}
        />
      </Form.Item>
      <Form.Item label="电子邮箱">
        <Input
          name="email"
          type="email"
          defaultValue={user.email}
          style={{ width: 270 }}
        />
      </Form.Item>
      <Form.Item label="头像地址">
        <Input
          name="avatar"
          defaultValue={user.avatar}
          placeholder="https://"
          style={{ width: 270 }}
        />
      </Form.Item>
      <Form.Item label="个人介绍">
        {/* TODO: 换成一个 Markdown 编辑器 */}
        <Input.TextArea
          name="bio"
          defaultValue={user.bio}
          style={{ width: 270 }}
        />
      </Form.Item>
      <Form.Item wrapperCol={{ offset: 5 }}>
        <Button type="primary" htmlType="submit">
          确认修改
        </Button>
      </Form.Item>
    </RemixForm>
  );
}
