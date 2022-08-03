import type {
  ActionFunction,
  LoaderFunction,
  MetaFunction,
} from "@remix-run/node";
import { redirect } from "@remix-run/node";
import type { ChatRoom } from "@prisma/client";
import { db } from "~/utils/server/db.server";
import { invariant } from "~/utils/invariant";
import { contentScheme, idScheme } from "~/utils/scheme";
import { Form, Link, useLoaderData, useTransition } from "@remix-run/react";
import { useContext, useEffect, useRef, useState } from "react";
import { Button, Input } from "@arco-design/web-react";
import { UserAvatar } from "~/src/user/UserAvatar";
import type { ChatMessageWithUser } from "~/utils/serverEvents";
import { chatMessageSubject } from "~/utils/serverEvents";
import type { MessageType } from "./events";
import { findRequestUser } from "~/utils/permission";
import { UserContext } from "~/utils/context/user";

export const meta: MetaFunction<LoaderData> = ({ data }) => ({
  title: `聊天室: ${data?.room.name} - HITwh OJ`,
});

type LoaderData = {
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

  const self = await findRequestUser(request);
  if (!self.userId) {
    throw redirect("/login");
  }

  const userInChatRoom = await db.userInChatRoom.findUnique({
    where: {
      roomId_userId: {
        roomId: roomId,
        userId: self.userId,
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
  const { room } = useLoaderData<LoaderData>();
  const [messages, setMessages] = useState<ChatMessageWithUser[]>(
    room.chatMessage
  );

  useEffect(() => {
    setMessages(room.chatMessage);
  }, [room.chatMessage]);

  useEffect(() => {
    const eventSource = new EventSource(`./${room.id}/events`);
    eventSource.addEventListener("message", ({ data }) => {
      const message: MessageType = JSON.parse(data);
      setMessages((prev) => [...prev, message]);
    });
    return () => eventSource.close();
  }, [room.id]);

  const submitRef = useRef<HTMLButtonElement>(null);
  const [content, setContent] = useState<string>("");
  const { state } = useTransition();
  const isFetching = state !== "idle";

  useEffect(() => {
    if (!isFetching) {
      setContent("");
    }
  }, [isFetching]);

  const self = useContext(UserContext);

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
                message.sender.id === self ? "right" : "left"
              }`}
            >
              <div className="chat-content-message-avatar">
                {isLast && (
                  <Link to={`/user/${message.sender.id}`}>
                    <UserAvatar user={message.sender} />
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

export const action: ActionFunction = async ({ request }) => {
  const self = await findRequestUser(request);
  if (!self.userId) {
    throw redirect("/login");
  }

  const form = await request.formData();
  const roomId = invariant(idScheme, form.get("roomId"));
  const content = invariant(contentScheme, form.get("content"));

  const userInChatRoom = await db.userInChatRoom.findUnique({
    where: {
      roomId_userId: {
        roomId: roomId,
        userId: self.userId,
      },
    },
  });
  if (!userInChatRoom) {
    throw new Response("You are not in this room", { status: 403 });
  }

  const message = await db.chatMessage.create({
    data: {
      roomId: roomId,
      senderId: self.userId,
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

  // 推送新的消息
  chatMessageSubject.next(message);

  return null;
};

export { CatchBoundary } from "~/src/CatchBoundary";
export { ErrorBoundary } from "~/src/ErrorBoundary";
