import { User } from "@prisma/client";
import {
  json,
  Link,
  LoaderFunction,
  Outlet,
  useCatch,
  useLoaderData,
  useParams,
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

export default function UserProfile() {
  const { nickname, isSelf } = useLoaderData<LoaderData>();
  const { uid } = useParams();

  return (
    <>
      <h2>User {nickname}</h2>
      <ul>
        <li>
          <Link to={`/user/${uid}`}>Profile</Link>
        </li>
        <li>
          <Link to={`/user/${uid}/files`}>Files</Link>
        </li>
        {isSelf && (
          <li>
            <Link to={`/user/${uid}/edit`}>Edit</Link>
          </li>
        )}
      </ul>
      <Outlet />
    </>
  );
}

export function CatchBoundary() {
  const caught = useCatch();

  return (
    <>
      <h2>{caught.status} Error!</h2>
      <p>Message: {caught.data}</p>
    </>
  );
}
