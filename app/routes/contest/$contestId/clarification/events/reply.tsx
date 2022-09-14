import type { LoaderArgs, SerializeFrom } from "@remix-run/node";
import { filter, from, mergeMap } from "rxjs";
import { createEventSource } from "~/utils/eventSource";
import { invariant } from "~/utils/invariant";
import { findRequestUser } from "~/utils/permission";
import { idScheme } from "~/utils/scheme";
import { db } from "~/utils/server/db.server";
import { clarificationReplySubject } from "~/utils/serverEvents";
import { isNotNull } from "~/utils/tools";

const observer = clarificationReplySubject.pipe(
  mergeMap((id) =>
    from(
      db.clarificationReply.findUnique({
        where: { id },
        select: {
          id: true,
          content: true,
          clarification: { select: { contestId: true, userId: true } },
        },
      })
    )
  ),
  filter(isNotNull)
);

/**
 * 订阅用户在某场比赛中的提交的反馈收到的回复
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
          message.clarification.contestId === contestId &&
          message.clarification.userId === self.userId
      )
    )
  );
}

export type MessageType = SerializeFrom<typeof loader>;
