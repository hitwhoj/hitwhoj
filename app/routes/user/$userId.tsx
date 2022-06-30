import { Space, Typography } from "@arco-design/web-react";
import type { User } from "@prisma/client";
import type { LoaderFunction, MetaFunction } from "@remix-run/node";
import { Outlet, useLoaderData } from "@remix-run/react";
import { useContext } from "react";
import { UserInfoContext } from "~/utils/context/user";
import { db } from "~/utils/server/db.server";
import { invariant } from "~/utils/invariant";
import { idScheme } from "~/utils/scheme";
import { checkUserReadPermission } from "~/utils/permission/user";
import { Navigator } from "~/src/Navigator";
import { isAdmin, isUser } from "~/utils/permission";
import { UserAvatar } from "~/src/user/UserAvatar";
import { AvatarBadge } from "~/src/AvatarBadge";

type LoaderData = {
  user: Pick<User, "nickname" | "username" | "avatar" | "bio" | "id" | "role">;
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
      nickname: true,
      username: true,
      avatar: true,
      bio: true,
      id: true,
      role: true,
    },
  });

  if (!user) {
    throw new Response("User not found", { status: 404 });
  }

  return { user };
};

export const meta: MetaFunction<LoaderData> = ({ data }) => ({
  title: `用户: ${data?.user.nickname || data?.user.username} - HITwh OJ`,
});

export default function UserProfile() {
  const { user } = useLoaderData<LoaderData>();
  const self = useContext(UserInfoContext);

  return (
    <Typography>
      <Typography.Paragraph>
        <Space size="large" align="start">
          {isAdmin(user.role) ? (
            <AvatarBadge icon="大" color="magenta">
              <UserAvatar user={user} size={60} />
            </AvatarBadge>
          ) : (
            <UserAvatar user={user} size={60} />
          )}
          <div style={{ display: "flex", flexDirection: "column" }}>
            <span style={{ fontSize: "2em" }}>
              {user.nickname
                ? `${user.nickname} (${user.username})`
                : user.username}
            </span>
            {user.bio || (
              <i style={{ color: "rgb(var(--gray-6))" }}>没有签名</i>
            )}
          </div>
        </Space>
      </Typography.Paragraph>

      <Typography.Paragraph>
        <Navigator
          routes={[
            { title: "资料", key: "." },
            { title: "统计", key: "statistics" },
            ...(self &&
            (isAdmin(self.role) || (isUser(self.role) && self.id === user.id))
              ? [
                  { title: "文件", key: "files" },
                  { title: "编辑", key: "edit" },
                ]
              : []),
          ]}
        />
      </Typography.Paragraph>

      <Typography.Paragraph>
        <Outlet />
      </Typography.Paragraph>
    </Typography>
  );
}

export { ErrorBoundary } from "~/src/ErrorBoundary";
export { CatchBoundary } from "~/src/CatchBoundary";
