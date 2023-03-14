import { useCallback, useEffect } from "react";
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
  useBeforeUnload,
} from "@remix-run/react";
import { db } from "~/utils/server/db.server";
import type { MessageType } from "./routes/chat/events";
import { findRequestUser } from "./utils/permission";
import { selectUserData } from "./utils/db/user";
import { fromEventSource } from "./utils/eventSource";
import {
  HiLogout,
  HiOutlineBookOpen,
  HiOutlineChat,
  HiOutlineChevronDown,
  HiOutlineChevronLeft,
  HiOutlineChevronRight,
  HiOutlineCode,
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
import { darkThemes } from "./utils/theme";
import { themes } from "./utils/theme";
import { UserAvatar } from "./src/user/UserAvatar";
import type { ActionData } from "./routes/logout";

import adimg from "./assets/ad.jpg";
import hitwh from "./assets/hitwh.png";
import qqgroup from "./assets/qq.svg";
import { useSignalFetcher, useSignalLoaderData } from "./utils/hooks";
import { toastSignal, useToasts } from "./utils/toast";
import { useComputed, useSignal, useSignalEffect } from "@preact/signals-react";
import { menuSignal, ThemeContext, UserContext } from "./utils/context";

export const links: LinksFunction = () => [
  { rel: "stylesheet", href: style },
  { rel: "stylesheet", href: katexStyle },
  { rel: "preload", href: adimg, as: "image" },
  { rel: "preload", href: hitwh, as: "image" },
  { rel: "preload", href: qqgroup, as: "image" },
];

const qqlink =
  "https://qm.qq.com/cgi-bin/qm/qr?k=uFHY05vPwIamUXG6L-xDQvhkA0acwZqA&jump_from=webapi&authKey=96ylLScWBoTxF6zMOsP7wdIbC/7PN1bMs5T74AIOpqeBE6h4NAGnYx/ngkxkVhyx";

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

// https://remix.run/api/conventions#default-export
// https://remix.run/api/conventions#route-filenames
export default function App() {
  const loaderData = useSignalLoaderData<typeof loader>();

  const theme = useSignal(loaderData.value.theme);
  const user = useComputed(() => loaderData.value.user);
  const userId = useComputed(() => loaderData.value.user?.id ?? null);

  const Toasts = useToasts();

  // set dark theme if first time visit
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
  useSignalEffect(() => {
    if (fetcher.done.value && fetcher.data.value) {
      if (fetcher.data.value.success) {
        Toasts.success("退出登录成功");
      } else {
        Toasts.error(fetcher.data.value.reason ?? "退出登录失败");
      }
    }
  });

  const showFooterAdvertise = useSignal(true);

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
        <div
          className={`drawer bg-base-100 ${
            menuSignal.value ? "drawer-mobile" : ""
          }`}
        >
          <input id="drawer-menu" type="checkbox" className="drawer-toggle" />
          {/* 整个网站右边部分 */}
          <div className="drawer-content flex h-full flex-col">
            {/* 顶部导航栏 */}
            <div
              className={`sticky top-0 z-30 backdrop-blur transition-all ${
                menuSignal.value ? "" : "-translate-y-full"
              }`}
            >
              <nav className="navbar flex w-full justify-end gap-4">
                <div className="flex flex-1 gap-2 lg:hidden">
                  <label
                    className="btn btn-ghost btn-square"
                    htmlFor="drawer-menu"
                  >
                    <HiOutlineMenu className="h-6 w-6" />
                  </label>
                  <Link className="flex-0 btn btn-ghost px-2 text-3xl" to="/">
                    <span className="lowercase text-primary">hitwh</span>
                    <span>OJ</span>
                  </Link>
                </div>
                {/* 主题切换按钮 */}
                <div className="dropdown dropdown-end">
                  <div className="btn btn-ghost gap-2 normal-case" tabIndex={0}>
                    <HiOutlineColorSwatch className="h-6 w-6" />
                    <span className="hidden md:inline-block">主题</span>
                    <HiOutlineChevronDown className="hidden h-3 w-3 md:block" />
                  </div>
                  <div className="dropdown-content rounded-t-box rounded-b-box top-0 mt-16 h-[70vh] max-h-96 w-52 overflow-y-auto bg-base-200 text-base-content shadow-2xl">
                    <div className="grid grid-cols-1 gap-3 p-3" tabIndex={0}>
                      {themes.map((iter) => (
                        <div
                          key={iter}
                          data-theme={iter}
                          className={`cursor-pointer rounded-lg p-3 font-sans font-bold text-base-content outline-2 outline-offset-2${
                            theme.value === iter ? " outline" : ""
                          }`}
                          onClick={() => (theme.value = iter)}
                        >
                          {iter}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
                {/* 用户头像 */}
                {user.value ? (
                  <div className="dropdown-end dropdown h-12 w-12">
                    <UserAvatar
                      user={user.value}
                      tabIndex={0}
                      className="h-12 w-12 cursor-pointer bg-base-300 text-2xl"
                    />
                    <ul className="dropdown-content menu rounded-t-box rounded-b-box top-0 mt-16 w-52 bg-base-200 p-4 text-base-content shadow-2xl">
                      <li>
                        <Link to={`/user/${user.value.id}`}>
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
            <div className="flex-1 p-6">
              <div className="prose w-full max-w-4xl">
                <ThemeContext.Provider value={theme.value}>
                  <UserContext.Provider value={user.value && user.value.id}>
                    <Outlet />
                  </UserContext.Provider>
                </ThemeContext.Provider>
              </div>
            </div>
            {/* 底部 */}
            <footer className="footer bg-neutral p-10 text-neutral-content">
              {/* About */}
              <div>
                <span className="footer-title">About</span>
                <a
                  href="https://www.hitwh.edu.cn/"
                  target="_blank"
                  rel="noreferrer"
                >
                  <div
                    className="h-[48px] w-[221px] bg-neutral-content"
                    style={{
                      maskImage: `url(${hitwh})`,
                      maskSize: "cover",
                      WebkitMaskImage: `url(${hitwh})`,
                      WebkitMaskSize: "cover",
                    }}
                  />
                </a>
                <p>
                  HITwh OJ Dev Team. Presents
                  <br />
                  Providing unstable service since 2022
                </p>
              </div>
              {/* Advertisement */}
              <div
                className={showFooterAdvertise.value ? "max-w-sm" : "hidden"}
              >
                <span className="footer-title">
                  Advertisement
                  <button
                    className="btn btn-circle btn-xs ml-3"
                    onClick={() => (showFooterAdvertise.value = false)}
                  >
                    <HiX />
                  </button>
                </span>
                <div className="carousel w-full">
                  {ads.map((ad, idx) => (
                    <div
                      key={idx}
                      id={`advertise-${idx}`}
                      className="card carousel-item card-side w-full"
                    >
                      <figure>
                        <img
                          src={ad.image}
                          alt="ad"
                          className="h-24 w-24 cursor-pointer"
                          onClick={() => Toasts.info("您获得了「屠龙宝刀」*1")}
                        />
                      </figure>
                      <div className="card-body">
                        <div className="card-title">{ad.title}</div>
                        <p>{ad.content}</p>
                        <div className="card-actions justify-end">
                          <a
                            className="btn btn-circle btn-sm"
                            href={`#advertise-${
                              (idx - 1 + ads.length) % ads.length
                            }`}
                          >
                            <HiOutlineChevronLeft />
                          </a>
                          <a
                            className="btn btn-circle btn-sm"
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
                    href={qqlink}
                    className="tooltip tooltip-bottom tooltip-info"
                    data-tip="HITwh OJ 反馈×吹水"
                    rel="noreferrer"
                  >
                    <AiOutlineQq className="h-6 w-6" />
                  </a>
                  <span
                    className="tooltip tooltip-bottom tooltip-info"
                    data-tip="很遗憾，我们并没有微信反馈群~"
                  >
                    <AiOutlineWechat className="h-6 w-6" />
                  </span>
                  <a
                    href="https://t.me/hitwhmoe"
                    target="_blank"
                    rel="noreferrer"
                    className="tooltip tooltip-bottom tooltip-info"
                    data-tip="@hitwhmoe"
                  >
                    <FaTelegramPlane className="h-6 w-6" />
                  </a>
                  <a
                    href="https://matrix.to/#/#hitwh:mozilla.org"
                    target="_blank"
                    rel="noreferrer"
                    className="tooltip tooltip-bottom tooltip-info"
                    data-tip="#hitwh:mozilla.org"
                  >
                    <SiElement className="h-6 w-6" />
                  </a>
                </div>
              </div>
            </footer>
          </div>
          {/* 左侧目录部分 */}
          <div className="drawer-side">
            <label htmlFor="drawer-menu" className="drawer-overlay" />
            <aside className="flex h-full w-80 flex-col bg-base-200">
              <div className="sticky top-0 hidden items-center gap-2 px-4 py-2 lg:flex">
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
              <ul className="menu w-80 flex-1 overflow-y-auto p-4 text-base-content">
                <li>
                  <NavLink className="flex gap-4" to="/">
                    <HiOutlineHome className="h-6 w-6" />
                    <span>首页</span>
                  </NavLink>
                </li>
                <li>
                  <NavLink className="flex gap-4" to="/problem">
                    <HiOutlineBookOpen className="h-6 w-6" />
                    <span>题目</span>
                  </NavLink>
                </li>
                <li>
                  <NavLink className="flex gap-4" to="/problemset">
                    <HiOutlineCollection className="h-6 w-6" />
                    <span>题单</span>
                  </NavLink>
                </li>
                <li>
                  <NavLink className="flex gap-4" to="/contest">
                    <AiOutlineTrophy className="h-6 w-6" />
                    <span>比赛</span>
                  </NavLink>
                </li>
                <li>
                  <NavLink className="flex gap-4" to="/team">
                    <HiOutlineUserGroup className="h-6 w-6" />
                    <span>团队</span>
                  </NavLink>
                </li>
                <li>
                  <NavLink
                    className="flex gap-4"
                    to={user.value ? `/record?uid=${user.value.id}` : "/record"}
                  >
                    <AiOutlineHistory className="h-6 w-6" />
                    <span>评测</span>
                  </NavLink>
                </li>
                <li>
                  <NavLink className="flex gap-4" to="/docs">
                    <HiOutlineQuestionMarkCircle className="h-6 w-6" />
                    <span>文档</span>
                  </NavLink>
                </li>
                <li>
                  <NavLink className="flex gap-4" to="/playground">
                    <HiOutlineCode className="h-6 w-6" />
                    <span>在线编程</span>
                  </NavLink>
                </li>
              </ul>
            </aside>
          </div>
        </div>
        {/* 顶部弹窗 */}
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
