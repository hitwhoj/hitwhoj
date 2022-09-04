import type { ActionArgs, LoaderArgs, MetaFunction } from "@remix-run/node";
import { json } from "@remix-run/node";
import { Button, Empty, Input, Typography } from "@arco-design/web-react";
import { invariant } from "~/utils/invariant";
import { contentScheme, idScheme } from "~/utils/scheme";
import { db } from "~/utils/server/db.server";
import { Form, useLoaderData, useTransition } from "@remix-run/react";
import { useEffect, useState, useRef, useContext } from "react";
import { UserAvatar } from "~/src/user/UserAvatar";
import type { MessageType } from "./events";
import { privateMessageSubject } from "~/utils/serverEvents";
import { findRequestUser } from "~/utils/permission";
import { selectUserData } from "~/utils/db/user";
import { UserContext } from "~/utils/context/user";
import { fromEventSource } from "~/utils/eventSource";
import ChatBubble from "~/src/chat/ChatBubble";
import ChatTime from "~/src/chat/ChatTime";
import { ChatAvatar } from "~/src/chat/ChatAvatar";
import { ChatMessage } from "~/src/chat/ChatMessage";
import { Permissions } from "~/utils/permission/permission";
import { Privileges } from "~/utils/permission/privilege";

export const meta: MetaFunction<typeof loader> = ({ data }) => ({
  title: `聊天: ${data?.target.nickname || data?.target.username} - HITwh OJ`,
});

export async function loader({ request, params }: LoaderArgs) {
  const self = await findRequestUser(request);
  if (!self.userId) throw new Response("Unauthorized", { status: 401 });
  await self.checkPermission(Permissions.PERM_VIEW_USER_PM_SELF);

  const userId = invariant(idScheme, params.userId, { status: 404 });
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

  return json({ target, msgs });
}

export async function action({ request }: ActionArgs) {
  const self = await findRequestUser(request);
  if (!self.userId) throw new Response("Unauthorized", { status: 401 });
  await self.checkPrivilege(Privileges.PRIV_OPERATE);
  await self.checkPermission(Permissions.PERM_VIEW_USER_PM_SELF);

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
      from: { select: selectUserData },
      to: { select: selectUserData },
    },
  });

  privateMessageSubject.next(message);

  return null;
}

export default function ChatIndex() {
  const { target, msgs } = useLoaderData<typeof loader>();
  const [messages, setMessages] = useState(msgs);

  useEffect(() => {
    setMessages(msgs);
  }, [msgs]);

  useEffect(() => {
    const subscription = fromEventSource<MessageType>(
      `./${target.id}/events`
    ).subscribe((message) => {
      setMessages((messages) => [...messages, message]);
    });

    return () => subscription.unsubscribe();
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
    <Typography className="px-4 flex flex-col h-full gap-2">
      <Typography.Title heading={4}>
        用户：{target.nickname || target.username}
      </Typography.Title>

      <div className="flex-1 overflow-auto">
        {messages.length > 0 ? (
          messages.map((message, index, array) => {
            // 是否是连续同一个人发送的最后一条消息
            const isLast =
              index === array.length - 1 ||
              array[index + 1].fromId !== message.fromId;
            const isSelf = message.fromId === self;

            return (
              <ChatMessage self={isSelf} key={message.id}>
                <ChatAvatar visible={isLast}>
                  <UserAvatar user={message.from} />
                </ChatAvatar>
                <ChatBubble self={isSelf}>{message.content}</ChatBubble>
                <ChatTime time={message.sentAt} />
              </ChatMessage>
            );
          })
        ) : (
          <Empty description="快来跟 TA 打个招呼吧" />
        )}
      </div>

      <Form method="post" ref={formRef} className="flex gap-2 items-end">
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
    </Typography>
  );
}

export { CatchBoundary } from "~/src/CatchBoundary";
export { ErrorBoundary } from "~/src/ErrorBoundary";
