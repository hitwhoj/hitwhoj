import type { LoaderArgs } from "@remix-run/node";
import { filter, map } from "rxjs";
import { createEventSource } from "~/utils/eventSource";
import type {
  PrivateMessageWithUser,
  ServerEvents,
} from "~/utils/serverEvents";
import { serverSubject } from "~/utils/serverEvents";
import { findSessionUser } from "~/utils/sessions";

export type MessageType = PrivateMessageWithUser;

/**
 * 订阅用户收到的私信
 */
export async function loader({ request }: LoaderArgs) {
  const self = await findSessionUser(request);

  return createEventSource<MessageType>(
    request,
    serverSubject.pipe(
      filter(
        (
          message
        ): message is Extract<ServerEvents, { type: "PrivateMessage" }> =>
          message.type === "PrivateMessage" && message.message.toId === self.id
      ),
      map(({ message }) => message)
    )
  );
}
