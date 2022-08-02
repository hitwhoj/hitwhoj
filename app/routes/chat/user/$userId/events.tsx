import type { LoaderFunction } from "@remix-run/node";
import { filter } from "rxjs";
import { createEventSource } from "~/utils/eventSource";
import { invariant } from "~/utils/invariant";
import { idScheme } from "~/utils/scheme";
import type { PrivateMessageWithUser } from "~/utils/serverEvents";
import { privateMessageSubject } from "~/utils/serverEvents";
import { findSessionUser } from "~/utils/sessions";

export type MessageType = PrivateMessageWithUser;

// 用户订阅自己与目标用户之间的所有私信
export const loader: LoaderFunction<Response> = async ({ request, params }) => {
  const userId = invariant(idScheme, params.userId, { status: 404 });
  const self = await findSessionUser(request);

  return createEventSource<MessageType>(
    request,
    privateMessageSubject.pipe(
      // 筛选来源和目标用户
      filter(
        (message) =>
          (message.toId === self.id && message.fromId === userId) ||
          (message.toId === userId && message.fromId === self.id)
      )
    )
  );
};
