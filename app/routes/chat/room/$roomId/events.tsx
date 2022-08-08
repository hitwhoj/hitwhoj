import type { LoaderArgs } from "@remix-run/node";
import { filter, map } from "rxjs";
import { createEventSource } from "~/utils/eventSource";
import { invariant } from "~/utils/invariant";
import { idScheme } from "~/utils/scheme";
import type { ChatMessageWithUser, ServerEvents } from "~/utils/serverEvents";
import { serverSubject } from "~/utils/serverEvents";

export type MessageType = ChatMessageWithUser;

export async function loader({ request, params }: LoaderArgs) {
  const roomId = invariant(idScheme, params.roomId, { status: 404 });

  return createEventSource<MessageType>(
    request,
    serverSubject.pipe(
      filter(
        (message): message is Extract<ServerEvents, { type: "ChatMessage" }> =>
          message.type === "ChatMessage" && message.message.roomId === roomId
      ),
      map(({ message }) => message)
    )
  );
}
