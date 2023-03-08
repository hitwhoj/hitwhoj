import type { LoaderArgs, MetaFunction } from "@remix-run/node";
import { json } from "@remix-run/node";
import { Link, NavLink, Outlet, useLoaderData } from "@remix-run/react";
import { db } from "~/utils/server/db.server";
import { invariant } from "~/utils/invariant";
import { idScheme } from "~/utils/scheme";
import { UserAvatar } from "~/src/user/UserAvatar";
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

  return json({
    user,
    hasEditPerm,
    hasAdminPerm: hasEditPrivPerm || hasEditRolePerm,
  });
}

export const meta: MetaFunction<typeof loader> = ({ data }) => ({
  title: `用户: ${data?.user.nickname || data?.user.username} - HITwh OJ`,
});

export default function UserProfile() {
  const { user, hasEditPerm, hasAdminPerm } = useLoaderData<typeof loader>();

  return (
    <div>
      <header className="not-prose my-4 text-center">
        <UserAvatar
          user={user}
          className="mx-auto h-20 w-20 bg-base-200 text-3xl"
        />
        <h1 className="mt-4 text-lg font-bold">
          {user.nickname || user.username}
        </h1>
        {user.bio && <p className="mt-3 text-sm">{user.bio}</p>}
        <div className="tabs tabs-boxed mt-5 justify-center bg-base-100">
          <NavLink className="tab" to="profile">
            资料
          </NavLink>
          <NavLink className="tab" to="statistics">
            统计
          </NavLink>
          {hasEditPerm && (
            <NavLink className="tab" to="files">
              文件
            </NavLink>
          )}
          {hasEditPerm && (
            <NavLink className="tab" to="edit">
              编辑
            </NavLink>
          )}
          {hasAdminPerm && (
            <NavLink className="tab" to="admin">
              滥权
            </NavLink>
          )}
          <Link className="tab" to={`/chat/user/${user.id}`}>
            聊天
          </Link>
        </div>
      </header>

      <div>
        <Outlet />
      </div>
    </div>
  );
}

export { ErrorBoundary } from "~/src/ErrorBoundary";
export { CatchBoundary } from "~/src/CatchBoundary";
