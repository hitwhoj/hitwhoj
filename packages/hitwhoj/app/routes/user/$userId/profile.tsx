import type { LoaderArgs, MetaFunction } from "@remix-run/node";
import { json } from "@remix-run/node";
import { db } from "~/utils/server/db.server";
import { invariant } from "~/utils/invariant";
import { idScheme } from "~/utils/scheme";
import { findRequestUser } from "~/utils/permission";
import { Permissions } from "~/utils/permission/permission";
import { useSignalLoaderData } from "~/utils/hooks";
import { useComputed } from "@preact/signals-react";

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
  const loaderData = useSignalLoaderData<typeof loader>();
  const user = useComputed(() => loaderData.value.user);

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
          <td>{user.value.username}</td>
        </tr>
        <tr>
          <th>用户昵称</th>
          <td>{user.value.nickname || "-"}</td>
        </tr>
        <tr>
          <th>电子邮箱</th>
          <td>
            {user.value.email ? (
              <a href={`mailto:${user.value.email}`}>{user.value.email}</a>
            ) : (
              "-"
            )}
          </td>
        </tr>
        <tr>
          <th>工作单位</th>
          <td>{user.value.department || "-"}</td>
        </tr>
        <tr>
          <th>学号</th>
          <td>{user.value.studentId || "-"}</td>
        </tr>
      </tbody>
    </table>
  );
}

export { ErrorBoundary } from "~/src/ErrorBoundary";
export { CatchBoundary } from "~/src/CatchBoundary";
