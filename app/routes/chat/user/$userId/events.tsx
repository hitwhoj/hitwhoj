import type { LoaderArgs } from "@remix-run/node";
import { filter } from "rxjs";
import { createEventSource } from "~/utils/eventSource";
import { invariant } from "~/utils/invariant";
import { findRequestUser } from "~/utils/permission";
import { idScheme } from "~/utils/scheme";
import type { PrivateMessageWithUser } from "~/utils/serverEvents";
import { privateMessageSubject } from "~/utils/serverEvents";

export type MessageType = PrivateMessageWithUser;

/**
 * 订阅当前用户与目标用户之间的所有私信
 */
export async function loader({ request, params }: LoaderArgs) {
  const userId = invariant(idScheme, params.userId, { status: 404 });
  const self = await findRequestUser(request);
  if (!self.userId) throw new Response("Unauthorized", { status: 401 });

  return createEventSource<MessageType>(
    request,
    privateMessageSubject.pipe(
      // 筛选来源和目标用户
      filter(
        (message) =>
          (message.toId === self.userId && message.fromId === userId) ||
          (message.toId === userId && message.fromId === self.userId)
      )
    )
  );
}
