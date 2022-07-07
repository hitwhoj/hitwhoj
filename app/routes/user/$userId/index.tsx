import { Descriptions } from "@arco-design/web-react";
import type { User } from "@prisma/client";
import type { LoaderFunction, MetaFunction } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { db } from "~/utils/server/db.server";
import { invariant } from "~/utils/invariant";
import { idScheme } from "~/utils/scheme";
import { checkUserReadPermission } from "~/utils/permission/user";

type LoaderData = {
  user: Pick<User, "id" | "bio" | "username" | "nickname" | "email">;
};

export const loader: LoaderFunction<LoaderData> = async ({
  request,
  params,
}) => {
  const userId = invariant(idScheme, params.userId, { status: 404 });
  await checkUserReadPermission(request, userId);

  const user = await db.user.findUnique({
    where: { id: userId },
    select: {
      id: true,
      bio: true,
      username: true,
      nickname: true,
      email: true,
    },
  });

  if (!user) {
    throw new Response("User not found", { status: 404 });
  }

  return { user };
};

export const meta: MetaFunction<LoaderData> = ({ data }) => ({
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
  ];

  return (
    <Descriptions
      column={1}
      title="用户资料"
      labelStyle={{ paddingRight: 36 }}
      data={data}
    />
  );
}

export { ErrorBoundary } from "~/src/ErrorBoundary";
export { CatchBoundary } from "~/src/CatchBoundary";
