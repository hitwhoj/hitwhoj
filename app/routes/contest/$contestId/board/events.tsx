import type { LoaderArgs, SerializeFrom } from "@remix-run/node";
import { filter, from, mergeMap } from "rxjs";
import { selectUserData } from "~/utils/db/user";
import { createEventSource } from "~/utils/eventSource";
import { invariant } from "~/utils/invariant";
import { idScheme } from "~/utils/scheme";
import { db } from "~/utils/server/db.server";
import { recordFinishSubject } from "~/utils/serverEvents";
import { isNotNull } from "~/utils/tools";

const observable = recordFinishSubject.pipe(
  mergeMap((id) =>
    from(
      db.record.findUnique({
        where: { id },
        select: {
          id: true,
          status: true,
          submittedAt: true,
          problemId: true,
          submitter: { select: { ...selectUserData } },
          contestId: true,
        },
      })
    )
  ),
  filter(isNotNull)
);

export function loader({ request, params }: LoaderArgs) {
  const contestId = invariant(idScheme, params.contestId, { status: 404 });
  return createEventSource(
    request,
    observable.pipe(
      // filter this contest submit
      filter((record) => record.contestId === contestId)
    )
  );
}

export type MessageType = SerializeFrom<typeof loader>;
