import { Button, Typography } from "@arco-design/web-react";
import { IconCloud } from "@arco-design/web-react/icon";
import type { ActionArgs, LoaderArgs } from "@remix-run/node";
import { json } from "@remix-run/node";
import { redirect } from "@remix-run/node";
import { Form, useLoaderData } from "@remix-run/react";
import { invariant } from "~/utils/invariant";
import { findRequestUser } from "~/utils/permission";
import { Permissions } from "~/utils/permission/permission";
import { idScheme } from "~/utils/scheme";
import { db } from "~/utils/server/db.server";

export async function loader({ request, params }: LoaderArgs) {
  const roomId = invariant(idScheme, params.roomId, { status: 404 });
  const self = await findRequestUser(request);
  await self
    .room(roomId)
    .checkPermission(Permissions.PERM_QUIT_CHATROOM_MESSAGE);

  const room = await db.chatRoom.findUnique({
    where: { id: roomId },
    select: {
      id: true,
      name: true,
      description: true,
      private: true,
    },
  });

  if (!room) {
    throw new Response("Room not found", { status: 404 });
  }

  return json({ room });
}

export default function ExitRoom() {
  const { room } = useLoaderData<typeof loader>();

  return (
    <Typography>
      <Typography.Title heading={3}>{room.name}</Typography.Title>
      <Typography.Paragraph>{room.description}</Typography.Paragraph>
      <Typography.Paragraph>
        <Form method="post">
          <Button
            type="primary"
            status="danger"
            htmlType="submit"
            icon={<IconCloud />}
          >
            退出房间
          </Button>
        </Form>
      </Typography.Paragraph>
    </Typography>
  );
}

export async function action({ request, params }: ActionArgs) {
  const roomId = invariant(idScheme, params.roomId, { status: 404 });
  const self = await findRequestUser(request);
  await self
    .room(roomId)
    .checkPermission(Permissions.PERM_QUIT_CHATROOM_MESSAGE);

  await db.chatRoomUser.delete({
    where: {
      roomId_userId: {
        roomId: roomId,
        userId: self.userId!,
      },
    },
  });

  return redirect(`/chat/room/${roomId}`);
}

export { CatchBoundary } from "~/src/CatchBoundary";
export { ErrorBoundary } from "~/src/ErrorBoundary";
