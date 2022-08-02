import type { LoaderFunction } from "@remix-run/node";
import { filter } from "rxjs";
import { createEventSource } from "~/utils/eventSource";
import { invariant } from "~/utils/invariant";
import { idScheme } from "~/utils/scheme";
import type { RecordUpdateMessage } from "~/utils/serverEvents";
import { recordUpdateSubject } from "~/utils/serverEvents";

export type MessageType = RecordUpdateMessage;

// 订阅某一个 Record 的评测更新状态
export const loader: LoaderFunction<Response> = async ({ request, params }) => {
  const recordId = invariant(idScheme, params.recordId, { status: 404 });

  // FIXME: 权限检查

  return createEventSource<MessageType>(
    request,
    recordUpdateSubject.pipe(
      // 过滤掉不是该 Record 的消息
      filter((message) => message.id === recordId)
      // FIXME: 应该再按照权限筛选一遍字段
    )
  );
};
