import { Avatar, Space, Tabs } from "@arco-design/web-react";
import { IconUser } from "@arco-design/web-react/icon";
import { User } from "@prisma/client";
import { useContext } from "react";
import {
  json,
  LoaderFunction,
  MetaFunction,
  Outlet,
  useLoaderData,
  useMatches,
  useNavigate,
} from "remix";
import { UserInfoContext } from "~/root";
import { db } from "~/utils/db.server";
import { invariant } from "~/utils/invariant";
import { idScheme } from "~/utils/scheme";

type LoaderData = {
  user: Pick<User, "nickname" | "username" | "avatar" | "bio" | "uid">;
};

export const loader: LoaderFunction = async ({ params }) => {
  const uid = invariant(idScheme.safeParse(params.uid), { status: 404 });

  const user = await db.user.findUnique({
    where: { uid },
    select: {
      nickname: true,
      username: true,
      avatar: true,
      bio: true,
      uid: true,
    },
  });

  if (!user) {
    throw new Response("User not found", { status: 404 });
  }

  return json({
    user,
  });
};

export const meta: MetaFunction = ({ data }: { data: LoaderData }) => ({
  title: `User: ${data.user.nickname || data.user.username} - HITwh OJ`,
});

export default function UserProfile() {
  const { user } = useLoaderData<LoaderData>();
  const navigate = useNavigate();
  const { pathname } = useMatches().at(-1)!;
  const { uid } = useContext(UserInfoContext);

  const currentTab = pathname.slice(pathname.lastIndexOf("/") + 1) || ".";

  return (
    <Space direction="vertical" size="medium" style={{ display: "flex" }}>
      <Space size="large" align="start">
        <Avatar size={60}>
          {user.avatar ? (
            <img src={user.avatar} alt={user.nickname || user.username} />
          ) : (
            <IconUser />
          )}
        </Avatar>
        <Space direction="vertical">
          <span style={{ fontSize: "2em" }}>
            {user.nickname
              ? `${user.nickname} (${user.username})`
              : user.username}
          </span>
          {user.bio ? <p>{user.bio}</p> : null}
        </Space>
      </Space>
      {/* 导航栏 */}
      <Tabs onChange={(key) => navigate(key)} activeTab={currentTab}>
        <Tabs.TabPane key="." title="资料" />
        <Tabs.TabPane key="files" title="文件" />
        {uid === user.uid && <Tabs.TabPane key="edit" title="编辑" />}
      </Tabs>
      {/* 子页面 */}
      <Outlet />
    </Space>
  );
}
