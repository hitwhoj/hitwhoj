import type { LoaderFunction } from "@remix-run/node";
import { filter, map } from "rxjs";
import { createEventSource } from "~/utils/eventSource";
import { invariant } from "~/utils/invariant";
import { idScheme } from "~/utils/scheme";
import type {
  ContestRecordUpdateMessage,
  ServerEvents,
} from "~/utils/serverEvents";
import { serverSubject } from "~/utils/serverEvents";
import { findSessionUser } from "~/utils/sessions";

export type MessageType = ContestRecordUpdateMessage;

/** 订阅用户自己在某场比赛中的提交 */
export const loader: LoaderFunction<Response> = async ({ request, params }) => {
  const contestId = invariant(idScheme, params.contestId, { status: 404 });
  const self = await findSessionUser(request);

  // TODO: OI 赛制的话自己应该看不到结果！

  return createEventSource<MessageType>(
    request,
    serverSubject.pipe(
      filter(
        (
          message
        ): message is Extract<ServerEvents, { type: "ContestRecordUpdate" }> =>
          message.type === "ContestRecordUpdate" &&
          message.message.contestId === contestId &&
          message.message.submitterId === self.id
      ),
      map(({ message }) => message)
    )
  );
};
