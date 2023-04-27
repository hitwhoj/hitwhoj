import type { LinksFunction, LoaderArgs } from "@remix-run/node";
import { json } from "@remix-run/node";
import {
  Links,
  LiveReload,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  useBeforeUnload,
} from "@remix-run/react";
import { db } from "~/utils/server/db.server";
import { findRequestUser } from "./utils/permission";
import { selectUserData } from "./utils/db/user";

import style from "./styles/app.css";
import katexStyle from "katex/dist/katex.css";
import { getCookie } from "./utils/cookies";
import type { Theme } from "./utils/theme";
import { darkThemes } from "./utils/theme";
import { themes } from "./utils/theme";

import adimg from "./assets/ad.jpg";
import hitwh from "./assets/hitwh.png";
import qqgroup from "./assets/qq.svg";
import { useSignalFetcher, useSignalLoaderData } from "./utils/hooks";
import { useComputed, useSignal, useSignalEffect } from "@preact/signals-react";
import { ThemeContext, UserContext } from "./utils/context";
import { useCallback, useEffect } from "react";
import { toastSignal, useToasts } from "~/utils/toast";
import { fromEventSource } from "~/utils/eventSource";
import type { MessageType } from "~/routes/chat/events";
import type { ActionData } from "~/routes/logout";

export const links: LinksFunction = () => [
  { rel: "stylesheet", href: style },
  { rel: "stylesheet", href: katexStyle },
  { rel: "preload", href: adimg, as: "image" },
  { rel: "preload", href: hitwh, as: "image" },
  { rel: "preload", href: qqgroup, as: "image" },
];
const alertClassName = {
  info: "alert-info",
  success: "alert-success",
  error: "alert-error",
  warning: "alert-warning",
};

export async function loader({ request }: LoaderArgs) {
  let theme = getCookie(request, "theme") ?? "light";
  if (!themes.includes(theme as Theme)) {
    theme = "light";
  }
  const self = await findRequestUser(request);
  if (!self.userId) {
    return json({ theme: theme as Theme, user: null });
  }

  const user = await db.user.findUnique({
    where: { id: self.userId! },
    select: selectUserData,
  });

  return json({ theme: theme as Theme, user });
}

// this make sure @tailwind compiles
// https://remix.run/api/conventions#default-export
// https://remix.run/api/conventions#route-filenames
export default function App() {
  const loaderData = useSignalLoaderData<typeof loader>();

  const theme = useSignal(loaderData.value.theme);
  const user = useComputed(() => loaderData.value.user);
  const userId = useComputed(() => loaderData.value.user?.id ?? null);
  const Toasts = useToasts();
  useEffect(() => {
    // if did not set theme ever
    if (!document.cookie.includes("theme=")) {
      // and if system theme is dark
      if (window.matchMedia("(prefers-color-scheme: dark)").matches) {
        theme.value = "dark";
      }
    }
  }, []);
  // save theme before unload
  useBeforeUnload(
    useCallback(() => {
      document.cookie = `theme=${theme.value}; Path=/; Max-Age=31536000; SameSite=Lax;`;
    }, [theme.value])
  );
  // subscribe to PMs
  useSignalEffect(() => {
    if (userId.value) {
      // 订阅新私聊消息
      const subscription = fromEventSource<MessageType>(
        "/chat/events"
      ).subscribe((message) => {
        Toasts.info(
          `收到来自 ${message.from.nickname || message.from.username} 的新消息`
        );
      });

      return () => subscription.unsubscribe();
    }
  });

  const fetcher = useSignalFetcher<ActionData>();
  useEffect(() => {
    if (fetcher.actionSuccess && fetcher.data) {
      if (fetcher.data.success) {
        Toasts.success("退出登录成功");
      } else {
        Toasts.error(fetcher.data.reason ?? "退出登录失败");
      }
    }
  }, [fetcher.actionSuccess]);
  return (
    <html lang="zh-Hans" data-theme={theme.value}>
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width,initial-scale=1" />
        <meta
          name="color-scheme"
          content={darkThemes.includes(theme.value) ? "dark" : "light"}
        />
        <Meta />
        <Links />
      </head>
      <body className="relative font-sans">
        <ThemeContext.Provider value={theme}>
          <UserContext.Provider value={user.value && user.value.id}>
            <Outlet />
          </UserContext.Provider>
        </ThemeContext.Provider>
        {/*顶部弹窗 */}
        {toastSignal.value.length > 0 && (
          <div
            // 屏蔽外部盒子的点击事件
            className="toast toast-center toast-top pointer-events-none w-full items-center"
          >
            {toastSignal.value.map((toast, index) => (
              <div
                // 恢复内部元素的点击事件
                className="pointer-events-auto max-w-sm"
                key={index}
              >
                <div className={`alert ${alertClassName[toast.type]}`}>
                  <span>{toast.message}</span>
                </div>
              </div>
            ))}
          </div>
        )}
        <ScrollRestoration />
        <Scripts />
        {process.env.NODE_ENV === "development" && <LiveReload />}
      </body>
    </html>
  );
}

// FIXME ErrorBoundary 和 CatchBoundary 好像没法同步主题
// Won't fix: 那就这样吧，摆烂了
// https://remix.run/docs/en/v1/api/conventions#errorboundary
export { ErrorBoundary } from "~/src/ErrorBoundary";
// https://remix.run/docs/en/v1/api/conventions#catchboundary
export { CatchBoundary } from "~/src/CatchBoundary";
