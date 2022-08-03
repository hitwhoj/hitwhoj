import { useEffect, useState } from "react";
import style from "./styles/global.css";
import arcoStyle from "@arco-design/web-react/dist/css/arco.css";
import { Button, Notification } from "@arco-design/web-react";
import katexStyle from "katex/dist/katex.css";
import type { LinksFunction, LoaderFunction } from "@remix-run/node";

import {
  Links,
  LiveReload,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  useCatch,
  useLoaderData,
  useNavigate,
} from "@remix-run/react";

import Layout from "./src/Layout";
import { db } from "~/utils/server/db.server";
import { CatchBoundary as CustomCatchBoundary } from "~/src/CatchBoundary";
import { ErrorBoundary as CustomErrorBoundary } from "~/src/ErrorBoundary";
import { getCookie } from "./utils/cookies";
import type { Theme } from "./utils/context/theme";
import { ThemeContext } from "./utils/context/theme";
import type { MessageType } from "./routes/chat/events";
import { findRequestUser } from "./utils/permission";
import type { UserData } from "./utils/db/user";
import { selectUserData } from "./utils/db/user";
import { UserContext } from "./utils/context/user";

export const links: LinksFunction = () => [
  {
    rel: "stylesheet",
    href: katexStyle,
  },
  {
    rel: "stylesheet",
    href: arcoStyle,
  },
  {
    rel: "stylesheet",
    href: style,
  },
];

type LoaderData = {
  theme: Theme;
  user: UserData | null;
};

export const loader: LoaderFunction<LoaderData> = async ({ request }) => {
  const theme = getCookie(request, "theme") === "dark" ? "dark" : "light";
  const self = await findRequestUser(request);
  if (!self.userId) {
    return { theme, user: null };
  }

  const user = await db.user.findUnique({
    where: { id: self.userId! },
    select: selectUserData,
  });

  return { theme, user };
};

interface DocumentProps {
  children: React.ReactNode;
  title?: string;
  theme?: Theme;
}

const Document = ({ children, title, theme }: DocumentProps) => {
  return (
    <html lang="zh-Hans">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width,initial-scale=1" />
        <meta name="color-scheme" content={theme} />
        {title && <title>{title}</title>}
        <Meta />
        <Links />
      </head>
      <body arco-theme={theme ?? "light"}>
        {children}
        <ScrollRestoration />
        <Scripts />
        {process.env.NODE_ENV === "development" && <LiveReload />}
      </body>
    </html>
  );
};

// https://remix.run/api/conventions#default-export
// https://remix.run/api/conventions#route-filenames
export default function App() {
  const { user, theme: defaultTheme } = useLoaderData<LoaderData>();
  const [theme, setTheme] = useState<Theme>(defaultTheme);
  const navigate = useNavigate();

  useEffect(() => {
    if (user?.id) {
      // 新私聊消息
      const eventSource = new EventSource("/chat/events");
      eventSource.addEventListener("message", ({ data }) => {
        const message: MessageType = JSON.parse(data);

        // 生成一个随机 id 给 Notification
        const id = Date.now().toString(16) + Math.random().toString(16);
        Notification.info({
          id,
          title: "新私聊消息",
          content: (
            <span>
              <b>{message.from.nickname || message.from.username}</b>
              {": "}
              {message.content}
            </span>
          ),
          btn: (
            <Button
              type="primary"
              onClick={() => {
                navigate(`/chat/user/${message.from.id}`);
                Notification.remove(id);
              }}
            >
              View
            </Button>
          ),
        });
      });

      return () => eventSource.close();
    }
  }, [user?.id]);

  useEffect(() => {
    document.cookie = `theme=${theme}; path=/; Expires=Fri, 31 Dec 9999 23:59:59 GMT; SameSite=Lax`;
  }, [theme]);

  return (
    <Document theme={theme}>
      <UserContext.Provider value={user && user.id}>
        <ThemeContext.Provider value={{ theme, setTheme }}>
          <Layout user={user}>
            <Outlet />
          </Layout>
        </ThemeContext.Provider>
      </UserContext.Provider>
    </Document>
  );
}

// FIXME: ErrorBoundary 和 CatchBoundary 好像没法同步主题
// https://remix.run/docs/en/v1/api/conventions#errorboundary
export function ErrorBoundary({ error }: { error: Error }) {
  return (
    <Document title={`错误: ${error.message} - HITwh OJ`}>
      <CustomErrorBoundary error={error} />
    </Document>
  );
}

// https://remix.run/docs/en/v1/api/conventions#catchboundary
export function CatchBoundary() {
  const caught = useCatch();

  return (
    <Document title={`错误: ${caught.status} ${caught.statusText} - HITwh OJ`}>
      <CustomCatchBoundary />
    </Document>
  );
}
