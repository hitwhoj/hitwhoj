import { Tabs } from "@arco-design/web-react";
import { User } from "@prisma/client";
import {
  json,
  LoaderFunction,
  MetaFunction,
  Outlet,
  useLoaderData,
  useNavigate,
} from "remix";
import { db } from "~/utils/db.server";
import { invariant } from "~/utils/invariant";
import { idScheme } from "~/utils/scheme";

type LoaderData = {
  user: Pick<User, "nickname" | "username">;
  isSelf: boolean;
};

export const loader: LoaderFunction = async ({ params }) => {
  const uid = invariant(idScheme.safeParse(params.uid), { status: 404 });

  const user = await db.user.findUnique({
    where: { uid },
    select: { nickname: true, username: true },
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

  return (
    <>
      <h2>
        {user.nickname ? `${user.nickname} (${user.username})` : user.username}
      </h2>
      <Tabs onClickTab={(key) => navigate(key)}>
        <Tabs.TabPane key="." title="资料" />
        <Tabs.TabPane key="files" title="文件" />
        <Tabs.TabPane key="edit" title="编辑" />
      </Tabs>
      <Outlet />
    </>
  );
}
