import { User } from "@prisma/client";
import { json, LoaderFunction, useCatch, useLoaderData } from "remix";
import { getUserByUid } from "~/modules/user/profile";

type LoaderData = User;

export const loader: LoaderFunction = async ({ params }) => {
  const uid = Number(params.uid);

  if (isNaN(uid)) {
    throw json("Invalid user id", { status: 404 });
  }

  const user = await getUserByUid(uid);

  if (!user) {
    throw json("User not found", { status: 404 });
  }

  return json(user);
};

export default function UserProfile() {
  const data = useLoaderData<LoaderData>();

  return (
    <>
      <h2>User {data.nickname}</h2>
      <p>uid: {data.uid}</p>
      <p>email: {data.email}</p>
      <p>password: {data.password}</p>
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
