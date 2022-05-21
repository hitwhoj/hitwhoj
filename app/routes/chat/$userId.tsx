import type {
  ActionFunction,
  LoaderFunction,
  MetaFunction,
} from "@remix-run/node";
import { redirect, Response } from "@remix-run/node";
import {
  Button,
  Card,
  Input,
  List,
  Notification,
} from "@arco-design/web-react";
import type { Message, User } from "@prisma/client";
import { MessageType } from "@prisma/client";
import { findSessionUid } from "~/utils/sessions";
import { invariant } from "~/utils/invariant";
import { contentScheme, idScheme } from "~/utils/scheme";
import { db } from "~/utils/server/db.server";
import { Form, useLoaderData } from "@remix-run/react";
import { useContext, useEffect, useState } from "react";
import { WsContext } from "~/utils/context/ws";
import type { WsServer } from "server/ws.server";

export const meta: MetaFunction = () => ({
  title: "聊天 - HITwh OJ",
});

type LoaderData = {
  self: Pick<User, "id" | "username" | "avatar">;
  toUser: Pick<User, "id" | "username" | "avatar">;
  msgs: Message[];
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
    select: { id: true, username: true, avatar: true },
  });
  if (!self) {
    throw redirect("/register");
  }

  const toUserId = invariant(idScheme.safeParse(params.userId), {
    status: 404,
  });
  const toUser = await db.user.findUnique({
    where: { id: toUserId },
    select: { id: true, avatar: true, username: true },
  });
  if (!toUser) {
    throw new Response("User not found", { status: 404 });
  }

  const msgs = await db.message.findMany({
    where: {
      OR: [
        { from: self?.id, to: toUser.id },
        { from: toUser.id, to: self?.id },
      ],
    },
  });

  return { self, toUser, msgs };
};

export const action: ActionFunction<Response> = async ({
  request,
  context,
}) => {
  const self = await findSessionUid(request);
  if (!self) {
    throw redirect("/login");
  }

  const form = await request.formData();
  const to = invariant(idScheme.safeParse(form.get("to")));
  const content = invariant(contentScheme.safeParse(form.get("content")));

  const message = await db.message.create({
    data: {
      from: self,
      to: to,
      content: content,
    },
  });

  // 获取到服务器的 WebSocket 实例
  const ws: WsServer = context.wsServer;
  ws.sendMessage(message);

  return new Response("ok", { status: 200 });
};

export default function ChatIndex() {
  const { self, toUser, msgs } = useLoaderData<LoaderData>();
  const [messages, setMessages] = useState<Message[]>(msgs);
  const wsc = useContext(WsContext);
  useEffect(() => {
    setMessages(msgs);
  }, [msgs]);
  useEffect(() => {
    const handlePrivateMessage = (data: Message) => {
      Notification.info({
        title: `user ${data.from} send a private message to you`,
        content: data.content,
      });
      setMessages([...messages, data]);
    };
    wsc?.handleMessage(MessageType.Private, handlePrivateMessage);
    return () => {
      wsc?.unhandleMessage(MessageType.Private, handlePrivateMessage);
    };
  });

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "100%",
        width: "100%",
        backgroundColor: "var(--color-fill-2)",
      }}
    >
      <Card
        title={"chat: " + toUser.username}
        style={{
          width: "80%",
          height: "90%",
        }}
        bodyStyle={{
          display: "flex",
          flexFlow: "column",
        }}
      >
        <List
          size="small"
          style={{
            height: "350px",
            marginBottom: "20px",
          }}
          dataSource={messages}
          render={(item) => (
            <List.Item
              key={item.id}
              style={{
                display: "flex",
                flexFlow: "row",
                alignItems: "center",
              }}
            >
              <div
                style={{
                  display: "inline-block",
                  margin: "0",
                  height: "40px",
                }}
              >
                <img
                  src={item.from == self.id ? self.avatar : toUser.avatar}
                  alt="avatar"
                  style={{
                    width: "40px",
                    height: "40px",
                    borderRadius: "50%",
                    display: "inline-block",
                  }}
                />
                <p
                  style={{
                    display: "inline-block",
                    fontWeight: "bold",
                  }}
                >
                  {item.from == self.id ? self.username : toUser.username}
                </p>

                <p
                  style={{
                    display: "inline-block",
                    marginLeft: "10px",
                    fontSize: "0.8em",
                    color: "var(--color-text-2)",
                  }}
                >
                  {new Date(item.time).toLocaleString("zh")}
                </p>
              </div>
              <div
                style={{
                  fontSize: "1em",
                }}
              >
                {item.content}
              </div>
            </List.Item>
          )}
        ></List>
        <div
          style={{
            height: "140px",
          }}
        >
          <Form method="post">
            <Input.TextArea
              placeholder="input your message"
              name="content"
              maxLength={255}
              showWordLimit
              allowClear
              wrapperStyle={{
                marginBottom: "5px",
              }}
              style={{
                resize: "none",
                height: "110px",
              }}
            />
            <input type="hidden" name="to" value={toUser.id} />
            <Button
              type="primary"
              htmlType="submit"
              size="small"
              style={{
                float: "right",
              }}
            >
              send
            </Button>
          </Form>
        </div>
      </Card>
    </div>
  );
}
