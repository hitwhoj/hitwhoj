import { Descriptions } from "@arco-design/web-react";
import type { LoaderArgs, MetaFunction } from "@remix-run/node";
import { json } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { db } from "~/utils/server/db.server";
import { invariant } from "~/utils/invariant";
import { idScheme } from "~/utils/scheme";
import { findRequestUser } from "~/utils/permission";
import { Permissions } from "~/utils/permission/permission";

export async function loader({ request, params }: LoaderArgs) {
  const userId = invariant(idScheme, params.userId, { status: 404 });
  const self = await findRequestUser(request);
  await self.checkPermission(
    self.userId === userId
      ? Permissions.PERM_VIEW_USER_PROFILE_SELF
      : Permissions.PERM_VIEW_USER_PROFILE
  );

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

  return json({ user });
}

export const meta: MetaFunction<typeof loader> = ({ data }) => ({
  title: `用户: ${data?.user.nickname || data?.user.username} - HITwh OJ`,
  description: data?.user.bio,
});

export default function Profile() {
  const { user } = useLoaderData<typeof loader>();

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
