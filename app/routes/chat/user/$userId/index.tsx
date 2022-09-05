import type { ActionArgs, LoaderArgs, MetaFunction } from "@remix-run/node";
import { json } from "@remix-run/node";
import { invariant } from "~/utils/invariant";
import { contentScheme, idScheme } from "~/utils/scheme";
import { db } from "~/utils/server/db.server";
import { Form, useLoaderData, useTransition } from "@remix-run/react";
import { useEffect, useState, useRef } from "react";
import { UserAvatar } from "~/src/user/UserAvatar";
import type { MessageType } from "./events";
import { privateMessageSubject } from "~/utils/serverEvents";
import { findRequestUser } from "~/utils/permission";
import { selectUserData } from "~/utils/db/user";
import { fromEventSource } from "~/utils/eventSource";
import { Permissions } from "~/utils/permission/permission";
import { Privileges } from "~/utils/permission/privilege";
import { HiOutlinePaperAirplane } from "react-icons/hi";
import { formatDateTime, formatTime } from "~/utils/tools";

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
  const { state, type } = useTransition();
  const isActionSubmit = state === "submitting" && type === "actionSubmission";
  const isActionReload = state === "loading" && type === "actionReload";
  const isLoading = isActionSubmit || isActionReload;

  useEffect(() => {
    if (!isActionReload) {
      formRef.current?.reset();
    }
  }, [isActionReload]);

  return (
    <div className="w-full h-full px-4">
      <h1 className="font-bold text-2xl py-4 sticky top-0 z-10 bg-base-100">
        {target.nickname || target.username}
      </h1>

      <div className="flex-1">
        {messages.length > 0 ? (
          messages.map((message, index, array) => {
            // 是否是同一个人在连续五分钟内发送的第一条消息
            const isFirst =
              index === 0 ||
              array[index - 1].fromId !== message.fromId ||
              new Date(message.sentAt).getTime() -
                new Date(array[index - 1].sentAt).getTime() >
                1000 * 60 * 5;

            return isFirst ? (
              <div
                className="flex gap-4 pt-2 px-2 hover:bg-base-200 transition"
                key={message.id}
              >
                <UserAvatar
                  className="w-12 h-12 flex-shrink-0 bg-base-300 text-2xl"
                  user={message.from}
                />
                <div className="flex-1">
                  <div className="w-full flex justify-between">
                    <span className="text-primary">
                      {message.from.nickname || message.from.nickname}
                    </span>
                    <div
                      className="tooltip tooltip-left"
                      data-tip={formatDateTime(message.sentAt)}
                    >
                      <time className="text-base-content text-sm">
                        {formatTime(message.sentAt)}
                      </time>
                    </div>
                  </div>
                  <div className="break-words min-w-0">{message.content}</div>
                </div>
              </div>
            ) : (
              <div
                className="flex gap-4 px-2 hover:bg-base-200 transition group"
                key={message.id}
              >
                <div className="w-12 h-0 flex-shrink-0" />
                <span className="flex-1 break-words min-w-0">
                  {message.content}
                </span>
                <div>
                  <time
                    className="tooltip tooltip-left text-base-content text-sm opacity-0 group-hover:opacity-100 transition"
                    data-tip={formatDateTime(message.sentAt)}
                  >
                    {formatTime(message.sentAt)}
                  </time>
                </div>
              </div>
            );
          })
        ) : (
          <div className="grid w-full h-full place-items-center">
            <span className="text-base-content">快来跟 TA 打个招呼吧</span>
          </div>
        )}
      </div>

      <Form
        method="post"
        ref={formRef}
        className="sticky bottom-0 py-4 bg-base-100 z-10 flex gap-4"
      >
        <input type="hidden" name="to" value={target.id} />
        <input
          className="input input-bordered flex-1"
          type="text"
          placeholder="输入消息..."
          name="content"
          required
          disabled={isLoading}
          autoComplete="false"
        />
        <button
          className="btn btn-primary gap-2"
          type="submit"
          disabled={isLoading}
        >
          <HiOutlinePaperAirplane className="rotate-90" />
          <span>发送</span>
        </button>
      </Form>
    </div>
  );
}

export { CatchBoundary } from "~/src/CatchBoundary";
export { ErrorBoundary } from "~/src/ErrorBoundary";
