import { Empty, Layout, List } from "@arco-design/web-react";
import type { LoaderArgs } from "@remix-run/node";
import { redirect } from "@remix-run/node";
import { Link, Outlet, useLoaderData } from "@remix-run/react";
import { useContext, useEffect, useState } from "react";
import { UserAvatar } from "~/src/user/UserAvatar";
import { UserContext } from "~/utils/context/user";
import { fromEventSource } from "~/utils/eventSource";
import { findRequestUser } from "~/utils/permission";
import { db } from "~/utils/server/db.server";
import type { MessageType } from "./events";

export async function loader({ request }: LoaderArgs) {
  const self = await findRequestUser(request);
  if (!self.userId) {
    throw redirect("/login");
  }

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
    <Layout className="overflow-hidden h-full flex-row">
      <Layout.Sider
        resizeDirections={["right"]}
        className="min-w-[20%] max-w-[50%]"
      >
        <List
          bordered={false}
          dataSource={users}
          render={({ user, message }) => (
            <List.Item>
              <Link
                key={user.id}
                to={`/chat/user/${user.id}`}
                prefetch="intent"
                style={{ display: "block" }}
              >
                <div
                  style={{
                    display: "flex",
                    width: "100%",
                    gap: "10px",
                    alignItems: "center",
                  }}
                >
                  <UserAvatar user={user} style={{ flexShrink: 0 }} />
                  <div style={{ overflow: "hidden" }}>
                    <div
                      style={{
                        fontWeight: "bold",
                        textOverflow: "ellipsis",
                        whiteSpace: "nowrap",
                        overflow: "hidden",
                      }}
                    >
                      {user.nickname || user.username}
                    </div>
                    <div
                      style={{
                        textOverflow: "ellipsis",
                        whiteSpace: "nowrap",
                        overflow: "hidden",
                      }}
                    >
                      {message.content}
                    </div>
                  </div>
                </div>
              </Link>
            </List.Item>
          )}
          noDataElement={<Empty description="没有对话" />}
        />
      </Layout.Sider>
      <Layout.Content>
        <Outlet />
      </Layout.Content>
    </Layout>
  );
}

export { CatchBoundary } from "~/src/CatchBoundary";
export { ErrorBoundary } from "~/src/ErrorBoundary";
