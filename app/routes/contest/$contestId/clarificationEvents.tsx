import type { LoaderArgs } from "@remix-run/node";
import { filter, map } from "rxjs";
import { createEventSource } from "~/utils/eventSource";
import { invariant } from "~/utils/invariant";
import { findRequestUser } from "~/utils/permission";
import { idScheme } from "~/utils/scheme";
import type { ClarificationMessage } from "~/utils/serverEvents";
import { clarificationSubject } from "~/utils/serverEvents";

export type MessageType = ClarificationMessage;

/** 订阅用户在某场比赛中的反馈信息 */
export async function loader({ request, params }: LoaderArgs) {
  const contestId = invariant(idScheme, params.contestId, { status: 404 });
  const self = await findRequestUser(request);

  if (!self.userId) {
    throw new Response("Unauthorized", { status: 401 });
  }

  return createEventSource(
    request,
    clarificationSubject.pipe(
      filter((message) => message.contestId === contestId),
      map((message) => ({
        id: message.id,
        contestId: message.contestId,
        rank: message.rank,
        userId: message.userId,
        content: message.content,
        resolved: message.resolved,
        type: message.type,
      }))
    )
  );
}
