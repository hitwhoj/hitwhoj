import type { LoaderArgs } from "@remix-run/node";
import { filter, map } from "rxjs";
import { createEventSource } from "~/utils/eventSource";
import { invariant } from "~/utils/invariant";
import { idScheme } from "~/utils/scheme";
import type {
  PrivateMessageWithUser,
  ServerEvents,
} from "~/utils/serverEvents";
import { serverSubject } from "~/utils/serverEvents";
import { findSessionUser } from "~/utils/sessions";

export type MessageType = PrivateMessageWithUser;

/**
 * 订阅当前用户与目标用户之间的所有私信
 */
export async function loader({ request, params }: LoaderArgs) {
  const userId = invariant(idScheme, params.userId, { status: 404 });
  const self = await findSessionUser(request);

  return createEventSource<MessageType>(
    request,
    serverSubject.pipe(
      filter(
        (
          message
        ): message is Extract<ServerEvents, { type: "PrivateMessage" }> =>
          message.type === "PrivateMessage" &&
          ((message.message.toId === self.id &&
            message.message.fromId === userId) ||
            (message.message.toId === userId &&
              message.message.fromId === self.id))
      ),
      map(({ message }) => message)
    )
  );
}
