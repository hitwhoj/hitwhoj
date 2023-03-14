import type { ActionArgs, LoaderArgs, MetaFunction } from "@remix-run/node";
import { json } from "@remix-run/node";
import { redirect } from "@remix-run/node";
import { db } from "~/utils/server/db.server";
import { invariant } from "~/utils/invariant";
import { contentScheme, idScheme } from "~/utils/scheme";
import { Form, Link, useLoaderData } from "@remix-run/react";
import { useEffect, useRef } from "react";
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
import { useSignal, useSignalEffect } from "@preact/signals-react";
import { useSignalTransition } from "~/utils/hooks";

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
  const messages = useSignal(room.chatMessage);

  useEffect(() => {
    messages.value = room.chatMessage;
  }, [room.chatMessage]);
  useEffect(() => {
    const subscription = fromEventSource<MessageType>(
      `./${room.id}/events`
    ).subscribe((message) => {
      messages.value = [...messages.value, message];
    });
    return () => subscription.unsubscribe();
  }, [room.id]);

  const { success, loading } = useSignalTransition();

  const formRef = useRef<HTMLFormElement>(null);

  useSignalEffect(() => {
    if (success.value) {
      formRef.current?.reset();
    }
  });

  return (
    <Fullscreen visible={true} className="not-prose">
      <div className="drawer-mobile drawer">
        <input type="checkbox" className="drawer-toggle" />
        <div className="not-prose drawer-content flex min-h-full flex-col overflow-auto bg-base-100 px-4">
          <header className="sticky top-0 z-10 bg-base-100 py-4">
            <h1 className="text-2xl font-bold">{room.name}</h1>
          </header>

          <div className="flex-1">
            {messages.value.map((message, index, array) => {
              // 是否是同一个人在连续五分钟内发送的第一条消息
              const isFirst =
                index === 0 ||
                array[index - 1].sender.id !== message.sender.id ||
                new Date(message.sentAt).getTime() -
                  new Date(array[index - 1].sentAt).getTime() >
                  1000 * 60 * 5;

              return isFirst ? (
                <div
                  className="flex gap-4 px-2 pt-2 transition hover:bg-base-200"
                  key={message.id}
                >
                  <UserAvatar
                    className="h-12 w-12 flex-shrink-0 bg-base-300 text-2xl"
                    user={message.sender}
                  />
                  <div className="flex-1">
                    <div className="flex w-full justify-between">
                      <span className="inline-flex items-center gap-2">
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
                    <div className="min-w-0 break-words">{message.content}</div>
                  </div>
                  <div>
                    <span
                      className="tooltip tooltip-left"
                      data-tip={formatDateTime(message.sentAt)}
                    >
                      <time className="text-sm text-base-content opacity-60">
                        {formatTime(message.sentAt)}
                      </time>
                    </span>
                  </div>
                </div>
              ) : (
                <div
                  className="group flex gap-4 px-2 transition hover:bg-base-200"
                  key={message.id}
                >
                  <div className="h-0 w-12 flex-shrink-0" />
                  <span className="min-w-0 flex-1 break-words">
                    {message.content}
                  </span>
                  <div>
                    <span
                      className="tooltip tooltip-left"
                      data-tip={formatDateTime(message.sentAt)}
                    >
                      <time className="text-sm opacity-0 transition group-hover:opacity-60">
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
            className="sticky bottom-0 z-10 flex gap-4 bg-base-100 py-4"
            ref={formRef}
            autoComplete="off"
          >
            <input type="hidden" name="roomId" value={room.id} />
            <input
              className="input input-bordered flex-1"
              type="text"
              placeholder="输入消息..."
              name="content"
              disabled={loading.value}
              required
              autoComplete="false"
            />
            <button
              className="btn btn-primary gap-2"
              type="submit"
              disabled={loading.value}
            >
              <HiOutlinePaperAirplane className="rotate-90" />
              <span>发送</span>
            </button>
          </Form>
        </div>
        <div className="drawer-side">
          <div className="drawer-overlay" />
          <aside className="flex w-72 flex-col justify-between bg-base-200 p-4">
            <div>
              <Link className="btn btn-ghost gap-2" to="/">
                <HiOutlineChevronLeft />
                <span>返回上一页</span>
              </Link>
            </div>
            {isMember && (
              <Form method="post" action="exit">
                <button className="btn btn-error w-full gap-2">
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
