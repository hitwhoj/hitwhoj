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
  useFetcher,
  useLoaderData,
} from "@remix-run/react";
import { db } from "~/utils/server/db.server";
import type { MessageType } from "./routes/chat/events";
import { findRequestUser } from "./utils/permission";
import { selectUserData } from "./utils/db/user";
import { UserContext } from "./utils/context/user";
import { fromEventSource } from "./utils/eventSource";
import {
  HiLogout,
  HiOutlineBookOpen,
  HiOutlineChat,
  HiOutlineChevronDown,
  HiOutlineChevronLeft,
  HiOutlineChevronRight,
  HiOutlineCollection,
  HiOutlineColorSwatch,
  HiOutlineHome,
  HiOutlineMenu,
  HiOutlineQuestionMarkCircle,
  HiOutlineUserGroup,
  HiX,
} from "react-icons/hi";
import {
  AiOutlineHistory,
  AiOutlineProfile,
  AiOutlineQq,
  AiOutlineTrophy,
  AiOutlineWechat,
} from "react-icons/ai";
import { FaTelegramPlane } from "react-icons/fa";
import { SiElement } from "react-icons/si";
import { version } from "../package.json";

import style from "./styles/app.css";
import katexStyle from "katex/dist/katex.css";
import { getCookie } from "./utils/cookies";
import type { Theme } from "./utils/theme";
import { darkThemes, ThemeContext } from "./utils/theme";
import { themes } from "./utils/theme";
import { MenuDrawerContext } from "./utils/context/menu";
import { UserAvatar } from "./src/user/UserAvatar";
import type { Toast } from "./utils/context/toast";
import { ToastContext } from "./utils/context/toast";
import type { ActionData } from "./routes/logout";

import adimg from "./assets/ad.jpg";
import hitwh from "./assets/hitwh.png";

