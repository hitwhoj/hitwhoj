import type { LoaderFunction } from "@remix-run/node";
import { filter } from "rxjs";
import { createEventSource } from "~/utils/eventSource";
import { invariant } from "~/utils/invariant";
import { idScheme } from "~/utils/scheme";
import type { RecordUpdateMessage } from "~/utils/serverEvents";
import { recordUpdateSubject } from "~/utils/serverEvents";
import { findSessionUser } from "~/utils/sessions";

export type MessageType = RecordUpdateMessage;

// 用户订阅自己在某场比赛中的全部提交更新信息
export const loader: LoaderFunction<Response> = async ({ request, params }) => {
  const contestId = invariant(idScheme, params.contestId, { status: 404 });
  const self = await findSessionUser(request);

  // FIXME: 权限检查

  return createEventSource(
    request,
    recordUpdateSubject.pipe(
      filter(
        (message) =>
          message.contestId === contestId && message.submitterId === self.id
      )
      // FIXME: 应该再加一点筛选
    )
  );
};
