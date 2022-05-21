import type { Message } from "@prisma/client";
import type { Observable } from "rxjs";
import { of, share } from "rxjs";
import type { WebSocketSubject } from "rxjs/webSocket";
import { webSocket } from "rxjs/webSocket";

export class WsClient {
  #subject: WebSocketSubject<Message>;
  message: Observable<Message>;

  constructor(userId?: number | undefined) {
    this.#subject = webSocket<Message>(`ws://${location.host}`);
    const rank = Math.random();
    this.message = userId
      ? // 使用 RxJS 的多路复用技术来订阅用户私聊消息的推送
        this.#subject
          .multiplex(
            () => ({ subscribe: `/user/${userId}`, rank }),
            () => ({ unsubscribe: `/user/${userId}`, rank }),
            () => true
          )
          // RxJS 的 multiplex 会对每次的 subscribe 和 unsubscribe 都发送一遍订阅和取消订阅消息，
          // 这会导致某个订阅的 unsubscribe 消息会把其他订阅全都取消掉。
          // https://rxjs.dev/api/webSocket/webSocket
          // 为了防止这种情况，我们用 share 函数把消息复制一份。
          // 经过 share 之后对于原订阅只会进行一次 subscribe。
          // https://rxjs.dev/api/index/function/share
          .pipe(share())
      : // 如果当前用户没有登录，则不进行订阅
        of();
  }

  close() {
    this.#subject.complete();
  }
}
