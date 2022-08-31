// TODO: 这是服务器全部事件推送服务的中枢！
// 但是目前没法做到边缘化计算，因此只能将网站部署在一台服务器上。
// 如果采用 RabbitMQ 之类的技术，也许可以实现边缘化计算。

import type {
  ChatMessage,
  PrivateMessage,
  Record,
  User,
  ChatRoomUser,
} from "@prisma/client";
import { Subject } from "rxjs";
import type { UserData } from "./db/user";

export type PrivateMessageWithUser = PrivateMessage & {
  from: UserData;
  to: UserData;
};

export const privateMessageSubject = new Subject<PrivateMessageWithUser>();

export type ChatMessageWithUser = ChatMessage & {
  sender: Pick<User, "id" | "avatar" | "nickname" | "username"> & {
    enteredChatRoom: Pick<ChatRoomUser, "role">[];
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
