import { User } from "@prisma/client";
import { json, LoaderFunction, useLoaderData } from "remix";
import { db } from "~/utils/db.server";
import { invariant } from "~/utils/invariant";
import { guaranteePermission, Permissions } from "~/utils/permission";
import { idScheme } from "~/utils/scheme";

type LoaderData = {
  user: Pick<User, "uid" | "username" | "nickname" | "email" | "password">;
};

export const loader: LoaderFunction = async ({ request, params }) => {
  const uid = invariant(idScheme.safeParse(params.uid), { status: 404 });

  await guaranteePermission(request, Permissions.User.Profile.View, { uid });

  const user = await db.user.findUnique({
    where: { uid },
    select: {
      uid: true,
      username: true,
      nickname: true,
      email: true,
      password: true,
    },
  });

  if (!user) {
    throw new Response("User not found", { status: 404 });
  }

  return json({ user });
};

export default function Profile() {
  const { user } = useLoaderData<LoaderData>();

  return (
    <table>
      <tbody>
        <tr>
          <th>UID</th>
          <td>{user.uid}</td>
        </tr>
        <tr>
          <th>Username</th>
          <td>{user.username}</td>
        </tr>
        <tr>
          <th>Nickname</th>
          <td>{user.nickname}</td>
        </tr>
        <tr>
          <th>E-Mail</th>
          <td>{user.email}</td>
        </tr>
        <tr>
          <th>Password</th>
          <td>{user.password}</td>
        </tr>
      </tbody>
    </table>
  );
}
