import { User } from "@prisma/client";
import { json, LoaderFunction, useLoaderData } from "remix";
import { db } from "~/utils/db.server";
import { ensureNumericId, invariant } from "~/utils/invariant";

type LoaderData = {
  user: User;
};

export const loader: LoaderFunction = async ({ params }) => {
  const uid = invariant(ensureNumericId(params.uid), "uid is required");

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
