import type { ActionArgs, LoaderArgs, MetaFunction } from "@remix-run/node";
import { json } from "@remix-run/node";
import { redirect } from "@remix-run/node";
import { db } from "~/utils/server/db.server";
import { invariant } from "~/utils/invariant";
import { contentScheme, idScheme } from "~/utils/scheme";
import { Form, Link, useLoaderData, useTransition } from "@remix-run/react";
import { useEffect, useRef, useState } from "react";
import { UserAvatar } from "~/src/user/UserAvatar";
import { chatMessageSubject } from "~/utils/serverEvents";
import type { MessageType } from "./events";
import { fromEventSource } from "~/utils/eventSource";
import { findRequestUser } from "~/utils/permission";
import { Permissions } from "~/utils/permission/permission";
import { Privileges } from "~/utils/permission/privilege";
import Fullscreen from "~/src/Fullscreen";
import { formatDateTime, formatTime } from "~/utils/tools";
import {
  HiOutlineChevronLeft,
  HiOutlineLogout,
  HiOutlinePaperAirplane,
} from "react-icons/hi";
import { ChatRoomPermission } from "~/utils/permission/permission/room";
import { selectUserData } from "~/utils/db/user";

export async function loader({ request, params }: LoaderArgs) {
  const roomId = invariant(idScheme, params.roomId, { status: 404 });
  const self = await findRequestUser(request);
  const [hasReadPerm, isMember] = await self
    .room(roomId)
    .hasPermission(
      Permissions.PERM_VIEW_CHATROOM_MESSAGE,
      ChatRoomPermission.Members
    );

  if (!hasReadPerm) {
    throw redirect(`/chat/room/${roomId}/enter`);
  }

  const room = await db.chatRoom.findUnique({
    where: { id: roomId },
    select: {
      id: true,
      name: true,
      chatMessage: {
        orderBy: { sentAt: "asc" },
        select: {
          id: true,
          role: true,
          content: true,
          sentAt: true,
          roomId: true,
          sender: { select: { ...selectUserData } },
        },
      },
    },
  });

  if (!room) {
    throw new Response("Room not found", { status: 404 });
  }

  return json({ room, isMember });
}

export const meta: MetaFunction<typeof loader> = ({ data }) => ({
  title: `聊天室: ${data?.room.name} - HITwh OJ`,
});

export default function ChatRoomIndex() {
  const { room, isMember } = useLoaderData<typeof loader>();
  const [messages, setMessages] = useState(room.chatMessage);

  useEffect(() => setMessages(room.chatMessage), [room.chatMessage]);
  useEffect(() => {
    const subscription = fromEventSource<MessageType>(
      `./${room.id}/events`
    ).subscribe((message) => {
      setMessages((prev) => [...prev, message]);
    });
    return () => subscription.unsubscribe();
  }, [room.id]);

  const { state, type } = useTransition();
  const isActionSubmit = state === "submitting" && type === "actionSubmission";
  const isActionReload = state === "loading" && type === "actionReload";
  const isLoading = isActionSubmit || isActionReload;

  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    if (isActionReload) {
      formRef.current?.reset();
    }
  }, [isActionReload]);

  return (
    <Fullscreen visible={true} className="not-prose">
      <div className="drawer drawer-mobile">
        <input type="checkbox" className="drawer-toggle" />
        <div className="drawer-content bg-base-100 px-4 not-prose min-h-full flex flex-col overflow-auto">
          <header className="sticky top-0 py-4 z-10 bg-base-100">
            <h1 className="font-bold text-2xl">{room.name}</h1>
          </header>

          <div className="flex-1">
            {messages.map((message, index, array) => {
              // 是否是同一个人在连续五分钟内发送的第一条消息
              const isFirst =
                index === 0 ||
                array[index - 1].sender.id !== message.sender.id ||
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
                    user={message.sender}
                  />
                  <div className="flex-1">
                    <div className="w-full flex justify-between">
                      <span className="inline-flex gap-2 items-center">
                        <span className="text-primary">
                          {message.sender.nickname || message.sender.username}
                        </span>
                        {message.role === "Owner" && (
                          <span className="badge badge-primary">所有人</span>
                        )}
                        {message.role === "Admin" && (
                          <span className="badge badge-primary">管理员</span>
                        )}
                        {!message.role && <span className="badge">游客</span>}
                      </span>
                    </div>
                    <div className="break-words min-w-0">{message.content}</div>
                  </div>
                  <div>
                    <span
                      className="tooltip tooltip-left"
                      data-tip={formatDateTime(message.sentAt)}
                    >
                      <time className="text-base-content text-sm opacity-60">
                        {formatTime(message.sentAt)}
                      </time>
                    </span>
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
                    <span
                      className="tooltip tooltip-left"
                      data-tip={formatDateTime(message.sentAt)}
                    >
                      <time className="text-sm opacity-0 group-hover:opacity-60 transition">
                        {formatTime(message.sentAt)}
                      </time>
                    </span>
                  </div>
                </div>
              );
            })}
          </div>

          <Form
            method="post"
            className="sticky bottom-0 z-10 flex gap-4 py-4 bg-base-100"
            ref={formRef}
            autoComplete="off"
          >
            <input type="hidden" name="roomId" value={room.id} />
            <input
              className="input input-bordered flex-1"
              type="text"
              placeholder="输入消息..."
              name="content"
              disabled={isLoading}
              required
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
        <div className="drawer-side">
          <div className="drawer-overlay" />
          <aside className="w-72 bg-base-200 p-4 flex flex-col justify-between">
            <div>
              <Link className="btn btn-ghost gap-2" to="/">
                <HiOutlineChevronLeft />
                <span>返回上一页</span>
              </Link>
            </div>
            {isMember && (
              <Form method="post" action="exit">
                <button className="btn btn-error gap-2 w-full">
                  <HiOutlineLogout />
                  <span>退出群组</span>
                </button>
              </Form>
            )}
          </aside>
        </div>
      </div>
    </Fullscreen>
  );
}

export async function action({ request, params }: ActionArgs) {
  const roomId = invariant(idScheme, params.roomId, { status: 404 });
  const self = await findRequestUser(request);
  await self.checkPrivilege(Privileges.PRIV_OPERATE);
  await self
    .room(roomId)
    .checkPermission(Permissions.PERM_SEND_CHATROOM_MESSAGE);

  const form = await request.formData();
  const content = invariant(contentScheme, form.get("content"));

  const user = await db.chatRoomUser.findUnique({
    where: { roomId_userId: { roomId, userId: self.userId! } },
    select: { role: true },
  });

  const message = await db.chatMessage.create({
    data: {
      roomId: roomId,
      senderId: self.userId!,
      content,
      role: user?.role,
    },
    select: { id: true },
  });

  // 推送新的消息
  chatMessageSubject.next(message.id);

  return null;
}

export { CatchBoundary } from "~/src/CatchBoundary";
export { ErrorBoundary } from "~/src/ErrorBoundary";
