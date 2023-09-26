import type { LoaderArgs, SerializeFrom } from "@remix-run/node";
import { filter } from "rxjs";
import { createEventSource } from "~/utils/eventSource";
import { invariant } from "~/utils/invariant";
import { idScheme } from "~/utils/scheme";
import { recordUpdateSubject } from "~/utils/serverEvents";

const observer = recordUpdateSubject.asObservable();

export async function loader({ request, params }: LoaderArgs) {
  const recordId = invariant(idScheme, params.recordId, { status: 404 });

  // FIXME: 权限检查

  return createEventSource(
    request,
    observer.pipe(
      // 过滤掉不是当前记录的更新
      filter(({ id }) => id === recordId)
    )
  );
}

export type MessageType = SerializeFrom<typeof loader>;
