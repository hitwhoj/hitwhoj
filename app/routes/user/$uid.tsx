import { Avatar, Space, Tabs } from "@arco-design/web-react";
import { IconUser } from "@arco-design/web-react/icon";
import type { User } from "@prisma/client";
import type { LoaderFunction, MetaFunction } from "@remix-run/node";
import { json } from "@remix-run/node";
import {
  Outlet,
  useLoaderData,
  useMatches,
  useNavigate,
} from "@remix-run/react";
import { db } from "~/utils/db.server";
import { invariant } from "~/utils/invariant";
import { idScheme } from "~/utils/scheme";
import { findSessionUid } from "~/utils/sessions";

type LoaderData = {
  user: Pick<User, "nickname" | "username" | "avatar" | "bio" | "uid">;
  self: number | null;
};

export const loader: LoaderFunction = async ({ request, params }) => {
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

  const self = await findSessionUid(request);

  return json({
    user,
    self,
  });
};

export const meta: MetaFunction = ({ data }: { data?: LoaderData }) => ({
  title: `用户: ${data?.user.nickname || data?.user.username} - HITwh OJ`,
});

export default function UserProfile() {
  const { user, self } = useLoaderData<LoaderData>();
  const navigate = useNavigate();
  const { pathname } = useMatches().at(-1)!;

  const currentTab = pathname.slice(pathname.lastIndexOf("/") + 1) || ".";

  return (
    <Space direction="vertical" size="medium" style={{ display: "flex" }}>
      <header>
        <Space size="large" align="start">
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
      </header>
      <nav>
        <Tabs onChange={(key) => navigate(key)} activeTab={currentTab}>
          <Tabs.TabPane key="." title="资料" />
          <Tabs.TabPane key="files" title="文件" />
          {self === user.uid && <Tabs.TabPane key="edit" title="编辑" />}
        </Tabs>
      </nav>
      <main>
        <Outlet />
      </main>
    </Space>
  );
}

export { ErrorBoundary } from "~/src/ErrorBoundary";
export { CatchBoundary } from "~/src/CatchBoundary";
