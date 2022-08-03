import { Space, Typography } from "@arco-design/web-react";
import type { User } from "@prisma/client";
import type { LoaderFunction, MetaFunction } from "@remix-run/node";
import { Outlet, useLoaderData } from "@remix-run/react";
import { db } from "~/utils/server/db.server";
import { invariant } from "~/utils/invariant";
import { idScheme } from "~/utils/scheme";
import { Navigator } from "~/src/Navigator";
import { UserAvatar } from "~/src/user/UserAvatar";
import { AvatarBadge } from "~/src/AvatarBadge";
import { findRequestUser } from "~/utils/permission";
import { Permissions } from "~/utils/permission/permission";

type LoaderData = {
  user: Pick<
    User,
    "nickname" | "username" | "avatar" | "bio" | "id" | "role" | "premium"
  >;
  hasEditPerm: boolean;
  hasAdminPerm: boolean;
};

export const loader: LoaderFunction<LoaderData> = async ({
  request,
  params,
}) => {
  const userId = invariant(idScheme, params.userId, { status: 404 });
  const self = await findRequestUser(request);
  await self.checkPermission(
    self.userId === userId
      ? Permissions.PERM_VIEW_USER_PROFILE_SELF
      : Permissions.PERM_VIEW_USER_PROFILE
  );
  const [hasEditPerm, hasEditPrivPerm, hasEditRolePerm] =
    await self.hasPermission(
      self.userId === userId
        ? Permissions.PERM_EDIT_USER_PROFILE_SELF
        : Permissions.PERM_EDIT_USER_PROFILE,
      Permissions.PERM_EDIT_USER_PRIVILEGE,
      Permissions.PERM_EDIT_USER_ROLE
    );

  const user = await db.user.findUnique({
    where: { id: userId },
    select: {
      nickname: true,
      username: true,
      avatar: true,
      bio: true,
      id: true,
      role: true,
      premium: true,
    },
  });

  if (!user) {
    throw new Response("User not found", { status: 404 });
  }

  return {
    user,
    hasEditPerm,
    hasAdminPerm: hasEditPrivPerm || hasEditRolePerm,
  };
};

export const meta: MetaFunction<LoaderData> = ({ data }) => ({
  title: `用户: ${data?.user.nickname || data?.user.username} - HITwh OJ`,
});

export default function UserProfile() {
  const { user, hasEditPerm, hasAdminPerm } = useLoaderData<LoaderData>();

  return (
    <Typography>
      <Typography.Paragraph>
        <Space size="large" align="start">
          {user.premium ? (
            <AvatarBadge icon="大" color="magenta">
              <UserAvatar user={user} size={60} />
            </AvatarBadge>
          ) : (
            <UserAvatar user={user} size={60} />
          )}
          <div style={{ display: "flex", flexDirection: "column" }}>
            <span style={{ fontSize: "2em" }}>
              {user.nickname ? (
                <Space>
                  {user.nickname}
                  <span style={{ color: "rgb(var(--gray-5))" }}>
                    ({user.username})
                  </span>
                </Space>
              ) : (
                user.username
              )}
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
            ...(hasEditPerm ? [{ title: "文件", key: "files" }] : []),
            ...(hasEditPerm ? [{ title: "编辑", key: "edit" }] : []),
            ...(hasAdminPerm ? [{ title: "滥权", key: "admin" }] : []),
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
