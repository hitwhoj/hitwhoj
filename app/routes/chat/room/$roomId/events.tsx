import type { LoaderArgs } from "@remix-run/node";
import { filter } from "rxjs";
import { createEventSource } from "~/utils/eventSource";
import { invariant } from "~/utils/invariant";
import { idScheme } from "~/utils/scheme";
import type { ChatMessageWithUser } from "~/utils/serverEvents";
import { chatMessageSubject } from "~/utils/serverEvents";

export type MessageType = ChatMessageWithUser;

export async function loader({ request, params }: LoaderArgs) {
  const roomId = invariant(idScheme, params.roomId, { status: 404 });

  // FIXME: 应该检查用户是否在群组里面！

  return createEventSource<MessageType>(
    request,
    chatMessageSubject.pipe(
      // 筛选房间
      filter((message) => message.roomId === roomId)
    )
  );
}
