import type { LoaderArgs, SerializeFrom } from "@remix-run/node";
import { filter, from, mergeMap } from "rxjs";
import { createEventSource } from "~/utils/eventSource";
import { invariant } from "~/utils/invariant";
import { findRequestUser } from "~/utils/permission";
import { Permissions } from "~/utils/permission/permission";
import { idScheme } from "~/utils/scheme";
import { db } from "~/utils/server/db.server";
import { privateMessageSubject } from "~/utils/serverEvents";
import { isNotNull } from "~/utils/tools";

const observer = privateMessageSubject.pipe(
  mergeMap((id) =>
    from(
      db.privateMessage.findUnique({
        where: { id },
        select: {
          id: true,
          fromId: true,
          toId: true,
          content: true,
          sentAt: true,
        },
      })
    )
  ),
  filter(isNotNull)
);

/** 订阅当前用户与目标用户之间的所有私信 */
export async function loader({ request, params }: LoaderArgs) {
  const userId = invariant(idScheme, params.userId, { status: 404 });
  const self = await findRequestUser(request);
  if (!self.userId) throw new Response("Unauthorized", { status: 401 });
  await self.checkPermission(Permissions.PERM_VIEW_USER_PM_SELF);

  return createEventSource(
    request,
    observer.pipe(
      // 筛选来源和目标用户
      filter(
        (message) =>
          (message.toId === self.userId && message.fromId === userId) ||
          (message.toId === userId && message.fromId === self.userId)
      )
    )
  );
}

export type MessageType = SerializeFrom<typeof loader>;
