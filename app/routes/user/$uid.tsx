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
import { findSessionUid } from "~/utils/sessions";

type LoaderData = Pick<User, "nickname"> & { isSelf: boolean };

export const loader: LoaderFunction = async ({ request, params }) => {
  if (!params.uid || !/^\d{1,9}$/.test(params.uid)) {
    throw new Response("Invalid user id", { status: 404 });
  }

  const uid = Number(params.uid);

  const user = await db.user.findUnique({
    where: { uid },
    select: { nickname: true },
  });

  if (!user) {
    throw new Response("User not found", { status: 404 });
  }

  const self = await findSessionUid(request);

  return json({
    nickname: user.nickname,
    isSelf: self === uid,
  });
};

export const meta: MetaFunction = ({ data }: { data: LoaderData }) => ({
  title: `User: ${data.nickname} - HITwh OJ`,
});

export default function UserProfile() {
  const { nickname, isSelf } = useLoaderData<LoaderData>();

  return (
    <>
      <h2>User {nickname}</h2>
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
