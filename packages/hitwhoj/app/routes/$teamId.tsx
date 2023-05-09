import { Link, NavLink, Outlet } from "@remix-run/react";
import { db } from "~/utils/server/db.server";
import { invariant } from "~/utils/invariant";
import type { LoaderArgs } from "@remix-run/node";
import { json } from "@remix-run/node";
import { findRequestUser } from "~/utils/permission";
import {
  HiLogout,
  HiOutlineBookOpen,
  HiOutlineChat,
  HiOutlineChevronDown,
  HiOutlineCode,
  HiOutlineCog,
  HiOutlineCollection,
  HiOutlineColorSwatch,
  HiOutlineGlobeAlt,
  HiOutlineHome,
  HiOutlineMenu,
  HiOutlineQuestionMarkCircle,
  HiOutlineUserGroup,
} from "react-icons/hi";
import { useSignalFetcher, useSignalLoaderData } from "~/utils/hooks";
import { useComputed, useSignal, useSignalEffect } from "@preact/signals-react";
import { PERM_TEAM } from "~/utils/new-permission/privilege";
import { teamIdScheme } from "~/utils/new-permission/scheme";
import { version } from "../../package.json";
import {
  AiOutlineHistory,
  AiOutlineProfile,
  AiOutlineSearch,
  AiOutlineTrophy,
} from "react-icons/ai";
import { menuSignal, ThemeContextTest } from "~/utils/context";
import Footer from "~/routes/Drawer/Footer";
import type { Theme } from "~/utils/theme";
import { themes } from "~/utils/theme";
import { UserAvatar } from "~/src/user/UserAvatar";
import { selectUserData } from "~/utils/db/user";
import { getCookie } from "~/utils/cookies";
import { useContext, useEffect } from "react";
import { fromEventSource } from "~/utils/eventSource";
import type { MessageType } from "~/routes/chat/events";
import type { ActionData } from "~/routes/logout";
import { useToasts } from "~/utils/toast";
export async function loader({ request, params }: LoaderArgs) {
  let theme = getCookie(request, "theme") ?? "light";
  if (!themes.includes(theme as Theme)) {
    theme = "light";
  }
  const teamId = invariant(teamIdScheme, params.teamId, { status: 404 });
  const self = await findRequestUser(request);
  if (!self.userId) {
    return json({
      hasEditPerm: false,
      teamId: null,
      userId: null,
      theme: theme as Theme,
      user: null,
    });
  }
  const user = await db.user.findUnique({
    where: { id: self.userId! },
    select: selectUserData,
  });
  const [hasEditPerm] = await self
    .newTeam(teamId)
    .hasPrivilege(PERM_TEAM.PERM_TEAM_EDIT_INTERNAL);
  const team = await db.team.findUnique({
    where: { id: teamId },
    select: { name: true },
  });

  if (!team) {
    throw new Response("团队不存在", { status: 404 });
  }

  return json({
    theme: theme as Theme,
    hasEditPerm,
    teamId,
    userId: self.userId,
    user,
  });
}
export default function Record() {
  const loaderData = useSignalLoaderData<typeof loader>();
  const theme = useSignal(loaderData.value.theme);
  const themeContext = useContext(ThemeContextTest);
  const hasEditPerm = useComputed(() => loaderData.value.hasEditPerm);
  const teamId = useComputed(() => loaderData.value.teamId ?? 1);
  const userId = useComputed(() => loaderData.value.userId ?? null);
  const user = useComputed(() => loaderData.value.user);
  const Toasts = useToasts();
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
                      <Link to={`/${teamId}/user/${user.value.id}`}>
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
                      <Link to={`/${teamId}/search`}>
                        <AiOutlineSearch />
                        <span>搜索用户</span>
                      </Link>
                    </li>
                    <li>
                      <Link to={`/${teamId}/domain`}>
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
                  <Link className="btn btn-outline" to={`/${teamId}/login/`}>
                    登录
                  </Link>
                  <Link className="btn btn-primary" to={`/${teamId}/register/`}>
                    注册
                  </Link>
                </>
              )}
            </nav>
          </div>
          {/* 中间部分 */}
          <div className="flex-1 p-6">
            <div className="prose w-full max-w-4xl">
              <Outlet />
            </div>
          </div>
          {/* 底部 */}
          <Footer />
        </div>
        <div className="drawer-side">
          <label htmlFor="drawer-menu" className="drawer-overlay" />
          <aside className="bg-base-200 flex h-full w-80 flex-col">
            <div className="sticky top-0 hidden items-center gap-2 px-4 py-2 lg:flex">
              <Link className="flex-0 btn btn-ghost px-2 text-3xl" to="/1/">
                <span className="text-primary lowercase">hitwh</span>
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
            <ul className="menu text-base-content w-80 flex-1 overflow-y-auto p-4">
              <li>
                <NavLink className="flex gap-4" to={`/${teamId}/`}>
                  <HiOutlineHome className="h-6 w-6" />
                  <span>首页</span>
                </NavLink>
              </li>
              <li>
                <NavLink className="flex gap-4" to={`/${teamId}/problem`}>
                  <HiOutlineBookOpen className="h-6 w-6" />
                  <span>题目</span>
                </NavLink>
              </li>
              <li>
                <NavLink className="flex gap-4" to={`/${teamId}/problemset`}>
                  <HiOutlineCollection className="h-6 w-6" />
                  <span>题单</span>
                </NavLink>
              </li>
              <li>
                <NavLink className="flex gap-4" to={`/${teamId}/contest`}>
                  <AiOutlineTrophy className="h-6 w-6" />
                  <span>比赛</span>
                </NavLink>
              </li>
              <li>
                <NavLink className="flex gap-4" to={`/${teamId}/team`}>
                  <HiOutlineUserGroup className="h-6 w-6" />
                  <span>团队</span>
                </NavLink>
              </li>
              {hasEditPerm.value && (
                <li>
                  <NavLink className="flex gap-4" to={`/${teamId}/control`}>
                    <HiOutlineCog className="h-6 w-6" />
                    <span>管理</span>
                  </NavLink>
                </li>
              )}
              <li>
                <NavLink
                  className="flex gap-4"
                  to={
                    userId
                      ? `/${teamId}/record?uid=${userId.value}`
                      : `/${teamId}/record`
                  }
                >
                  <AiOutlineHistory className="h-6 w-6" />
                  <span>评测</span>
                </NavLink>
              </li>
              <li>
                <NavLink className="flex gap-4" to={`/${teamId}/docs`}>
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
    </>
  );
}

export { CatchBoundary } from "~/src/CatchBoundary";
export { ErrorBoundary } from "~/src/ErrorBoundary";
