import type { LoaderArgs } from "@remix-run/node";
import { filter, map } from "rxjs";
import { createEventSource } from "~/utils/eventSource";
import { invariant } from "~/utils/invariant";
import { findRequestUser } from "~/utils/permission";
import { idScheme } from "~/utils/scheme";
import type { RecordUpdateMessage } from "~/utils/serverEvents";
import { recordUpdateSubject } from "~/utils/serverEvents";

export type MessageType = Pick<
  RecordUpdateMessage,
  "id" | "status" | "problemId" | "time" | "score" | "memory"
>;

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
    recordUpdateSubject.pipe(
      filter(
        (message) =>
          message.contestId === contestId && message.submitterId === self.userId
      ),
      map((message) => ({
        id: message.id,
        time: message.time,
        score: message.score,
        memory: message.memory,
        status: message.status,
        problemId: message.problemId,
      }))
    )
  );
}
