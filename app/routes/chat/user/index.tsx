import { Empty } from "@arco-design/web-react";
import type { LoaderFunction } from "@remix-run/node";
import { redirect } from "@remix-run/node";
import { Link, useLoaderData } from "@remix-run/react";
import { useContext } from "react";
import { UserAvatar } from "~/src/user/UserAvatar";
import { UserContext } from "~/utils/context/user";
import { findRequestUser } from "~/utils/permission";
import { db } from "~/utils/server/db.server";
import type { PrivateMessageWithUser } from "~/utils/serverEvents";

type LoaderData = {
  messages: PrivateMessageWithUser[];
};

export const loader: LoaderFunction<LoaderData> = async ({ request }) => {
  const self = await findRequestUser(request);
  if (!self.userId) {
    throw redirect("/login");
  }

  const messages = await db.privateMessage.findMany({
    where: {
      OR: [{ fromId: self.userId }, { toId: self.userId }],
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

  return { self, messages };
};

export default function UserChatIndex() {
  const { messages } = useLoaderData<LoaderData>();
  const self = useContext(UserContext);

  const set = new Set<number>();
  const users = messages
    .map((message) => ({
      user: message.from.id === self ? message.to : message.from,
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
