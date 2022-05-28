import type {
  ActionFunction,
  LoaderFunction,
  MetaFunction,
} from "@remix-run/node";
import { redirect, Response } from "@remix-run/node";
import { Button, Input } from "@arco-design/web-react";
import type { User, PrivateMessage } from "@prisma/client";
import { findSessionUid } from "~/utils/sessions";
import { invariant } from "~/utils/invariant";
import { contentScheme, idScheme } from "~/utils/scheme";
import { db } from "~/utils/server/db.server";
import { Form, useLoaderData, useTransition } from "@remix-run/react";
import { useContext, useEffect, useState, useRef } from "react";
import { WsContext } from "~/utils/context/ws";
import type { WsServer } from "server/ws.server";

type LoaderData = {
  self: Pick<User, "id" | "nickname" | "username" | "avatar">;
  target: Pick<User, "id" | "nickname" | "username" | "avatar">;
  msgs: PrivateMessage[];
};

export const meta: MetaFunction<LoaderData> = ({ data }) => ({
  title: `聊天: ${data?.target.nickname || data?.target.username} - HITwh OJ`,
});

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

  const toUserId = invariant(idScheme.safeParse(params.userId), {
    status: 404,
  });
  const target = await db.user.findUnique({
    where: { id: toUserId },
    select: { id: true, nickname: true, avatar: true, username: true },
  });

  if (!target) {
    throw new Response("User not found", { status: 404 });
  }

  const msgs = await db.privateMessage.findMany({
    where: {
      OR: [
        { fromId: self?.id, toId: target.id },
        { fromId: target.id, toId: self?.id },
      ],
    },
    orderBy: {
      sentAt: "asc",
    },
  });

  return { self, target, msgs };
};

export const action: ActionFunction = async ({ request, context }) => {
  const self = await findSessionUid(request);
  if (!self) {
    throw redirect("/login");
  }

  const form = await request.formData();
  const to = invariant(idScheme.safeParse(form.get("to")));
  const content = invariant(contentScheme.safeParse(form.get("content")));

  const message = await db.privateMessage.create({
    data: {
      from: { connect: { id: self } },
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

  // 获取到服务器的 WebSocket 实例
  const ws = context.wsServer as WsServer;
  // 推送私聊消息给对方
  ws.sendPrivateMessage(message);

  return null;
};

export default function ChatIndex() {
  const { self, target, msgs } = useLoaderData<LoaderData>();
  const [messages, setMessages] = useState<PrivateMessage[]>(msgs);
  const wsc = useContext(WsContext);

  useEffect(() => {
    setMessages(msgs);
  }, [msgs]);

  useEffect(() => {
    const subscription = wsc?.privateMessages.subscribe((data) => {
      // 如果消息是当前页面，则更新消息
      if (data.from.id === target.id) {
        setMessages((messages) => [...messages, data]);
      }
    });

    return () => subscription?.unsubscribe();
  }, [wsc, target.id]);

  const formRef = useRef<HTMLFormElement>(null);
  const submitRef = useRef<HTMLButtonElement>(null);
  const { state } = useTransition();
  const isFetching = state !== "idle";

  // 我想超市这个傻逼的 arco-design，ref 一定要自己套一层是吧
  const textareaRef = useRef<{ dom: HTMLTextAreaElement }>(null);
  // 发送之后清空输入框
  useEffect(() => {
    if (!isFetching) {
      formRef.current?.reset();
      if (textareaRef.current) {
        textareaRef.current.dom.value = "";
      }
      // 傻逼 arco-design 我草我清除了他居然还会给我变回来
      // 一定要我再清除一次😅😅😅
      setTimeout(() => {
        if (textareaRef.current) {
          textareaRef.current.dom.value = "";
        }
      }, 0);
    }
  }, [isFetching]);

  return (
    <div className="chat-content-container">
      <header style={{ fontSize: "1.5em" }}>
        {target.nickname || target.username}
      </header>
      <div className="chat-content-main">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`chat-content-message ${
              message.fromId === self.id ? "right" : "left"
            }`}
          >
            <div className="chat-content-message-bubble">{message.content}</div>
          </div>
        ))}
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
            ref={textareaRef}
            style={{ flex: 1, height: "32px" }}
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

export { CatchBoundary } from "~/src/CatchBoundary";
export { ErrorBoundary } from "~/src/ErrorBoundary";
