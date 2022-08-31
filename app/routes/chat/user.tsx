import { Empty, List } from "@arco-design/web-react";
import type { LinksFunction, LoaderArgs } from "@remix-run/node";
import { Link, Outlet, useLoaderData } from "@remix-run/react";
import { useContext, useEffect, useState } from "react";
import { UserAvatar } from "~/src/user/UserAvatar";
import { UserContext } from "~/utils/context/user";
import { fromEventSource } from "~/utils/eventSource";
import { findRequestUser } from "~/utils/permission";
import { db } from "~/utils/server/db.server";
import type { MessageType } from "./events";

import style from "~/styles/simplify.css";
import { Permissions } from "~/utils/permission/permission";

export const links: LinksFunction = () => [{ rel: "stylesheet", href: style }];

export async function loader({ request }: LoaderArgs) {
  const self = await findRequestUser(request);
  if (!self.userId) throw new Response("Unauthorized", { status: 401 });
  await self.checkPermission(Permissions.PERM_VIEW_USER_PM_SELF);

  const messages = await db.privateMessage.findMany({
    where: {
      OR: [{ fromId: self.userId }, { toId: self.userId }],
    },
    orderBy: { sentAt: "desc" },
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

  return { messages };
}

export default function UserChatIndex() {
  const { messages } = useLoaderData<typeof loader>();
  const self = useContext(UserContext);

  const [msgs, setMsgs] = useState(messages);

  const set = new Set<number>();
  const users = msgs
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

  useEffect(() => {
    if (self) {
      const subscription = fromEventSource<MessageType>(
        "/chat/events"
      ).subscribe((message) => {
        setMsgs((msgs) => [message, ...msgs]);
      });
      return () => subscription.unsubscribe();
    }
  }, [self]);

  useEffect(() => setMsgs(messages), [messages]);

  return (
    <div className="flex overflow-hidden h-full flex-row">
      <div className="basis-[30%]">
        <List
          bordered={false}
          dataSource={users}
          render={({ user, message }) => (
            <div key={user.id} className="py-2 px-0">
              <Link
                key={user.id}
                to={`/chat/user/${user.id}`}
                prefetch="intent"
                className="block"
              >
                <div className="flex w-full gap-3 items-center">
                  <UserAvatar user={user} className="shrink-0" />
                  <div className="overflow-hidden">
                    <div className="bold text-ellipsis whitespace-nowrap overflow-hidden">
                      {user.nickname || user.username}
                    </div>
                    <div className="text-ellipsis whitespace-nowrap overflow-hidden">
                      {message.content}
                    </div>
                  </div>
                </div>
              </Link>
            </div>
          )}
          noDataElement={<Empty description="没有对话" />}
        />
      </div>
      <div className="basis-[70%]">
        <Outlet />
      </div>
    </div>
  );
}

export { CatchBoundary } from "~/src/CatchBoundary";
export { ErrorBoundary } from "~/src/ErrorBoundary";
