import type { LoaderArgs, SerializeFrom } from "@remix-run/node";
import { filter, from, mergeMap } from "rxjs";
import { selectUserData } from "~/utils/db/user";
import { createEventSource } from "~/utils/eventSource";
import { invariant } from "~/utils/invariant";
import { findRequestUser } from "~/utils/permission";
import { Permissions } from "~/utils/permission/permission";
import { idScheme } from "~/utils/scheme";
import { db } from "~/utils/server/db.server";
import { chatMessageSubject } from "~/utils/serverEvents";
import { isNotNull } from "~/utils/tools";

const observer = chatMessageSubject.pipe(
  mergeMap((id) =>
    from(
      db.chatMessage.findUnique({
        where: { id },
        select: {
          id: true,
          role: true,
          content: true,
          sentAt: true,
          roomId: true,
          sender: { select: { ...selectUserData } },
        },
      })
    )
  ),
  filter(isNotNull)
);

export async function loader({ request, params }: LoaderArgs) {
  const roomId = invariant(idScheme, params.roomId, { status: 404 });
  const self = await findRequestUser(request);
  await self
    .room(roomId)
    .checkPermission(Permissions.PERM_VIEW_CHATROOM_MESSAGE);

  return createEventSource(
    request,
    observer.pipe(
      // 筛选房间
      filter((message) => message.roomId === roomId)
    )
  );
}

export type MessageType = SerializeFrom<typeof loader>;
