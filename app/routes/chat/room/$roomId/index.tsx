import type {
  ActionFunction,
  LoaderFunction,
  MetaFunction,
} from "@remix-run/node";
import { redirect } from "@remix-run/node";
import type { User, ChatRoom } from "@prisma/client";
import { db } from "~/utils/server/db.server";
import { findSessionUid } from "~/utils/sessions";
import { invariant } from "~/utils/invariant";
import { contentScheme, idScheme } from "~/utils/scheme";
import { Form, Link, useLoaderData, useTransition } from "@remix-run/react";
import { useContext, useEffect, useRef, useState } from "react";
import { WsContext } from "~/utils/context/ws";
import type { WsServer } from "server/ws.server";
import { Avatar, Button, Input, Tag } from "@arco-design/web-react";
import type { ChatMessageWithUser } from "~/utils/ws.types";

export const meta: MetaFunction<LoaderData> = ({ data }) => ({
  title: `聊天室: ${data?.room.name} - HITwh OJ`,
});

const roleColor = {
  Owner: "red",
  Admin: "green",
  Member: "blue",
};

type LoaderData = {
  self: Pick<User, "id" | "nickname" | "username" | "avatar">;
  room: Pick<ChatRoom, "id" | "name">;
  msgs: ChatMessageWithUser[];
};

export const loader: LoaderFunction<LoaderData> = async ({
  request,
  params,
}) => {
  const selfId = await findSessionUid(request);
  if (!selfId) {
    throw redirect("/login");
  }
  const self = await db.user.findUnique({
    where: { id: selfId },
    select: { id: true, nickname: true, username: true, avatar: true },
  });
  if (!self) {
    throw redirect("/register");
  }

  const roomId = invariant(idScheme.safeParse(params.roomId), {
    status: 404,
  });
  const room = await db.chatRoom.findUnique({
    where: { id: roomId },
    select: {
      id: true,
      name: true,
    },
  });
  if (!room) {
    throw new Response("Room not found", { status: 404 });
  }

  const userInChatRoom = await db.userInChatRoom.findFirst({
    where: {
      userId: self.id,
      roomId: room.id,
    },
    select: {
      role: true,
    },
  });
  if (!userInChatRoom) {
    throw redirect(`/chat/room/${room.id}/enter`);
  }

  const msgs = await db.chatMessage.findMany({
    where: { roomId },
    orderBy: {
      sentAt: "asc",
    },
    include: {
      sender: {
        select: {
          id: true,
          avatar: true,
          nickname: true,
          username: true,
          enteredChatRoom: {
            select: {
              role: true,
            },
            where: {
              roomId,
            },
          },
        },
      },
    },
  });

  return { self, room, msgs };
};

export default function ChatRoomIndex() {
  const { self, room, msgs } = useLoaderData<LoaderData>();
  const [messages, setMessages] = useState<ChatMessageWithUser[]>(msgs);
  const wsc = useContext(WsContext);

  useEffect(() => {
    setMessages(msgs);
  }, [msgs]);

  useEffect(() => {
    const subscription = wsc?.subscribeRoom(room.id).subscribe((msg) => {
      setMessages((prev) => [...prev, msg]);
    });
    return () => {
      subscription?.unsubscribe();
    };
  }, [wsc, room.id]);

  const submitRef = useRef<HTMLButtonElement>(null);
  const [content, setContent] = useState<string>("");
  const { state } = useTransition();
  const isFetching = state !== "idle";
  useEffect(() => {
    if (!isFetching) {
      setContent("");
    }
  }, [isFetching]);

  return (
    <div className="chat-content-container">
      <header style={{ fontSize: "1.5em" }}>{room.name}</header>
      <div className="chat-content-main">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`chat-content-message ${
              message.senderId === self.id ? "right" : "left"
            }`}
          >
            {/* TODO: finish css */}
            <Avatar className={"chat-content-message-avatar"}>
              {message.sender.avatar ? (
                <img alt="avatar" src={message.sender.avatar}></img>
              ) : (
                message.sender.nickname
              )}
            </Avatar>
            <div className="chat-content-message-content">
              <div className="chat-content-message-content-header">
                <Link
                  to={`/user/${message.senderId}`}
                  className="chat-content-message-content-header-nickname"
                >
                  {message.sender.nickname}
                </Link>
                {message.sender.enteredChatRoom.length > 0 && (
                  <Tag
                    className="chat-content-message-content-header-role"
                    color={roleColor[message.sender.enteredChatRoom[0].role]}
                    size="small"
                  >
                    {message.sender.enteredChatRoom[0].role}
                  </Tag>
                )}
                <span className="chat-content-message-content-header-sentat">
                  {toDateString(message.sentAt)}
                </span>
              </div>
              <div className="chat-content-message-content-body">
                <div className="chat-content-message-bubble">
                  {message.content}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
      <footer>
        <Form
          method="post"
          style={{ display: "flex", gap: "10px", alignItems: "end" }}
        >
          <input type="hidden" name="roomId" value={room.id} />
          <Input.TextArea
            placeholder="输入消息..."
            name="content"
            maxLength={255}
            showWordLimit
            autoSize={{ minRows: 1, maxRows: 5 }}
            style={{ flex: 1, height: "32px" }}
            value={content}
            onChange={(v) => setContent(v)}
            onPressEnter={() => submitRef.current?.click()}
            disabled={isFetching}
          />
          <Button
            type="primary"
            htmlType="submit"
            size="large"
            ref={submitRef}
            style={{ height: "32px" }}
            loading={isFetching}
          >
            发送
          </Button>
        </Form>
      </footer>
    </div>
  );
}

// format: yyyy-MM-dd hh:mm:ss
function toDateString(date: Date) {
  const d = new Date(date);
  return `${d.getFullYear()}-${
    d.getMonth() + 1
  }-${d.getDate()} ${d.getHours()}:${d.getMinutes()}:${d.getSeconds()}`;
}

export const action: ActionFunction = async ({ request, context }) => {
  const self = await findSessionUid(request);
  if (!self) {
    throw redirect("/login");
  }

  const form = await request.formData();
  const roomId = invariant(idScheme.safeParse(form.get("roomId")));
  const content = invariant(contentScheme.safeParse(form.get("content")));

  const userInChatRoom = await db.userInChatRoom.findFirst({
    where: {
      userId: self,
      roomId: roomId,
    },
  });
  if (!userInChatRoom) {
    throw new Response("You are not in this room", { status: 403 });
  }

  const message = await db.chatMessage.create({
    data: {
      roomId: roomId,
      senderId: self,
      content,
    },
    include: {
      sender: {
        select: {
          id: true,
          nickname: true,
          username: true,
          avatar: true,
          enteredChatRoom: {
            select: {
              role: true,
            },
          },
        },
      },
    },
  });

  const ws = context.wsServer as WsServer;
  ws.sendChatMessage(message);

  return null;
};

export { CatchBoundary } from "~/src/CatchBoundary";
export { ErrorBoundary } from "~/src/ErrorBoundary";
