import { Button } from "@arco-design/web-react";
import type { ChatRoom, UserInChatRoom } from "@prisma/client";
import type { ActionFunction, LoaderFunction } from "@remix-run/node";
import { redirect } from "@remix-run/node";
import { Form, useLoaderData } from "@remix-run/react";
import { invariant } from "~/utils/invariant";
import { idScheme } from "~/utils/scheme";
import { db } from "~/utils/server/db.server";
import { findSessionUid } from "~/utils/sessions";

type LoaderData = {
  room: Pick<ChatRoom, "id" | "name" | "isPrivate" | "description">;
  userInChatRoom: Pick<UserInChatRoom, "role"> | null;
};

export const loader: LoaderFunction<LoaderData> = async ({
  request,
  params,
}) => {
  const selfId = await findSessionUid(request);
  if (!selfId) {
    throw redirect("/login");
  }

  const roomId = invariant(idScheme.safeParse(params.roomId), {
    status: 404,
  });
  const room = await db.chatRoom.findUnique({
    where: { id: roomId },
    select: {
      id: true,
      name: true,
      description: true,
      isPrivate: true,
    },
  });
  if (!room) {
    throw new Response("Room not found", { status: 404 });
  }

  const userInChatRoom = await db.userInChatRoom.findFirst({
    select: { role: true },
    where: {
      userId: selfId,
      roomId: room.id,
    },
  });

  return { room, userInChatRoom };
};

export default function ExitRoom() {
  const { room, userInChatRoom } = useLoaderData<LoaderData>();
  return (
    <div>
      <h1>{room.name}</h1>
      <p>{room.description}</p>
      {userInChatRoom ? (
        <Form method="post">
          <Button type="primary" htmlType="submit">
            退出房间
          </Button>
        </Form>
      ) : (
        <div>你还没加入该房间捏</div>
      )}
    </div>
  );
}

export const action: ActionFunction<Response> = async ({ request, params }) => {
  const selfId = await findSessionUid(request);
  if (!selfId) {
    throw redirect("/login");
  }
  const self = await db.user.findUnique({
    where: { id: selfId },
    select: { id: true, nickname: true, username: true, avatar: true },
  });
  if (!self) {
    throw redirect("/register");
  }

  const roomId = invariant(idScheme.safeParse(params.roomId), { status: 404 });
  const room = await db.chatRoom.findUnique({
    where: { id: roomId },
    select: {
      id: true,
      name: true,
      isPrivate: true,
      password: true,
    },
  });
  if (!room) {
    throw new Response("Room not found", { status: 404 });
  }

  const userInChatRoom = await db.userInChatRoom.findFirst({
    where: {
      userId: self.id,
      roomId: room.id,
    },
  });
  if (!userInChatRoom) {
    throw new Response("You are not in this room", { status: 400 });
  }

  await db.userInChatRoom.delete({
    where: {
      id: userInChatRoom.id,
    },
  });

  return redirect(`/chat`);
};

export { CatchBoundary } from "~/src/CatchBoundary";
export { ErrorBoundary } from "~/src/ErrorBoundary";
