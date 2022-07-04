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
import { findSessionUserOptional } from "~/utils/sessions";
import { findSession } from "~/utils/sessions";
import { CatchBoundary as CustomCatchBoundary } from "~/src/CatchBoundary";
import { ErrorBoundary as CustomErrorBoundary } from "~/src/ErrorBoundary";
import { getCookie } from "./utils/cookies";
import type { Theme } from "./utils/context/theme";
import { ThemeContext } from "./utils/context/theme";
import type { UserInfo } from "./utils/context/user";
import { UserInfoContext } from "./utils/context/user";
import { WsContext } from "./utils/context/ws";
import { WsClient } from "./utils/ws.client";

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
  user: UserInfo | null;
  session?: string | null;
};

export const loader: LoaderFunction<LoaderData> = async ({ request }) => {
  const theme = getCookie(request, "theme") === "dark" ? "dark" : "light";
  const self = await findSessionUserOptional(request);

  if (!self) {
    return { theme, user: null };
  }
  const user = await db.user.findUnique({
    where: { id: self.id },
    select: {
      id: true,
      username: true,
      nickname: true,
      role: true,
      avatar: true,
    },
  });

  let session = await findSession(request);

  return { theme, user, session };
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
  const [wsc, setWsc] = useState<WsClient | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const wsc = new WsClient(user?.id);
    setWsc(wsc);

    if (user?.id) {
      // 新私聊消息
      const subscription = wsc.subscribePrivateMessage().subscribe((data) => {
        // 生成一个随机 id 给 Notification
        const id = Date.now().toString(16) + Math.random().toString(16);

        Notification.info({
          id,
          title: "新私聊消息",
          content: (
            <span>
              <b>{data.from.nickname || data.from.username}</b>
              {": "}
              {data.content}
            </span>
          ),
          btn: (
            <Button
              type="primary"
              onClick={() => {
                navigate(`/chat/user/${data.from.id}`);
                Notification.remove(id);
              }}
            >
              View
            </Button>
          ),
        });
      });

      return () => {
        subscription.unsubscribe();
        wsc.close();
      };
    }
  }, [user?.id]);

  useEffect(() => {
    document.cookie = `theme=${theme}; path=/; Expires=Fri, 31 Dec 9999 23:59:59 GMT; SameSite=Lax`;
  }, [theme]);

  return (
    <Document theme={theme}>
      <UserInfoContext.Provider value={user}>
        <WsContext.Provider value={wsc}>
          <ThemeContext.Provider value={{ theme, setTheme }}>
            <Layout>
              <Outlet />
            </Layout>
          </ThemeContext.Provider>
        </WsContext.Provider>
      </UserInfoContext.Provider>
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
