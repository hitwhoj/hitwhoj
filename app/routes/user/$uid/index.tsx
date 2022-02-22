import { User } from "@prisma/client";
import { json, LoaderFunction, useLoaderData } from "remix";
import { db } from "~/utils/db.server";

type LoaderData = User;

export const loader: LoaderFunction = async ({ params }) => {
  const uid = Number(params.uid);

  if (isNaN(uid)) {
    throw json("Invalid user id", { status: 404 });
  }

  const user = await db.user.findUnique({
    where: { uid },
  });

  if (!user) {
    throw json("User not found", { status: 404 });
  }

  return json(user);
};

export default function Profile() {
  const data = useLoaderData<LoaderData>();

  return (
    <>
      <p>uid: {data.uid}</p>
      {data.email && (
        <p>
          email: <a href={`mailto:${data.email}`}>{data.email}</a>
        </p>
      )}
      <p>
        password:{" "}
        <span
          style={{
            fontFamily: "monospace",
            fontSize: "1.14em",
            color: "rgb(255, 0, 0)",
          }}
        >
          {data.password}
        </span>
      </p>
    </>
  );
}
