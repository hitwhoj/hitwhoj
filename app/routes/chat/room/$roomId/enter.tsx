import { Button, Input, Space } from "@arco-design/web-react";
import type { ChatRoom } from "@prisma/client";
import { ChatRoomRole } from "@prisma/client";
import type { ActionFunction, LoaderFunction } from "@remix-run/node";
import { redirect } from "@remix-run/node";
import { Form, useLoaderData } from "@remix-run/react";
import { invariant } from "~/utils/invariant";
import { idScheme, passwordScheme } from "~/utils/scheme";
import { db } from "~/utils/server/db.server";
import { findSessionUid } from "~/utils/sessions";

type LoaderData = {
  room: Pick<ChatRoom, "id" | "name" | "isPrivate" | "description">;
};

export const loader: LoaderFunction<LoaderData> = async ({
  request,
  params,
}) => {
  const roomId = invariant(idScheme.safeParse(params.roomId), {
    status: 404,
  });

  const selfId = await findSessionUid(request);
  if (!selfId) {
    throw redirect("/login");
  }

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

  const joined = await db.userInChatRoom.findUnique({
    where: {
      roomId_userId: {
        roomId: room.id,
        userId: selfId,
      },
    },
  });

  if (joined) {
    throw redirect(`/chat/room/${room.id}`);
  }

  return { room };
};

export default function EnterRoom() {
  const { room } = useLoaderData<LoaderData>();
  return (
    <div>
      <h1>{room.name}</h1>
      <p>{room.description}</p>
      <Form method="post">
        <Space direction="vertical">
          {room.isPrivate && (
            <Input.Password
              name="password"
              placeholder="请输入房间密码"
              type="password"
            />
          )}
          <Button type="primary" htmlType="submit">
            加入房间
          </Button>
        </Space>
      </Form>
    </div>
  );
}

export const action: ActionFunction<Response> = async ({ request, params }) => {
  const roomId = invariant(idScheme.safeParse(params.roomId), { status: 404 });

  const selfId = await findSessionUid(request);
  if (!selfId) {
    throw redirect("/login");
  }

  const self = (await db.user.findUnique({
    where: { id: selfId },
    select: { id: true, nickname: true, username: true, avatar: true },
  }))!;

  const room = await db.chatRoom.findUnique({
    where: { id: roomId },
    select: {
      id: true,
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
  if (userInChatRoom) {
    throw new Response("You are already in this room", { status: 400 });
  }

  if (room.isPrivate) {
    const form = await request.formData();
    const password = invariant(passwordScheme.safeParse(form.get("password")));

    if (password !== room.password) {
      throw new Response("Wrong password", { status: 400 });
    }
  }

  await db.userInChatRoom.create({
    data: {
      user: { connect: { id: self.id } },
      room: { connect: { id: room.id } },
      role: ChatRoomRole.Member,
    },
  });

  return redirect(`/chat/room/${room.id}`);
};

export { CatchBoundary } from "~/src/CatchBoundary";
export { ErrorBoundary } from "~/src/ErrorBoundary";
