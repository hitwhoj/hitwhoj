import { Empty } from "@arco-design/web-react";
import { json, LoaderArgs, redirect } from "@remix-run/node";
import { Link, useLoaderData } from "@remix-run/react";
import { UserAvatar } from "~/src/user/UserAvatar";
import { db } from "~/utils/server/db.server";
import { findSessionUid } from "~/utils/sessions";

export async function loader({ request }: LoaderArgs) {
  const selfId = await findSessionUid(request);
  if (!selfId) {
    throw redirect("/login");
  }

  const self = (await db.user.findUnique({
    where: { id: selfId },
    select: { id: true, nickname: true, username: true, avatar: true },
  }))!;

  const messages = await db.privateMessage.findMany({
    where: {
      OR: [{ fromId: selfId }, { toId: selfId }],
    },
    orderBy: {
      sentAt: "desc",
    },
    distinct: ["fromId", "toId"],
    include: {
      from: {
        select: { id: true, nickname: true, username: true, avatar: true },
      },
      to: {
        select: { id: true, nickname: true, username: true, avatar: true },
      },
    },
  });

  return json({ self, messages });
}

export default function UserChatIndex() {
  const { self, messages } = useLoaderData<typeof loader>();

  const set = new Set<number>();
  const users = messages
    .map((message) => ({
      user: message.fromId === self.id ? message.to : message.from,
      message,
    }))
    .filter(({ user }) => {
      if (set.has(user.id)) {
        return false;
      }
      set.add(user.id);
      return true;
    });

  return (
    <div className="chat-index">
      {users.length ? (
        users.map(({ user, message }) => (
          <Link
            key={user.id}
            to={`/chat/user/${user.id}`}
            className="chat-index-item"
            prefetch="intent"
          >
            <div className="chat-selection">
              <UserAvatar user={user} />
              <div className="chat-selection-detail">
                <div className="chat-selection-detail-name">
                  {user.nickname || user.username}
                </div>
                <div className="chat-selection-detail-content">
                  {message.content}
                </div>
              </div>
            </div>
          </Link>
        ))
      ) : (
        <Empty description="暂无消息" />
      )}
    </div>
  );
}

export { CatchBoundary } from "~/src/CatchBoundary";
export { ErrorBoundary } from "~/src/ErrorBoundary";
