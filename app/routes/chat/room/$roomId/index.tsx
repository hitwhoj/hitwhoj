import type {
  ActionArgs,
  LinksFunction,
  LoaderArgs,
  MetaFunction,
} from "@remix-run/node";
import { json } from "@remix-run/node";
import { redirect } from "@remix-run/node";
import { db } from "~/utils/server/db.server";
import { invariant } from "~/utils/invariant";
import { contentScheme, idScheme } from "~/utils/scheme";
import { Form, Link, useLoaderData, useTransition } from "@remix-run/react";
import { useContext, useEffect, useRef, useState } from "react";
import { Button, Input, Typography } from "@arco-design/web-react";
import { UserAvatar } from "~/src/user/UserAvatar";
import { chatMessageSubject } from "~/utils/serverEvents";
import type { MessageType } from "./events";
import { fromEventSource } from "~/utils/eventSource";
import { findRequestUser } from "~/utils/permission";
import { UserContext } from "~/utils/context/user";
import { ChatMessage } from "~/src/chat/ChatMessage";
import { ChatAvatar } from "~/src/chat/ChatAvatar";
import ChatBubble from "~/src/chat/ChatBubble";
import ChatTime from "~/src/chat/ChatTime";

import style from "~/styles/simplify.css";

export const links: LinksFunction = () => [{ rel: "stylesheet", href: style }];

export async function loader({ request, params }: LoaderArgs) {
  const roomId = invariant(idScheme, params.roomId, { status: 404 });

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

  return json({ room });
}

export const meta: MetaFunction<typeof loader> = ({ data }) => ({
  title: `聊天室: ${data?.room.name} - HITwh OJ`,
});

export default function ChatRoomIndex() {
  const { room } = useLoaderData<typeof loader>();
  const [messages, setMessages] = useState(room.chatMessage);

  useEffect(() => {
    setMessages(room.chatMessage);
  }, [room.chatMessage]);

  useEffect(() => {
    const subscription = fromEventSource<MessageType>(
      `./${room.id}/events`
    ).subscribe((message) => {
      setMessages((prev) => [...prev, message]);
    });
    return () => subscription.unsubscribe();
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
    <Typography className="flex flex-col h-full gap-2">
      <Typography.Title heading={4}>{room.name}</Typography.Title>
      <div className="flex-1 overflow-auto min-h-0">
        {messages.map((message, index, array) => {
          const role = message.sender.enteredChatRoom.at(0)?.role;
          // 是同一个人的连续第一次发言
          const isFirst =
            index === 0 || message.sender.id !== array[index - 1].sender.id;
          // 是同一个人的连续最后一次发言
          const isLast =
            index === array.length - 1 ||
            message.sender.id !== array[index + 1].sender.id;
          const isSelf = message.sender.id === self;

          return (
            <ChatMessage self={isSelf} key={message.id}>
              <ChatAvatar visible={isLast}>
                <Link to={`/user/${message.sender.id}`}>
                  <UserAvatar user={message.sender} size={35} />
                </Link>
              </ChatAvatar>
              <ChatBubble self={isSelf}>
                {isFirst && (
                  <header className="flex gap-2 justify-between">
                    <Link
                      to={`/user/${message.sender.id}`}
                      className="font-bold"
                    >
                      {message.sender.nickname || message.sender.username}
                    </Link>
                    {(role === "Owner" || role === "Admin") && (
                      <span>{role}</span>
                    )}
                  </header>
                )}
                <span>{message.content}</span>
              </ChatBubble>
              <ChatTime time={message.sentAt} />
            </ChatMessage>
          );
        })}
      </div>

      <Form method="post" className="flex gap-2 items-end">
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
    </Typography>
  );
}

export async function action({ request }: ActionArgs) {
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
}

export { CatchBoundary } from "~/src/CatchBoundary";
export { ErrorBoundary } from "~/src/ErrorBoundary";
