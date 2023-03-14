// TODO 这是服务器全部事件推送服务的中枢！
// 但是目前没法做到边缘化计算，因此只能将网站部署在一台服务器上。
// 如果采用 RabbitMQ 之类的技术，也许可以实现边缘化计算。

import { Subject } from "rxjs";
import type { Record } from "@prisma/client";

export type RecordUpdateMessage = Pick<
  Record,
  "id" | "status" | "score" | "message" | "time" | "memory" | "subtasks"
>;

/**
 * 私人消息推送
 */
export const privateMessageSubject = new Subject<number>();

/**
 * 群聊消息推送
 */
export const chatMessageSubject = new Subject<number>();

/**
 * 提交记录更新
 *
 * 注意：这个仅作 judge 收到的 Progress 包的转发，不包含任何数据库的更新
 */
export const recordUpdateSubject = new Subject<RecordUpdateMessage>();

/**
 * 提交结果更新
 */
export const recordFinishSubject = new Subject<number>();

/**
 * 反馈解决推送
 */
export const clarificationResolveSubject = new Subject<number>();
/**
 * 反馈认领推送
 */
export const clarificationAssignSubject = new Subject<number>();
/**
 * 反馈回复推送
 */
export const clarificationReplySubject = new Subject<number>();
