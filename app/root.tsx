import { useEffect, useState } from "react";
import type { LinksFunction, LoaderArgs } from "@remix-run/node";
import { json } from "@remix-run/node";
import {
  Link,
  Links,
  LiveReload,
  Meta,
  NavLink,
  Outlet,
  Scripts,
  ScrollRestoration,
  useLoaderData,
} from "@remix-run/react";
import { db } from "~/utils/server/db.server";
import type { MessageType } from "./routes/chat/events";
import { findRequestUser } from "./utils/permission";
import { selectUserData } from "./utils/db/user";
import { UserContext } from "./utils/context/user";
import { fromEventSource } from "./utils/eventSource";
import {
  HiOutlineBookOpen,
  HiOutlineChevronDown,
  HiOutlineCollection,
  HiOutlineColorSwatch,
  HiOutlineHome,
  HiOutlineQuestionMarkCircle,
  HiOutlineUserGroup,
} from "react-icons/hi";
import { AiOutlineHistory, AiOutlineTrophy } from "react-icons/ai";
import { version } from "../package.json";

import style from "./styles/app.css";
import katexStyle from "katex/dist/katex.css";
import { getCookie } from "./utils/cookies";
import type { Theme} from "./utils/theme";
import { darkThemes, ThemeContext } from "./utils/theme";
import { themes } from "./utils/theme";
import { MenuDrawerContext } from "./utils/context/menu";

export const links: LinksFunction = () => [
  { rel: "stylesheet", href: style },
  { rel: "stylesheet", href: katexStyle },
];

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

