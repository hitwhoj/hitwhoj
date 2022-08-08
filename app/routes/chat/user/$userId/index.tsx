import type {
  ActionFunction,
  LoaderFunction,
  MetaFunction,
} from "@remix-run/node";
import { redirect } from "@remix-run/node";
import { Button, Empty, Input } from "@arco-design/web-react";
import type { User } from "@prisma/client";
import { invariant } from "~/utils/invariant";
import { contentScheme, idScheme } from "~/utils/scheme";
import { db } from "~/utils/server/db.server";
import { Form, useLoaderData, useTransition } from "@remix-run/react";
import { useEffect, useState, useRef, useContext } from "react";
import { UserAvatar } from "~/src/user/UserAvatar";
import type { MessageType } from "./events";
import type { PrivateMessageWithUser } from "~/utils/serverEvents";
import { privateMessageSubject } from "~/utils/serverEvents";
import { findRequestUser } from "~/utils/permission";
import { selectUserData } from "~/utils/db/user";
import { UserContext } from "~/utils/context/user";

type LoaderData = {
  target: Pick<User, "username" | "nickname" | "id">;
  msgs: PrivateMessageWithUser[];
};

export const meta: MetaFunction<LoaderData> = ({ data }) => ({
  title: `聊天: ${data?.target.nickname || data?.target.username} - HITwh OJ`,
});

export const loader: LoaderFunction<LoaderData> = async ({
  request,
  params,
}) => {
  const userId = invariant(idScheme, params.userId, { status: 404 });
  const self = await findRequestUser(request);
  if (!self.userId) {
    throw redirect("/login");
  }

  const target = await db.user.findUnique({
    where: { id: userId },
    select: { nickname: true, username: true, id: true },
  });

  if (!target) {
    throw new Response("User not exists", { status: 404 });
  }

  const msgs = await db.privateMessage.findMany({
    where: {
      OR: [
        { fromId: self.userId, toId: userId },
        { fromId: userId, toId: self.userId },
      ],
    },
    orderBy: {
      sentAt: "asc",
    },
    include: {
      from: { select: selectUserData },
      to: { select: selectUserData },
    },
  });

  return { target, msgs };
};

export const action: ActionFunction = async ({ request }) => {
  const self = await findRequestUser(request);
  if (!self.userId) {
    throw redirect("/login");
  }

  const form = await request.formData();
  const to = invariant(idScheme, form.get("to"));
  const content = invariant(contentScheme, form.get("content"));

  const message = await db.privateMessage.create({
    data: {
      from: { connect: { id: self.userId } },
      to: { connect: { id: to } },
      content: content,
    },
    include: {
      from: {
        select: {
          id: true,
          username: true,
          nickname: true,
          avatar: true,
        },
      },
      to: {
        select: {
          id: true,
          username: true,
          nickname: true,
          avatar: true,
        },
      },
    },
  });

  privateMessageSubject.next(message);

  return null;
};

export default function ChatIndex() {
  const { target, msgs } = useLoaderData<LoaderData>();
  const [messages, setMessages] = useState<PrivateMessageWithUser[]>(msgs);

  useEffect(() => {
    setMessages(msgs);
  }, [msgs]);

  useEffect(() => {
    const eventSource = new EventSource(`./${target.id}/events`);
    eventSource.addEventListener("message", ({ data }) => {
      const message: MessageType = JSON.parse(data);
      setMessages((messages) => [...messages, message]);
    });

    return () => eventSource.close();
  }, [target.id]);

  const formRef = useRef<HTMLFormElement>(null);
  const submitRef = useRef<HTMLButtonElement>(null);
  const { state } = useTransition();
  const isFetching = state !== "idle";

  const [message, setMessage] = useState("");
  useEffect(() => {
    if (!isFetching) {
      setMessage("");
    }
  }, [isFetching]);

  const self = useContext(UserContext);

  return (
    <div>
      <header style={{ fontSize: "1.5em" }}>
        用户：{target.nickname || target.username}
      </header>
      <div className="chat-content-main">
        {messages.length > 0 ? (
          messages.map((message, index, array) => {
            const date = new Date(message.sentAt);
            const time = [
              date.getHours().toString().padStart(2, "0"),
              date.getMinutes().toString().padStart(2, "0"),
              date.getSeconds().toString().padStart(2, "0"),
            ].join(":");

            // 是否是连续同一个人发送的最后一条消息
            const isLast =
              index === array.length - 1 ||
              array[index + 1].fromId !== message.fromId;

            return (
              <div
                key={message.id}
                className={`chat-content-message ${
                  message.from.id === self ? "right" : "left"
                }`}
              >
                <div className="chat-content-message-avatar">
                  {isLast && <UserAvatar user={message.from} />}
                </div>
                <div className="chat-content-message-bubble">
                  <span>{message.content}</span>
                  <time title={date.toLocaleString()}>{time}</time>
                </div>
              </div>
            );
          })
        ) : (
          <Empty description="快来跟 TA 打个招呼吧" />
        )}
      </div>
      <footer>
        <Form
          method="post"
          ref={formRef}
          style={{ display: "flex", gap: "10px", alignItems: "end" }}
        >
          <input type="hidden" name="to" value={target.id} />
          <Input.TextArea
            placeholder="输入消息..."
            name="content"
            maxLength={255}
            showWordLimit
            autoSize={{ minRows: 1, maxRows: 5 }}
            value={message}
            onChange={(msg) => setMessage(msg)}
            style={{ flex: 1, height: "32px" }}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                if (!e.ctrlKey) submitRef.current?.click();
                else setMessage((message) => message + "\n");
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

export { CatchBoundary } from "~/src/CatchBoundary";
export { ErrorBoundary } from "~/src/ErrorBoundary";