export const links: LinksFunction = () => [
  { rel: "stylesheet", href: style },
  { rel: "stylesheet", href: katexStyle },
  { rel: "preload", href: adimg, as: "image" },
  { rel: "preload", href: hitwh, as: "image" },
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

// this make sure @tailwind compiles
const alertClassName = {
  info: "alert-info",
  success: "alert-success",
  error: "alert-error",
  warning: "alert-warning",
};

// https://remix.run/api/conventions#default-export
// https://remix.run/api/conventions#route-filenames
export default function App() {
  const { user, theme: defaultTheme } = useLoaderData<typeof loader>();
  const [theme, setTheme] = useState(defaultTheme);
  const [menuEnable, setMenuEnable] = useState(true);

  useEffect(() => {
    document.cookie = `theme=${theme}; Path=/; Max-Age=31536000; SameSite=Lax;`;
  }, [theme]);

  const [toasts, setToasts] = useState<Toast[]>([]);
  const addToast = (toast: Toast) => {
    setToasts((toasts) => [...toasts, toast]);
    setTimeout(() => setToasts((toasts) => [...toasts.slice(1)]), 5000);
  };
  const info = (message: string) => addToast({ type: "info", message });
  const success = (message: string) => addToast({ type: "success", message });
  const error = (message: string) => addToast({ type: "error", message });
  const warning = (message: string) => addToast({ type: "warning", message });

  useEffect(() => {
    if (user?.id) {
      // 订阅新私聊消息
      const subscription = fromEventSource<MessageType>(
        "/chat/events"
      ).subscribe((message) => {
        info(
          `收到来自 ${message.from.nickname || message.from.username} 的新消息`
        );
      });

      return () => subscription.unsubscribe();
    }
  }, [user?.id]);

  const fetcher = useFetcher<ActionData>();
  const isLogoutSubmit =
    fetcher.state === "submitting" && fetcher.type === "actionSubmission";
  useEffect(() => {
    if (!isLogoutSubmit && fetcher.data) {
      if (fetcher.data.success) {
        success("退出登录成功");
      } else {
        error(fetcher.data.reason ?? "退出登录失败");
      }
    }
  }, [isLogoutSubmit]);

  const [adFooterShow, setAdFooterShow] = useState(true);
  const ads = [
    {
      title: "广告位0招租",
      content: "广告位滞销，救救我们😭",
      image: adimg,
    },
    {
      title: "广告位1招租",
      content: "广告位1滞销，救救我们😭",
      image: adimg,
    },
    {
      title: "广告位2招租",
      content: "广告位2滞销，救救我们😭",
      image: adimg,
    },
  ];

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
      <body className="font-sans relative">
        <div
          className={`bg-base-100 drawer${menuEnable ? " drawer-mobile" : ""}`}
        >
          <input id="drawer-menu" type="checkbox" className="drawer-toggle" />
          {/* 整个网站右边部分 */}
          <div className="drawer-content flex flex-col h-full">
            {/* 顶部导航栏 */}
            <div className="sticky top-0 bg-base-100 z-10">
              <nav className="navbar w-full flex justify-end gap-4">
                <div className="flex-1 flex gap-2 lg:hidden">
                  <label
                    className="btn btn-ghost btn-square"
                    htmlFor="drawer-menu"
                  >
                    <HiOutlineMenu className="w-6 h-6" />
                  </label>
                  <Link className="flex-0 btn btn-ghost px-2 text-3xl" to="/">
                    <span className="lowercase text-primary">hitwh</span>
                    <span>OJ</span>
                  </Link>
                </div>
                {/* 主题切换按钮 */}
                <div className="dropdown dropdown-end">
                  <div className="btn gap-2 normal-case btn-ghost" tabIndex={0}>
                    <HiOutlineColorSwatch className="w-6 h-6" />
                    <span className="hidden md:inline-block">主题</span>
                    <HiOutlineChevronDown className="w-3 h-3 hidden md:block" />
                  </div>
                  <div className="dropdown-content bg-base-200 text-base-content rounded-t-box rounded-b-box top-0 max-h-96 h-[70vh] w-52 overflow-y-auto shadow-2xl mt-16">
                    <div className="grid grid-cols-1 gap-3 p-3" tabIndex={0}>
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
                {user ? (
                  <div className="dropdown dropdown-end w-12 h-12">
                    <UserAvatar
                      user={user}
                      tabIndex={0}
                      className="w-12 h-12 cursor-pointer bg-base-300 text-2xl"
                    />
                    <ul className="dropdown-content bg-base-200 text-base-content rounded-t-box rounded-b-box w-52 shadow-2xl top-0 mt-16 p-4 menu">
                      <li>
                        <Link to={`/user/${user.id}`}>
                          <AiOutlineProfile />
                          <span>资料</span>
                        </Link>
                      </li>
                      <li>
                        <Link to="/chat/user">
                          <HiOutlineChat />
                          <span>聊天</span>
                        </Link>
                      </li>
                      <li>
                        <fetcher.Form action="/logout" method="post">
                          <HiLogout />
                          <button type="submit">退出登录</button>
                        </fetcher.Form>
                      </li>
                    </ul>
                  </div>
                ) : (
                  <>
                    <Link className="btn btn-outline" to="/login">
                      登录
                    </Link>
                    <Link className="btn btn-primary" to="/register">
                      注册
                    </Link>
                  </>
                )}
              </nav>
            </div>
            {/* 中间部分 */}
            <div className="p-6 flex-1">
              <div className="prose w-full max-w-4xl">
                <ThemeContext.Provider value={theme}>
                  <ToastContext.Provider
                    value={{ info, success, error, warning }}
                  >
                    <UserContext.Provider value={user && user.id}>
                      <MenuDrawerContext.Provider value={setMenuEnable}>
                        <Outlet />
                      </MenuDrawerContext.Provider>
                    </UserContext.Provider>
                  </ToastContext.Provider>
                </ThemeContext.Provider>
              </div>
            </div>
            {/* 底部 */}
            <footer className="footer p-10 bg-neutral text-neutral-content">
              {/* About */}
              <div>
                <span className="footer-title">About</span>
                <a
                  href="https://www.hitwh.edu.cn/"
                  target="_blank"
                  rel="noreferrer"
                >
                  <div
                    className="w-[221px] h-[48px] bg-neutral-content"
                    style={{ mask: `url(${hitwh})`, maskSize: "cover" }}
                  />
                </a>
                <p>
                  HITwh OJ Dev Team. Presents
                  <br />
                  Providing unstable service since 2022
                </p>
              </div>
              {/* Advertisement */}
              <div className={!adFooterShow ? "hidden" : "max-w-sm"}>
                <span className="footer-title">
                  Advertisement
                  <button
                    className="btn btn-circle btn-xs ml-3"
                    onClick={() => setAdFooterShow(false)}
                  >
                    <HiX />
                  </button>
                </span>
                <div className="carousel w-full">
                  {ads.map((ad, idx) => (
                    <div
                      key={idx}
                      id={`advertise-${idx}`}
                      className="carousel-item card card-side w-full"
                    >
                      <figure>
                        <img
                          src={ad.image}
                          alt="ad"
                          className="h-24 w-24 cursor-pointer"
                          onClick={() => info("您获得了「屠龙宝刀」*1")}
                        />
                      </figure>
                      <div className="card-body">
                        <div className="card-title">{ad.title}</div>
                        <p>{ad.content}</p>
                        <div className="card-actions justify-end">
                          <a
                            className="btn btn-sm btn-circle"
                            href={`#advertise-${
                              (idx - 1 + ads.length) % ads.length
                            }`}
                          >
                            <HiOutlineChevronLeft />
                          </a>
                          <a
                            className="btn btn-sm btn-circle"
                            href={`#advertise-${(idx + 1) % ads.length}`}
                          >
                            <HiOutlineChevronRight />
                          </a>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              {/* Contact */}
              <div>
                <span className="footer-title">Contact</span>
                <div className="grid grid-flow-col gap-4">
                  <a
                    target="_blank"
                    href="https://qm.qq.com/cgi-bin/qm/qr?k=uFHY05vPwIamUXG6L-xDQvhkA0acwZqA&jump_from=webapi&authKey=96ylLScWBoTxF6zMOsP7wdIbC/7PN1bMs5T74AIOpqeBE6h4NAGnYx/ngkxkVhyx"
                    className="tooltip tooltip-bottom tooltip-info"
                    data-tip="HITwh OJ 反馈×吹水"
                    rel="noreferrer"
                  >
                    <AiOutlineQq className="w-6 h-6" />
                  </a>
                  <span
                    className="tooltip tooltip-bottom tooltip-info"
                    data-tip="很遗憾，我们并没有微信反馈群~"
                  >
                    <AiOutlineWechat className="w-6 h-6" />
                  </span>
                  <a
                    href="https://t.me/hitwhmoe"
                    target="_blank"
                    rel="noreferrer"
                    className="tooltip tooltip-bottom tooltip-info"
                    data-tip="@hitwhmoe"
                  >
                    <FaTelegramPlane className="w-6 h-6" />
                  </a>
                  <a
                    href="https://matrix.to/#/#hitwh:mozilla.org"
                    target="_blank"
                    rel="noreferrer"
                    className="tooltip tooltip-bottom tooltip-info"
                    data-tip="#hitwh:mozilla.org"
                  >
                    <SiElement className="w-6 h-6" />
                  </a>
                </div>
              </div>
            </footer>
          </div>
          {/* 左侧目录部分 */}
          <div className="drawer-side">
            <label htmlFor="drawer-menu" className="drawer-overlay" />
            <aside className="w-80 h-full bg-base-200 flex flex-col">
              <div className="sticky top-0 items-center gap-2 px-4 py-2 hidden lg:flex">
                <Link className="flex-0 btn btn-ghost px-2 text-3xl" to="/">
                  <span className="lowercase text-primary">hitwh</span>
                  <span>OJ</span>
                </Link>
                <a
                  className="link link-hover font-mono text-xs text-opacity-50"
                  href="https://git.hit.edu.cn/hitwhoj/hitwhoj"
                  target="_blank"
                  rel="noreferrer"
                >
                  {version}
                </a>
              </div>
              <ul className="menu p-4 overflow-y-auto w-80 text-base-content flex-1">
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
                  <NavLink
                    className="flex gap-4"
                    to={user ? `/record?uid=${user.id}` : "/record"}
                  >
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
              {/* Advertisement Premium */}
              <div className="mockup-window bg-base-300 m-4">
                <div className="px-4 pb-4">
                  <h2 className="text-2xl font-bold">至尊广告位招租</h2>
                  <p>至尊广告位滞销，救救我们😭</p>
                  <img
                    src={adimg}
                    alt="advertise"
                    className="h-24 w-24 m-auto cursor-pointer"
                    onClick={() => info("您获得了「屠龙宝刀」*1")}
                  />
                </div>
              </div>
            </aside>
          </div>
        </div>
        {toasts.length > 0 && (
          <div
            className="toast toast-center toast-top w-full items-center"
            // 屏蔽外部盒子的点击事件
            style={{ pointerEvents: "none" }}
          >
            {toasts.map((toast, index) => (
              <div
                className="max-w-sm"
                key={index}
                // 恢复内部元素的点击事件
                style={{ pointerEvents: "auto" }}
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
