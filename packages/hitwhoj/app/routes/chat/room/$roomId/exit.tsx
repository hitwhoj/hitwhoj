import type { ActionArgs } from "@remix-run/node";
import { redirect } from "@remix-run/node";
import { invariant } from "~/utils/invariant";
import { findRequestUser } from "~/utils/permission";
import { ChatRoomPermission } from "~/utils/permission/permission/room";
import { idScheme } from "~/utils/scheme";
import { db } from "~/utils/server/db.server";

export async function action({ request, params }: ActionArgs) {
  const roomId = invariant(idScheme, params.roomId, { status: 404 });
  const self = await findRequestUser(request);
  await self.room(roomId).checkPermission(ChatRoomPermission.Members);

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
