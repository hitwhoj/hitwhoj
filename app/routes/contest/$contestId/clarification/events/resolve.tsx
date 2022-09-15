import type { LoaderArgs, SerializeFrom } from "@remix-run/node";
import { filter, from, mergeMap } from "rxjs";
import { createEventSource } from "~/utils/eventSource";
import { invariant } from "~/utils/invariant";
import { findRequestUser } from "~/utils/permission";
import { idScheme } from "~/utils/scheme";
import { db } from "~/utils/server/db.server";
import { clarificationResolveSubject } from "~/utils/serverEvents";
import { isNotNull } from "~/utils/tools";

const observer = clarificationResolveSubject.pipe(
  mergeMap((id) =>
    from(
      db.clarification.findUnique({
        where: { id },
        select: { id: true, resolved: true, contestId: true, userId: true },
      })
    )
  ),
  filter(isNotNull)
);

/**
 * 订阅用户在某场比赛中的提交的反馈是否被解决
 *
 * 注意：这个接口是给用户的
 */
export async function loader({ request, params }: LoaderArgs) {
  const contestId = invariant(idScheme, params.contestId, { status: 404 });
  const self = await findRequestUser(request);

  if (!self.userId) {
    throw new Response("Unauthorized", { status: 401 });
  }

  return createEventSource(
    request,
    observer.pipe(
      // 筛选当前比赛和用户
      filter(
        (message) =>
          message.contestId === contestId && message.userId === self.userId
      )
    )
  );
}

export type MessageType = SerializeFrom<typeof loader>;
