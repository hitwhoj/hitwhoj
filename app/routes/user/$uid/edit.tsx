import { Button, Form, Input } from "@arco-design/web-react";
import { User } from "@prisma/client";
import {
  ActionFunction,
  json,
  LoaderFunction,
  useLoaderData,
  Form as RemixForm,
  useTransition,
  MetaFunction,
} from "remix";
import { z } from "zod";
import { db } from "~/utils/db.server";
import { invariant } from "~/utils/invariant";
import { guaranteePermission, Permissions } from "~/utils/permission";
import {
  bioScheme,
  emailScheme,
  emptyStringScheme,
  idScheme,
  nicknameScheme,
  usernameScheme,
} from "~/utils/scheme";

type LoaderData = {
  user: Pick<User, "username" | "nickname" | "email" | "avatar" | "bio">;
};

export const loader: LoaderFunction = async ({ request, params }) => {
  const uid = invariant(idScheme.safeParse(params.uid), { status: 404 });

  await guaranteePermission(request, Permissions.User.Profile.View, { uid });

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

export const meta: MetaFunction = ({ data }: { data?: LoaderData }) => ({
  title: `编辑用户: ${data?.user.nickname || data?.user.username} - HITwh OJ`,
});

export const action: ActionFunction = async ({ request, params }) => {
  const uid = invariant(idScheme.safeParse(params.uid), { status: 404 });

  await guaranteePermission(request, Permissions.User.Profile.Update, { uid });

  const form = await request.formData();

  const username = invariant(usernameScheme.safeParse(form.get("username")));
  const nickname = invariant(
    nicknameScheme.or(emptyStringScheme).safeParse(form.get("nickname"))
  );
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
