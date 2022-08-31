import type { LoaderArgs } from "@remix-run/node";
import { filter } from "rxjs";
import { createEventSource } from "~/utils/eventSource";
import { findRequestUser } from "~/utils/permission";
import { Permissions } from "~/utils/permission/permission";
import type { PrivateMessageWithUser } from "~/utils/serverEvents";
import { privateMessageSubject } from "~/utils/serverEvents";

export type MessageType = PrivateMessageWithUser;

// 用户订阅自己收到的私信
export async function loader({ request }: LoaderArgs) {
  const self = await findRequestUser(request);
  if (!self.userId) throw new Response("Unauthorized", { status: 401 });
  await self.checkPermission(Permissions.PERM_VIEW_USER_PM_SELF);

  return createEventSource<MessageType>(
    request,
    privateMessageSubject.pipe(
      // 筛选接收用户
      filter((message) => message.toId === self.userId)
    )
  );
}
