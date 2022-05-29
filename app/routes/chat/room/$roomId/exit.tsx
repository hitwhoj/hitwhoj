import { Button } from "@arco-design/web-react";
import type { ChatRoom, UserInChatRoom } from "@prisma/client";
import type { ActionFunction, LoaderFunction } from "@remix-run/node";
import { json } from "@remix-run/node";
import { redirect } from "@remix-run/node";
import { Form, useLoaderData } from "@remix-run/react";
import { invariant } from "~/utils/invariant";
import { idScheme } from "~/utils/scheme";
import { db } from "~/utils/server/db.server";
import { findSessionUid } from "~/utils/sessions";

type LoaderData = {
  userInChatRoom: Pick<UserInChatRoom, "role"> & {
    room: Pick<ChatRoom, "id" | "name" | "isPrivate" | "description">;
  };
};

export const loader: LoaderFunction<LoaderData> = async ({
  request,
  params,
}) => {
  const roomId = invariant(idScheme, params.roomId, { status: 404 });

  const selfId = await findSessionUid(request);
  if (!selfId) {
    throw redirect("/login");
  }

  const userInChatRoom = await db.userInChatRoom.findUnique({
    where: {
      roomId_userId: {
        roomId: roomId,
        userId: selfId,
      },
    },
    select: {
      role: true,
      room: {
        select: {
          id: true,
          name: true,
          description: true,
          isPrivate: true,
        },
      },
    },
  });

  if (!userInChatRoom) {
    throw json(["You are not in the certain room"], { status: 400 });
  }

  return { userInChatRoom };
};

export default function ExitRoom() {
  const {
    userInChatRoom: { room },
  } = useLoaderData<LoaderData>();
  return (
    <div>
      <h1>{room.name}</h1>
      <p>{room.description}</p>
      <Form method="post">
        <Button type="primary" status="danger" htmlType="submit">
          退出房间
        </Button>
      </Form>
    </div>
  );
}

export const action: ActionFunction = async ({ request, params }) => {
  const roomId = invariant(idScheme, params.roomId, { status: 404 });

  const selfId = await findSessionUid(request);
  if (!selfId) {
    throw redirect("/login");
  }
  const self = (await db.user.findUnique({
    where: { id: selfId },
    select: { id: true, nickname: true, username: true, avatar: true },
  }))!;

  const result = await db.userInChatRoom.delete({
    where: {
      roomId_userId: {
        roomId: roomId,
        userId: self.id,
      },
    },
  });

  if (!result) {
    throw new Response("You are not in this room", { status: 400 });
  }

  return null;
};

export { CatchBoundary } from "~/src/CatchBoundary";
export { ErrorBoundary } from "~/src/ErrorBoundary";
