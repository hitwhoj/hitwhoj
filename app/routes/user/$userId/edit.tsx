import {
  Button,
  Form as ArcoForm,
  Input,
  Typography,
} from "@arco-design/web-react";
import type { User } from "@prisma/client";
import type {
  ActionFunction,
  LoaderFunction,
  MetaFunction,
} from "@remix-run/node";
import { Form, useLoaderData, useTransition } from "@remix-run/react";
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
import { permissionUserProfileWrite } from "~/utils/permission/user";

type LoaderData = {
  user: Pick<User, "username" | "nickname" | "email" | "avatar" | "bio">;
};

export const loader: LoaderFunction<LoaderData> = async ({
  request,
  params,
}) => {
  const userId = invariant(idScheme, params.userId, { status: 404 });
  await permissionUserProfileWrite.ensure(request, userId);

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
  await permissionUserProfileWrite.ensure(request, userId);

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

const FormItem = ArcoForm.Item;

export default function UserEdit() {
  const { user } = useLoaderData<LoaderData>();
  const { state } = useTransition();
  const loading = state === "submitting";

  return (
    <Typography>
      <Typography.Title heading={4}>编辑个人资料</Typography.Title>
      <Typography.Paragraph>
        <Form method="post">
          <FormItem label="用户名 (字母数字下划线)" required layout="vertical">
            <Input
              name="username"
              defaultValue={user.username}
              disabled={loading}
              required
              pattern="[a-zA-Z0-9_]+"
            />
          </FormItem>
          <FormItem label="用户昵称" layout="vertical">
            <Input
              name="nickname"
              defaultValue={user.nickname}
              disabled={loading}
            />
          </FormItem>
          <FormItem label="电子邮箱" layout="vertical">
            <Input
              name="email"
              type="email"
              defaultValue={user.email}
              disabled={loading}
            />
          </FormItem>
          <FormItem label="头像地址" layout="vertical">
            <Input
              name="avatar"
              defaultValue={user.avatar}
              placeholder="https://"
              disabled={loading}
            />
          </FormItem>
          <FormItem label="个人介绍" layout="vertical">
            <Input name="bio" defaultValue={user.bio} disabled={loading} />
          </FormItem>
          <FormItem layout="vertical">
            <Button type="primary" htmlType="submit" loading={loading}>
              确认修改
            </Button>
          </FormItem>
        </Form>
      </Typography.Paragraph>
    </Typography>
  );
}

export { ErrorBoundary } from "~/src/ErrorBoundary";
export { CatchBoundary } from "~/src/CatchBoundary";
