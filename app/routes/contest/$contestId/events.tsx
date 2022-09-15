import type { LoaderArgs, SerializeFrom } from "@remix-run/node";
import { filter, from, mergeMap } from "rxjs";
import { createEventSource } from "~/utils/eventSource";
import { invariant } from "~/utils/invariant";
import { findRequestUser } from "~/utils/permission";
import { idScheme } from "~/utils/scheme";
import { db } from "~/utils/server/db.server";
import { recordUpdateSubject } from "~/utils/serverEvents";
import { isNotNull } from "~/utils/tools";

const observer = recordUpdateSubject.pipe(
  mergeMap((id) =>
    from(
      db.record.findUnique({
        where: { id },
        select: {
          id: true,
          time: true,
          score: true,
          memory: true,
          status: true,
          problemId: true,
          contestId: true,
          submitterId: true,
          submittedAt: true,
        },
      })
    )
  ),
  filter(isNotNull)
);

/** 订阅用户自己在某场比赛中的提交，只保留最基础的信息 */
export async function loader({ request, params }: LoaderArgs) {
  const contestId = invariant(idScheme, params.contestId, { status: 404 });
  const self = await findRequestUser(request);

  if (!self.userId) {
    throw new Response("Unauthorized", { status: 401 });
  }

  // FIXME OI 赛制也许应该换一个接口！

  return createEventSource(
    request,
    observer.pipe(
      // 筛选比赛和用户
      filter(
        (message) =>
          message.contestId === contestId && message.submitterId === self.userId
      )
    )
  );
}

export type MessageType = SerializeFrom<typeof loader>;
