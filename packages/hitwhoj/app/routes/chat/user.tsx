import { Link, NavLink, Outlet } from "@remix-run/react";
import { UserAvatar } from "~/src/user/UserAvatar";
import { fromEventSource } from "~/utils/eventSource";
import { findRequestUser } from "~/utils/permission";
import { db } from "~/utils/server/db.server";
import type { MessageType } from "./events";
import { Permissions } from "~/utils/permission/permission";
import type { LoaderArgs } from "@remix-run/node";
import Fullscreen from "~/src/Fullscreen";
import { HiOutlineChevronLeft } from "react-icons/hi";
import { selectUserData } from "~/utils/db/user";
import { useComputed, useSignalEffect } from "@preact/signals-react";
import { useSignalLoaderData, useSynchronized } from "~/utils/hooks";
import { useUser } from "~/utils/context";

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
    select: {
      from: { select: { ...selectUserData } },
      to: { select: { ...selectUserData } },
      content: true,
      sentAt: true,
    },
  });

  return { messages };
}

export default function UserChatIndex() {
  const loaderData = useSignalLoaderData<typeof loader>();

  const self = useUser();

  const messages = useSynchronized(() => loaderData.value.messages);

  const users = useComputed(() => {
    const set = new Set<number>();
    return messages.value
      .map((message) => ({
        user: message.from.id === self.value ? message.to : message.from,
        message,
      }))
      .filter(({ user }) => {
        if (set.has(user.id)) {
          return false;
        }
        set.add(user.id);
        return true;
      });
  });

  useSignalEffect(() => {
    if (self.value) {
      const subscription = fromEventSource<MessageType>(
        "/chat/events"
      ).subscribe((message) => {
        messages.value = [message, ...messages.value];
      });
      return () => subscription.unsubscribe();
    }
  });

  return (
    <Fullscreen visible={true} className="not-prose flex bg-base-100">
      <div className="drawer-mobile drawer">
        <input type="checkbox" className="drawer-toggle" />
        <div className="drawer-content overflow-hidden px-4">
          <Outlet />
        </div>
        <div className="drawer-side">
          <div className="drawer-overlay"></div>
          <aside className="bg-base-200 p-4">
            {/* FIXME 这个是假的上一页 */}
            <Link className="btn btn-ghost gap-2" to="/">
              <HiOutlineChevronLeft />
              <span>返回到上一页</span>
            </Link>
            <ul className="menu mt-4 w-72 p-0">
              {users.value.map(({ user, message }) => (
                <li key={user.id}>
                  <NavLink to={`/chat/user/${user.id}`} className="w-full p-4">
                    <div className="flex w-full items-center gap-3">
                      <UserAvatar
                        user={user}
                        className="h-16 w-16 flex-shrink-0 bg-base-300 text-3xl"
                      />
                      <div className="overflow-hidden">
                        <div className="overflow-hidden text-ellipsis whitespace-nowrap text-xl font-bold">
                          {user.nickname || user.username}
                        </div>
                        <div className="overflow-hidden text-ellipsis whitespace-nowrap">
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
    </Fullscreen>
  );
}

export { CatchBoundary } from "~/src/CatchBoundary";
export { ErrorBoundary } from "~/src/ErrorBoundary";
