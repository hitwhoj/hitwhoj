import { User } from "@prisma/client";
import {
  json,
  Link,
  LoaderFunction,
  MetaFunction,
  Outlet,
  useLoaderData,
} from "remix";
import { db } from "~/utils/db.server";
import { invariant } from "~/utils/invariant";
import { idScheme } from "~/utils/scheme";
import { findSessionUid } from "~/utils/sessions";

type LoaderData = {
  user: Pick<User, "nickname" | "username">;
  isSelf: boolean;
};

export const loader: LoaderFunction = async ({ request, params }) => {
  const uid = invariant(idScheme.safeParse(params.uid), { status: 404 });

  const user = await db.user.findUnique({
    where: { uid },
    select: { nickname: true, username: true },
  });

  if (!user) {
    throw new Response("User not found", { status: 404 });
  }

  const self = await findSessionUid(request);

  return json({
    user,
    isSelf: self === uid,
  });
};

export const meta: MetaFunction = ({ data }: { data: LoaderData }) => ({
  title: `User: ${data.user.nickname || data.user.username} - HITwh OJ`,
});

export default function UserProfile() {
  const { user, isSelf } = useLoaderData<LoaderData>();

  return (
    <>
      <h2>
        {user.nickname ? `${user.nickname} (${user.username})` : user.username}
      </h2>
      <ul>
        <li>
          <Link to=".">资料</Link>
        </li>
        <li>
          <Link to="files">文件</Link>
        </li>
        {isSelf && (
          <li>
            <Link to="edit">编辑</Link>
          </li>
        )}
      </ul>
      <Outlet />
    </>
  );
}