// https://remix.run/api/conventions#default-export
// https://remix.run/api/conventions#route-filenames
export default function App() {
  const { user, theme: defaultTheme } = useLoaderData<typeof loader>();
  const [theme, setTheme] = useState(defaultTheme);
  const [menuEnable, setMenuEnable] = useState(true);

  useEffect(() => {
    document.cookie = `theme=${theme}; Path=/; Max-Age=31536000; SameSite=Lax;`;
  }, [theme]);

  useEffect(() => {
    if (user?.id) {
      // 订阅新私聊消息
      const subscription = fromEventSource<MessageType>(
        "/chat/events"
      ).subscribe((message) => {
        // FIXME
        console.log(`new message: ${message.content}`);
      });

      return () => subscription.unsubscribe();
    }
  }, [user?.id]);

  return (
    <html lang="zh-Hans" data-theme={theme}>
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width,initial-scale=1" />
        <meta
          name="color-scheme"
          content={darkThemes.includes(theme) ? "dark" : "light"}
        />
        <Meta />
        <Links />
      </head>
      <body className="font-sans">
        <ThemeContext.Provider value={theme}>
          <UserContext.Provider value={user && user.id}>
            <MenuDrawerContext.Provider value={setMenuEnable}>
              <div
                className={`bg-base-100 drawer${
                  menuEnable ? " drawer-mobile" : ""
                }`}
              >
                <input
                  id="drawer-menu"
                  type="checkbox"
                  className="drawer-toggle"
                />
                {/* 整个网站右边部分 */}
                <div className="drawer-content flex flex-col h-full">
                  {/* 顶部导航栏 */}
                  <div className="sticky top-0 bg-base-100 z-10">
                    <nav className="navbar w-full flex justify-end gap-4">
                      {/* 主题切换按钮 */}
                      <div className="dropdown dropdown-end">
                        <div
                          className="btn gap-2 normal-case btn-ghost"
                          tabIndex={0}
                        >
                          <HiOutlineColorSwatch className="w-6 h-6" />
                          主题
                          <HiOutlineChevronDown className="w-3 h-3" />
                        </div>
                        <div className="dropdown-content bg-base-200 text-base-content rounded-t-box rounded-b-box top-0 max-h-96 h-[70vh] w-52 overflow-y-auto shadow-2xl mt-16">
                          <div
                            className="grid grid-cols-1 gap-3 p-3"
                            tabIndex={0}
                          >
                            {themes.map((iter) => (
                              <div
                                key={iter}
                                data-theme={iter}
                                className={`p-3 rounded-lg text-base-content font-sans font-bold cursor-pointer outline-2 outline-offset-2${
                                  theme === iter ? " outline" : ""
                                }`}
                                onClick={() => setTheme(iter)}
                              >
                                {iter}
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                      {/* 用户头像 */}
                      {/* <div className="dropdown dropdown-end">
                      <div className="btn btn-outline gap-2" tabIndex={0}>
                        登录
                      </div>
                      <div className="dropdown-content bg-base-200 text-base-content rounded-t-box rounded-b-box w-52 shadow-2xl top-0 mt-16">
                        hello world
                      </div>
                    </div> */}
                      <Link className="btn btn-outline" to="/login">
                        登录
                      </Link>
                      <Link className="btn btn-primary" to="/register">
                        注册
                      </Link>
                    </nav>
                  </div>
                  {/* 中间部分 */}
                  <div className="p-6 flex-1">
                    <div className="prose w-full max-w-4xl">
                      <Outlet />
                    </div>
                  </div>
                  {/* 底部 */}
                  <footer className="footer p-10 bg-neutral text-neutral-content">
                    <div>
                      <span className="footer-title">Services</span>
                      <span className="link link-hover">Branding</span>
                      <span className="link link-hover">Design</span>
                      <span className="link link-hover">Marketing</span>
                      <span className="link link-hover">Advertisement</span>
                    </div>
                    <div>
                      <span className="footer-title">Company</span>
                      <span className="link link-hover">About us</span>
                      <span className="link link-hover">Contact</span>
                      <span className="link link-hover">Jobs</span>
                      <span className="link link-hover">Press kit</span>
                    </div>
                    <div>
                      <span className="footer-title">Legal</span>
                      <span className="link link-hover">Terms of use</span>
                      <span className="link link-hover">Privacy policy</span>
                      <span className="link link-hover">Cookie policy</span>
                    </div>
                  </footer>
                </div>
                {/* 左侧目录部分 */}
                <div className="drawer-side">
                  <label htmlFor="drawer-menu" className="drawer-overlay" />
                  <aside className="w-80 h-full bg-base-200">
                    <div className="sticky top-0 items-center gap-2 px-4 py-2 hidden lg:flex">
                      <a
                        className="flex-0 btn btn-ghost px-2 text-3xl"
                        href="/"
                      >
                        <span className="lowercase text-primary">hitwh</span>
                        <span>OJ</span>
                      </a>
                      <a
                        className="link link-hover font-mono text-xs text-opacity-50"
                        href="https://git.hit.edu.cn/hitwhoj/hitwhoj"
                        target="_blank"
                        rel="noreferrer"
                      >
                        {version}
                      </a>
                    </div>
                    <ul className="menu p-4 overflow-y-auto w-80 text-base-content">
                      <li>
                        <NavLink className="flex gap-4" to="/">
                          <HiOutlineHome className="w-6 h-6" />
                          <span>首页</span>
                        </NavLink>
                      </li>
                      <li>
                        <NavLink className="flex gap-4" to="/problem">
                          <HiOutlineBookOpen className="w-6 h-6" />
                          <span>题目</span>
                        </NavLink>
                      </li>
                      <li>
                        <NavLink className="flex gap-4" to="/problemset">
                          <HiOutlineCollection className="w-6 h-6" />
                          <span>题单</span>
                        </NavLink>
                      </li>
                      <li>
                        <NavLink className="flex gap-4" to="/contest">
                          <AiOutlineTrophy className="w-6 h-6" />
                          <span>比赛</span>
                        </NavLink>
                      </li>
                      <li>
                        <NavLink className="flex gap-4" to="/team">
                          <HiOutlineUserGroup className="w-6 h-6" />
                          <span>团队</span>
                        </NavLink>
                      </li>
                      <li>
                        <NavLink className="flex gap-4" to="/record">
                          <AiOutlineHistory className="w-6 h-6" />
                          <span>评测</span>
                        </NavLink>
                      </li>
                      <li>
                        <NavLink className="flex gap-4" to="/docs">
                          <HiOutlineQuestionMarkCircle className="w-6 h-6" />
                          <span>文档</span>
                        </NavLink>
                      </li>
                    </ul>
                  </aside>
                </div>
              </div>
            </MenuDrawerContext.Provider>
          </UserContext.Provider>
        </ThemeContext.Provider>
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
