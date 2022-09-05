import { Link, NavLink, Outlet, useLoaderData } from "@remix-run/react";
import { useContext, useEffect, useState } from "react";
import { UserAvatar } from "~/src/user/UserAvatar";
import { UserContext } from "~/utils/context/user";
import { fromEventSource } from "~/utils/eventSource";
import { findRequestUser } from "~/utils/permission";
import { db } from "~/utils/server/db.server";
import type { MessageType } from "./events";
import { Permissions } from "~/utils/permission/permission";
import type { LoaderArgs } from "@remix-run/node";
import FullScreen from "~/src/FullScreen";
import { HiOutlineChevronLeft } from "react-icons/hi";

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
    <FullScreen visible={true} className="bg-base-100 flex not-prose">
      <div className="drawer drawer-mobile">
        <input type="checkbox" className="drawer-toggle" />
        <div className="drawer-content overflow-hidden px-4">
          <Outlet />
        </div>
        <div className="drawer-side">
          <div className="drawer-overlay"></div>
          <aside className="p-4 bg-base-200">
            {/* FIXME 这个是假的上一页 */}
            <Link className="btn btn-ghost gap-2" to="/">
              <HiOutlineChevronLeft />
              <span>返回到上一页</span>
            </Link>
            <ul className="p-0 menu w-72 mt-4">
              {users.map(({ user, message }) => (
                <li key={user.id}>
                  <NavLink to={`/chat/user/${user.id}`} className="p-4 w-full">
                    <div className="flex w-full gap-3 items-center">
                      <UserAvatar
                        user={user}
                        className="w-16 h-16 flex-shrink-0 bg-base-300 text-3xl"
                      />
                      <div className="overflow-hidden">
                        <div className="font-bold text-xl text-ellipsis whitespace-nowrap overflow-hidden">
                          {user.nickname || user.username}
                        </div>
                        <div className="text-ellipsis whitespace-nowrap overflow-hidden">
                          {message.content}
                        </div>
                      </div>
                    </div>
                  </NavLink>
                </li>
              ))}
            </ul>
          </aside>
        </div>
      </div>
    </FullScreen>
  );
}

export { CatchBoundary } from "~/src/CatchBoundary";
export { ErrorBoundary } from "~/src/ErrorBoundary";
