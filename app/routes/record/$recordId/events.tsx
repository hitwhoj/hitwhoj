import type { LoaderFunction } from "@remix-run/node";
import { filter, map } from "rxjs";
import { createEventSource } from "~/utils/eventSource";
import { invariant } from "~/utils/invariant";
import { idScheme } from "~/utils/scheme";
import type { RecordUpdateMessage, ServerEvents } from "~/utils/serverEvents";
import { serverSubject } from "~/utils/serverEvents";

export type MessageType = RecordUpdateMessage;

export function loader({ request, params }: LoaderArgs) {
  const recordId = invariant(idScheme, params.recordId, { status: 404 });

  return createEventSource<MessageType>(
    request,
    serverSubject.pipe(
      filter(
        (message): message is Extract<ServerEvents, { type: "RecordUpdate" }> =>
          message.type === "RecordUpdate" && message.message.id === recordId
      ),
      map(({ message }) => message)
    )
  );
}
