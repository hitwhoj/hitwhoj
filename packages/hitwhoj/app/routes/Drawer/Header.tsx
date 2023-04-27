import { menuSignal, ThemeContext } from "~/utils/context";
import {
  HiLogout,
  HiOutlineChat,
  HiOutlineChevronDown,
  HiOutlineColorSwatch,
  HiOutlineGlobeAlt,
  HiOutlineMenu,
} from "react-icons/hi";
import { Link, useBeforeUnload } from "@remix-run/react";
import type { Theme } from "~/utils/theme";
import { themes } from "~/utils/theme";
import { UserAvatar } from "~/src/user/UserAvatar";
import { AiOutlineProfile, AiOutlineSearch } from "react-icons/ai";
import { useSignalFetcher, useSignalLoaderData } from "~/utils/hooks";
import { useComputed, useSignal, useSignalEffect } from "@preact/signals-react";
import { useToasts } from "~/utils/toast";
import { useCallback, useContext, useEffect } from "react";
import { fromEventSource } from "~/utils/eventSource";
import type { MessageType } from "~/routes/chat/events";
import type { ActionData } from "~/routes/logout";
import type { LoaderArgs } from "@remix-run/node";
import { json } from "@remix-run/node";
import { getCookie } from "~/utils/cookies";
import { findRequestUser } from "~/utils/permission";
import { db } from "~/utils/server/db.server";
import { selectUserData } from "~/utils/db/user";

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

export default function Header() {
  const loaderData = useSignalLoaderData<typeof loader>();
  const theme = useSignal(loaderData.value.theme);
  const themeContext = useContext(ThemeContext);
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
    <>
      <div
        className={`sticky top-0 z-30 backdrop-blur transition-all ${
          menuSignal.value ? "" : "-translate-y-full"
        }`}
      >
        <nav className="navbar flex w-full justify-end gap-4">
          <div className="flex flex-1 gap-2 lg:hidden">
            <label className="btn btn-ghost btn-square" htmlFor="drawer-menu">
              <HiOutlineMenu className="h-6 w-6" />
            </label>
            <Link className="flex-0 btn btn-ghost px-2 text-3xl" to="/1/">
              <span className="text-primary lowercase">hitwh</span>
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
            <div className="dropdown-content rounded-t-box rounded-b-box bg-base-200 text-base-content top-0 mt-16 h-[70vh] max-h-96 w-52 overflow-y-auto shadow-2xl">
              <div className="grid grid-cols-1 gap-3 p-3" tabIndex={0}>
                {themes.map((iter) => (
                  <div
                    key={iter}
                    data-theme={iter}
                    className={`text-base-content cursor-pointer rounded-lg p-3 font-sans font-bold outline-2 outline-offset-2${
                      theme.value === iter ? " outline" : ""
                    }`}
                    onClick={() => {
                      theme.value = iter;
                      themeContext.value = theme.value;
                    }}
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
                className="bg-base-300 h-12 w-12 cursor-pointer text-2xl"
              />
              <ul className="dropdown-content menu rounded-t-box rounded-b-box bg-base-200 text-base-content top-0 mt-16 w-52 p-4 shadow-2xl">
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
                  <Link to="/search">
                    <AiOutlineSearch />
                    <span>搜索用户</span>
                  </Link>
                </li>
                <li>
                  <Link to="/domain">
                    <HiOutlineGlobeAlt />
                    <span>我的团队</span>
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
    </>
  );
}
