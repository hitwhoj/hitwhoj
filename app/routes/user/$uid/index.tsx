import { Descriptions } from "@arco-design/web-react";
import type { User } from "@prisma/client";
import type { LoaderFunction, MetaFunction } from "@remix-run/node";
import { json } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { db } from "~/utils/db.server";
import { invariant } from "~/utils/invariant";
import { guaranteePermission, Permissions } from "~/utils/permission";
import { idScheme } from "~/utils/scheme";

type LoaderData = {
  user: Pick<
    User,
    "uid" | "bio" | "username" | "nickname" | "email" | "password"
  >;
};

export const loader: LoaderFunction = async ({ request, params }) => {
  const uid = invariant(idScheme.safeParse(params.uid), { status: 404 });

  await guaranteePermission(request, Permissions.User.Profile.View, { uid });

  const user = await db.user.findUnique({
    where: { uid },
    select: {
      uid: true,
      bio: true,
      username: true,
      nickname: true,
      email: true,
      password: true,
    },
  });

  if (!user) {
    throw new Response("User not found", { status: 404 });
  }

  return json({ user });
};

export const meta: MetaFunction = ({ data }: { data?: LoaderData }) => ({
  title: `用户: ${data?.user.nickname || data?.user.username} - HITwh OJ`,
  description: data?.user.bio,
});

export default function Profile() {
  const { user } = useLoaderData<LoaderData>();

  const data = [
    {
      label: "用户名",
      value: user.username,
    },
    {
      label: "用户昵称",
      value: user.nickname || "-",
    },
    {
      label: "电子邮箱",
      value: <a href={`mailto:${user.email}`}>{user.email}</a>,
    },
    {
      label: "密码",
      value: <code style={{ color: "red" }}>{user.password}</code>,
    },
  ];

  return (
    <Descriptions
      column={1}
      title="用户资料"
      data={data}
      labelStyle={{ paddingRight: 36 }}
    />
  );
}

export { ErrorBoundary } from "~/src/ErrorBoundary";
export { CatchBoundary } from "~/src/CatchBoundary";
