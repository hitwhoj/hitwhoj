import { Avatar } from "@arco-design/web-react";
import type { User } from "@prisma/client";
import type { LinksFunction, LoaderFunction } from "@remix-run/node";
import { redirect } from "@remix-run/node";
import { NavLink, Outlet, useLoaderData } from "@remix-run/react";
import { db } from "~/utils/server/db.server";
import { findSessionUid } from "~/utils/sessions";
import type { PrivateMessageWithUser } from "~/utils/ws.types";
import chatStyle from "~/styles/chat.css";

export const links: LinksFunction = () => [
  { rel: "stylesheet", href: chatStyle },
];

type LoaderData = {
  self: Pick<User, "id" | "username" | "nickname" | "avatar">;
  messages: PrivateMessageWithUser[];
};

export const loader: LoaderFunction<LoaderData> = async ({ request }) => {
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

  return { self, messages };
};

export default function Chat() {
  const { self, messages } = useLoaderData<LoaderData>();

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
    <div className="chat-container">
      <div className="chat-list">
        {users.map(({ user, message }) => (
          <NavLink
            key={user.id}
            to={`/chat/${user.id}`}
            className="chat-list-item"
            prefetch="intent"
          >
            <div className="chat-selection">
              <Avatar>
                <img src={user.avatar} alt="avatar" />
              </Avatar>
              <div className="chat-selection-detail">
                <div className="chat-selection-detail-name">
                  {user.nickname || user.username}
                </div>
                <div className="chat-selection-detail-content">
                  {message.content}
                </div>
              </div>
            </div>
          </NavLink>
        ))}
      </div>
      <div className="chat-content">
        <Outlet />
      </div>
    </div>
  );
}
