import { User } from "@prisma/client";
import { json, LoaderFunction, useLoaderData } from "remix";
import { db } from "~/utils/db.server";
import { invariant } from "~/utils/invariant";
import { idScheme } from "~/utils/scheme";

type LoaderData = {
  user: User;
};

export const loader: LoaderFunction = async ({ params }) => {
  const uid = invariant(idScheme.safeParse(params.uid), { status: 404 });

  const user = await db.user.findUnique({
    where: { uid },
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
