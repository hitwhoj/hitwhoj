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

export type ChatMessageWithUser = ChatMessage & {
  sender: Pick<User, "id" | "avatar" | "nickname" | "username"> & {
    enteredChatRoom: Pick<UserInChatRoom, "role">[];
  };
};

export type RecordUpdateMessage = Pick<
  Record,
  "id" | "time" | "memory" | "status" | "message" | "subtasks"
>;

export type ContestRecordUpdateMessage = Pick<
  Record,
  | "id"
  | "time"
  | "score"
  | "memory"
  | "status"
  | "contestId"
  | "problemId"
  | "submitterId"
>;

export type ServerEvents =
  | {
      type: "PrivateMessage";
      message: PrivateMessageWithUser;
    }
  | {
      type: "ChatMessage";
      message: ChatMessageWithUser;
    }
  | {
      type: "RecordUpdate";
      message: RecordUpdateMessage;
    }
  | {
      type: "ContestRecordUpdate";
      message: ContestRecordUpdateMessage;
    };

/**
 * 服务器所有事件的中枢
 *
 * TODO: 可以考虑如何把他变得可以分布式部署
 */
export const serverSubject = new Subject<ServerEvents>();
