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
import { Avatar, Button, Input } from "@arco-design/web-react";
import type { ChatMessageWithUser } from "~/utils/ws.types";
import { IconUser } from "@arco-design/web-react/icon";

export const meta: MetaFunction<LoaderData> = ({ data }) => ({
  title: `聊天室: ${data?.room.name} - HITwh OJ`,
});

type LoaderData = {
  self: Pick<User, "id" | "nickname" | "username" | "avatar">;
  room: Pick<ChatRoom, "id" | "name"> & {
    chatMessage: ChatMessageWithUser[];
  };
};

export const loader: LoaderFunction<LoaderData> = async ({
  request,
  params,
}) => {
  const roomId = invariant(idScheme, params.roomId, {
    status: 404,
  });

  const selfId = await findSessionUid(request);
  if (!selfId) {
    throw redirect("/login");
  }

  const self = (await db.user.findUnique({
    where: { id: selfId },
    select: { id: true, nickname: true, username: true, avatar: true },
  }))!;

  const userInChatRoom = await db.userInChatRoom.findUnique({
    where: {
      roomId_userId: {
        roomId: roomId,
        userId: selfId,
      },
    },
    select: { role: true },
  });

  // 如果用户还没有加入聊天室，则跳转到加入聊天室页面
  if (!userInChatRoom) {
    throw redirect(`/chat/room/${roomId}/enter`);
  }

  const room = await db.chatRoom.findUnique({
    where: { id: roomId },
    select: {
      id: true,
      name: true,
      chatMessage: {
        orderBy: { sentAt: "asc" },
        include: {
          sender: {
            select: {
              id: true,
              avatar: true,
              nickname: true,
              username: true,
              enteredChatRoom: {
                where: { roomId },
                select: { role: true },
              },
            },
          },
        },
      },
    },
  });

  if (!room) {
    throw new Response("Room not found", { status: 404 });
  }

  return { self, room };
};

export default function ChatRoomIndex() {
  const { self, room } = useLoaderData<LoaderData>();
  const [messages, setMessages] = useState<ChatMessageWithUser[]>(
    room.chatMessage
  );
  const wsc = useContext(WsContext);

  useEffect(() => {
    setMessages(room.chatMessage);
  }, [room.chatMessage]);

  useEffect(() => {
    const subscription = wsc?.subscribeRoom(room.id).subscribe((msg) => {
      setMessages((prev) => [...prev, msg]);
    });
    return () => subscription?.unsubscribe();
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
        {messages.map((message, index, array) => {
          const role = message.sender.enteredChatRoom.at(0)?.role;
          const date = new Date(message.sentAt);
          const time = [
            date.getHours().toString().padStart(2, "0"),
            date.getMinutes().toString().padStart(2, "0"),
            date.getSeconds().toString().padStart(2, "0"),
          ].join(":");
          // 是同一个人的连续第一次发言
          const isFirst =
            index === 0 || message.sender.id !== array[index - 1].sender.id;
          // 是同一个人的连续最后一次发言
          const isLast =
            index === array.length - 1 ||
            message.sender.id !== array[index + 1].sender.id;

          return (
            <div
              key={message.id}
              className={`chat-content-message ${
                message.sender.id === self.id ? "right" : "left"
              }`}
            >
              <div className="chat-content-message-avatar">
                {isLast && (
                  <Link to={`/user/${message.sender.id}`}>
                    <Avatar>
                      {message.sender.avatar ? (
                        <img
                          src={message.sender.avatar}
                          alt={
                            message.sender.nickname || message.sender.username
                          }
                        />
                      ) : (
                        <IconUser />
                      )}
                    </Avatar>
                  </Link>
                )}
              </div>
              <div className="chat-content-message-bubble">
                {isFirst && (
                  <header>
                    <Link
                      to={`/user/${message.sender.id}`}
                      className="member-name"
                    >
                      {message.sender.nickname || message.sender.username}
                    </Link>
                    {(role === "Owner" || role === "Admin") && (
                      <span className="member-role">{role}</span>
                    )}
                  </header>
                )}
                <span>{message.content}</span>
                <time title={date.toLocaleString()}>{time}</time>
              </div>
            </div>
          );
        })}
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
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                if (!e.ctrlKey) submitRef.current?.click();
                else setContent((content) => content + "\n");
              }
            }}
            disabled={isFetching}
            required
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

export const action: ActionFunction = async ({ request, context }) => {
  const self = await findSessionUid(request);
  if (!self) {
    throw redirect("/login");
  }

  const form = await request.formData();
  const roomId = invariant(idScheme, form.get("roomId"));
  const content = invariant(contentScheme, form.get("content"));

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

  const ws = context.wss as WsServer;
  ws.sendChatMessage(message);

  return null;
};

export { CatchBoundary } from "~/src/CatchBoundary";
export { ErrorBoundary } from "~/src/ErrorBoundary";
