import { Avatar, Space, Tabs, Typography } from "@arco-design/web-react";
import { IconUser } from "@arco-design/web-react/icon";
import type { User } from "@prisma/client";
import type { LoaderFunction, MetaFunction } from "@remix-run/node";
import {
  Outlet,
  useLoaderData,
  useMatches,
  useNavigate,
} from "@remix-run/react";
import { useContext } from "react";
import { UserInfoContext } from "~/utils/context/user";
import { db } from "~/utils/server/db.server";
import { invariant } from "~/utils/invariant";
import { idScheme } from "~/utils/scheme";
import { checkUserReadPermission } from "~/utils/permission/user";

type LoaderData = {
  user: Pick<User, "nickname" | "username" | "avatar" | "bio" | "id">;
};

export const loader: LoaderFunction<LoaderData> = async ({
  request,
  params,
}) => {
  const userId = invariant(idScheme, params.userId, { status: 404 });

  await checkUserReadPermission(request);

  const user = await db.user.findUnique({
    where: { id: userId },
    select: {
      nickname: true,
      username: true,
      avatar: true,
      bio: true,
      id: true,
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
  const navigate = useNavigate();
  const { pathname } = useMatches().at(-1)!;

  const currentTab = pathname.slice(pathname.lastIndexOf("/") + 1) || ".";

  return (
    <Typography>
      <Typography.Paragraph>
        <Space size="large" align="center">
          <Avatar size={60}>
            {user.avatar ? (
              <img src={user.avatar} alt={user.nickname || user.username} />
            ) : (
              <IconUser />
            )}
          </Avatar>
          <div style={{ display: "flex", flexDirection: "column" }}>
            <span style={{ fontSize: "2em" }}>
              {user.nickname
                ? `${user.nickname} (${user.username})`
                : user.username}
            </span>
            {user.bio && <span>{user.bio}</span>}
          </div>
        </Space>
      </Typography.Paragraph>

      <Typography.Paragraph>
        <Tabs onChange={(key) => navigate(key)} activeTab={currentTab}>
          <Tabs.TabPane key="." title="资料" />
          <Tabs.TabPane key="statistics" title="统计" />
          {self?.id === user.id && <Tabs.TabPane key="files" title="文件" />}
          {self?.id === user.id && <Tabs.TabPane key="edit" title="编辑" />}
        </Tabs>
      </Typography.Paragraph>

      <Typography.Paragraph>
        <Outlet />
      </Typography.Paragraph>
    </Typography>
  );
}

export { ErrorBoundary } from "~/src/ErrorBoundary";
export { CatchBoundary } from "~/src/CatchBoundary";
