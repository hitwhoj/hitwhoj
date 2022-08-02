import type { LoaderFunction } from "@remix-run/node";
import { filter } from "rxjs";
import { createEventSource } from "~/utils/eventSource";
import type { PrivateMessageWithUser } from "~/utils/serverEvents";
import { privateMessageSubject } from "~/utils/serverEvents";
import { findSessionUser } from "~/utils/sessions";

export type MessageType = PrivateMessageWithUser;

// 用户订阅自己收到的私信
export const loader: LoaderFunction<Response> = async ({ request }) => {
  const self = await findSessionUser(request);

  return createEventSource<MessageType>(
    request,
    privateMessageSubject.pipe(
      // 筛选接收用户
      filter((message) => message.toId === self.id)
    )
  );
};
