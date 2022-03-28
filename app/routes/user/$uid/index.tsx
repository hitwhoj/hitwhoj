import { Descriptions } from "@arco-design/web-react";
import { User } from "@prisma/client";
import { json, LoaderFunction, useLoaderData } from "remix";
import { db } from "~/utils/db.server";
import { invariant } from "~/utils/invariant";
import { idScheme } from "~/utils/scheme";

type LoaderData = {
  user: Pick<User, "uid" | "username" | "nickname" | "email" | "password">;
};

export const loader: LoaderFunction = async ({ params }) => {
  const uid = invariant(idScheme.safeParse(params.uid), { status: 404 });

  const user = await db.user.findUnique({
    where: { uid },
    select: {
      uid: true,
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
