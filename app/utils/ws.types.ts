import type {
  ChatMessage,
  PrivateMessage,
  User,
  UserInChatRoom,
} from "@prisma/client";

export type PrivateMessageWithUser = PrivateMessage & {
  from: Pick<User, "id" | "username" | "nickname" | "avatar">;
  to: Pick<User, "id" | "username" | "nickname" | "avatar">;
};

export type ChatMessageWithUser = ChatMessage & {
  sender: Pick<User, "id" | "avatar" | "nickname" | "username"> & {
    enteredChatRoom: Pick<UserInChatRoom, "role">[];
  };
};

export type WebSocketMessage =
  | {
      type: "PrivateMessage";
      message: PrivateMessageWithUser;
    }
  | {
      type: "ChatMessage";
      message: ChatMessageWithUser;
    };
