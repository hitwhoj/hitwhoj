// TODO: 这是服务器全部事件推送服务的中枢！
// 但是目前没法做到边缘化计算，因此只能将网站部署在一台服务器上。
// 如果采用 RabbitMQ 之类的技术，也许可以实现边缘化计算。

import type {
  ChatMessage,
  PrivateMessage,
  Record,
  User,
  UserInChatRoom,
} from "@prisma/client";
import { Subject } from "rxjs";

export type PrivateMessageWithUser = PrivateMessage & {
  from: Pick<User, "id" | "username" | "nickname" | "avatar">;
  to: Pick<User, "id" | "username" | "nickname" | "avatar">;
};

export const privateMessageSubject = new Subject<PrivateMessageWithUser>();

export type ChatMessageWithUser = ChatMessage & {
  sender: Pick<User, "id" | "avatar" | "nickname" | "username"> & {
    enteredChatRoom: Pick<UserInChatRoom, "role">[];
  };
};

export const chatMessageSubject = new Subject<ChatMessageWithUser>();

export type RecordUpdateMessage = Pick<
  Record,
  | "id"
  | "time"
  | "score"
  | "memory"
  | "status"
  | "message"
  | "subtasks"
  | "contestId"
  | "problemId"
  | "submitterId"
>;

export const recordUpdateSubject = new Subject<RecordUpdateMessage>();
