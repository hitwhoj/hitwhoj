import type { LoaderArgs, SerializeFrom } from "@remix-run/node";
import { filter, from, mergeMap } from "rxjs";
import { selectUserData } from "~/utils/db/user";
import { createEventSource } from "~/utils/eventSource";
import { findRequestUser } from "~/utils/permission";
import { Permissions } from "~/utils/permission/permission";
import { db } from "~/utils/server/db.server";
import { privateMessageSubject } from "~/utils/serverEvents";
import { isNotNull } from "~/utils/tools";

const observer = privateMessageSubject.pipe(
  mergeMap((id) =>
    from(
      db.privateMessage.findUnique({
        where: { id },
        select: {
          to: { select: { ...selectUserData } },
          from: { select: { ...selectUserData } },
          content: true,
          sentAt: true,
        },
      })
    )
  ),
  filter(isNotNull)
);

// 用户订阅自己收到的私信
export async function loader({ request }: LoaderArgs) {
  const self = await findRequestUser(request);
  if (!self.userId) throw new Response("Unauthorized", { status: 401 });
  await self.checkPermission(Permissions.PERM_VIEW_USER_PM_SELF);

  return createEventSource(
    request,
    observer.pipe(
      // 筛选接收用户
      filter((message) => message.to.id === self.userId)
    )
  );
}

export type MessageType = SerializeFrom<typeof loader>;
