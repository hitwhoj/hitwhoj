import type { Observable } from "rxjs";
import { filter } from "rxjs";
import { map } from "rxjs";
import { of, share } from "rxjs";
import type { WebSocketSubject } from "rxjs/webSocket";
import { webSocket } from "rxjs/webSocket";
import type { PrivateMessageWithUser, WebSocketMessage } from "./ws.types";

export class WsClient {
  #subject: WebSocketSubject<WebSocketMessage>;

  /** 用户私信的推送 */
  privateMessages: Observable<PrivateMessageWithUser>;

  constructor(userId?: number | undefined) {
    this.#subject = webSocket<WebSocketMessage>(`ws://${location.host}`);

    this.privateMessages = userId
      ? // 使用 RxJS 的多路复用技术来订阅用户私聊消息的推送
        this.#subject
          .multiplex(
            () => ({ subscribe: `/user/${userId}` }),
            () => ({ unsubscribe: `/user/${userId}` }),
            (message) => message.type === "PrivateMessage"
          )
          .pipe(
            filter(
              (
                message
              ): message is Extract<
                WebSocketMessage,
                { type: "PrivateMessage" }
              > => message.type === "PrivateMessage"
            ),
            map((message) => message.message),
            // RxJS 的 multiplex 会对每次的 subscribe 和 unsubscribe 都发送一遍订阅和取消订阅消息，
            // 这会导致某个订阅的 unsubscribe 消息会把其他订阅全都取消掉。
            // https://rxjs.dev/api/webSocket/webSocket
            // 为了防止这种情况，我们用 share 函数把消息复制一份。
            // 经过 share 之后对于原订阅只会进行一次 subscribe。
            // https://rxjs.dev/api/index/function/share
            share()
          )
      : // 如果当前用户没有登录，则不进行订阅
        of();
  }

  subscribeRoom(roomId: number) {
    return this.#subject
      .multiplex(
        () => ({ subscribe: `/room/${roomId}` }),
        () => ({ unsubscribe: `/room/${roomId}` }),
        (message) =>
          message.type === "ChatMessage" && message.message.roomId === roomId
      )
      .pipe(
        filter(
          (
            message
          ): message is Extract<WebSocketMessage, { type: "ChatMessage" }> =>
            message.type === "ChatMessage"
        ),
        map((message) => message.message),
        share()
      );
  }

  close() {
    this.#subject.complete();
  }
}
