import type { PrivateMessage, User } from "@prisma/client";

export type PrivateMessageWithUser = PrivateMessage & {
  from: Pick<User, "id" | "username" | "nickname" | "avatar">;
  to: Pick<User, "id" | "username" | "nickname" | "avatar">;
};

// TODO: add group message
export type WebSocketMessage = {
  type: "PrivateMessage";
  message: PrivateMessageWithUser;
};
