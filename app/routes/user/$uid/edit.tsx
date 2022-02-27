import { User } from "@prisma/client";
import { useState } from "react";
import {
  ActionFunction,
  Form,
  json,
  LoaderFunction,
  redirect,
  useLoaderData,
  useTransition,
} from "remix";
import { db } from "~/utils/db.server";
import { findSessionUid } from "~/utils/sessions";

type LoaderData = Pick<User, "nickname" | "email" | "avatar">;

export const loader: LoaderFunction = async ({ request, params }) => {
  const self = await findSessionUid(request);

  if (!self) {
    return redirect("/login");
  }

  if (!params.uid || !/^\d{1,9}$/.test(params.uid)) {
    throw new Response("Invalid user id", { status: 404 });
  }

  const uid = Number(params.uid);

  const user = await db.user.findUnique({
    where: { uid },
    select: {
      nickname: true,
      avatar: true,
      email: true,
    },
  });

  if (!user) {
    throw new Response("User not found", { status: 404 });
  }

  return json(user);
};

export const action: ActionFunction = async ({ request, params }) => {
  const self = await findSessionUid(request);

  if (!self) {
    return redirect("/login");
  }

  if (!params.uid || !/^\d{1,9}$/.test(params.uid)) {
    throw new Response("Invalid user id", { status: 404 });
  }

  const uid = Number(params.uid);

  if (self !== uid) {
    throw new Response("Permission denied", { status: 403 });
  }

  const formData = await request.formData();
  const nickname = formData.get("nickname")?.toString();
  const avatar = formData.get("avatar")?.toString() ?? "";
  const email = formData.get("email")?.toString() ?? "";

  if (!nickname) {
    throw new Response("You must provide nickname", { status: 400 });
  }

  const nicknamedUser = await db.user.findUnique({
    where: { nickname },
    select: { uid: true },
  });

  if (nicknamedUser && nicknamedUser.uid !== uid) {
    throw new Response("Nickname was already taken", { status: 400 });
  }

  await db.user.update({
    where: { uid },
    data: {
      nickname,
      avatar,
      email,
    },
  });

  return redirect(`/user/${uid}`);
};

export default function UserEdit() {
  const user = useLoaderData<LoaderData>();

  const [nickname, setNickname] = useState(user.nickname);
  const [email, setEmail] = useState(user.email || "");
  const [avatar, setAvatar] = useState(user.avatar || "");

  const { state } = useTransition();

  return (
    <>
      <h3>Edit</h3>
      <Form
        method="post"
        style={{
          display: "grid",
          gridTemplateColumns: "20% 1fr",
        }}
      >
        <label htmlFor="nickname">Nickname</label>
        <input
          type="text"
          value={nickname}
          name="nickname"
          id="nickname"
          onChange={(e) => setNickname(e.currentTarget.value)}
        />
        <label htmlFor="email">E-Mail</label>
        <input
          type="email"
          value={email}
          name="email"
          id="email"
          onChange={(e) => setEmail(e.currentTarget.value)}
        />
        <label htmlFor="avatar">Avatar</label>
        <input
          type="text"
          value={avatar}
          name="avatar"
          id="avatar"
          onChange={(e) => setAvatar(e.currentTarget.value)}
          placeholder="https://..."
        />
        <div></div>
        <button type="submit" disabled={state === "submitting"}>
          {state === "submitting" ? "Apply..." : "Apply"}
        </button>
      </Form>
    </>
  );
}
