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
      department: true,
      studentId: true,
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

  // FIXME 摆烂了，这个页面就跟 statistics 页面合并了吧
  // 丢给 @lingyunchi 处理吧

  return (
    <table>
      <thead>
        <tr>
          <th>用户资料</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <th>用户名</th>
          <td>{user.username}</td>
        </tr>
        <tr>
          <th>用户昵称</th>
          <td>{user.nickname}</td>
        </tr>
        <tr>
          <th>电子邮箱</th>
          <td>
            {user.email ? (
              <a href={`mailto:${user.email}`}>{user.email}</a>
            ) : (
              "-"
            )}
          </td>
        </tr>
        <tr>
          <th>工作单位</th>
          <td>{user.department || "-"}</td>
        </tr>
        <tr>
          <th>学号</th>
          <td>{user.studentId || "-"}</td>
        </tr>
      </tbody>
    </table>
  );
}

export { ErrorBoundary } from "~/src/ErrorBoundary";
export { CatchBoundary } from "~/src/CatchBoundary";
