// TODO 这是服务器全部事件推送服务的中枢！
// 但是目前没法做到边缘化计算，因此只能将网站部署在一台服务器上。
// 如果采用 RabbitMQ 之类的技术，也许可以实现边缘化计算。

import { Subject } from "rxjs";

export const privateMessageSubject = new Subject<number>();
export const chatMessageSubject = new Subject<number>();
/** 有更新的评测记录 id 流 */
export const recordUpdateSubject = new Subject<number>();
export const clarificationResolveSubject = new Subject<number>();
export const clarificationAssignSubject = new Subject<number>();
export const clarificationReplySubject = new Subject<number>();
