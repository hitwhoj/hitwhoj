import { Link, NavLink, useFetcher } from "@remix-run/react";
import { useContext, useEffect, useRef, useState } from "react";
import {
  Grid,
  Space,
  Dropdown,
  Menu,
  Button,
  Divider,
  Drawer,
  Message,
} from "@arco-design/web-react";
import { IconSun, IconMoon, IconMenu } from "@arco-design/web-react/icon";
import { ThemeContext } from "~/utils/context/theme";
import { LoginModalContext } from "~/utils/context/modal";
import { NavbarMenu } from "./NavbarMenu";
import type { ActionData as LogoutActionData } from "~/routes/logout";
import { UserAvatar } from "~/src/user/UserAvatar";
import type { UserData } from "~/utils/db/user";

const Row = Grid.Row;
const MenuItem = Menu.Item;

type NavbarTopProps = {
  user: UserData | null;
};

export default function NavbarTop({ user }: NavbarTopProps) {
  const { theme, setTheme } = useContext(ThemeContext);

  const setLoginVisible = useContext(LoginModalContext);
  const [menuVisible, setMenuVisible] = useState(false);

  const fetcher = useFetcher<LogoutActionData>();
  const logoutButton = useRef<HTMLButtonElement | null>(null);
  const isLoggingout = fetcher.state !== "idle";

  useEffect(() => {
    if (!isLoggingout && fetcher.data) {
      if (fetcher.data.success) {
        Message.success("退出成功");
      } else {
        Message.error("退出失败：" + fetcher.data.reason);
      }
    }
  }, [isLoggingout]);

  return (
    <Row
      justify="space-between"
      align="center"
      style={{
        height: "4rem",
        backgroundColor: "var(--color-bg-3)",
      }}
      className="py-20%"
    >
      <div
        className="navbar-menu-opener"
        style={{ fontSize: "1.5rem" }}
        onClick={() => setMenuVisible(true)}
      >
        <IconMenu />
      </div>

      {/* TODO: logo placeholder */}
      <div style={{ fontSize: "1.5rem" }}>
        <NavLink to="/">HITwh OJ</NavLink>
      </div>

      <Space size="large">
        <div
          onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
          style={{ fontSize: 20, cursor: "pointer" }}
        >
          {theme === "dark" ? <IconMoon /> : <IconSun />}
        </div>

        {user ? (
          <Dropdown
            position="bottom"
            droplist={
              <Menu style={{ border: "none" }}>
                <NavLink to={`/user/${user.id}`}>
                  <MenuItem key="user">
                    {user.nickname && <b>{user.nickname} </b>}
                    <span>@{user.username}</span>
                  </MenuItem>
                </NavLink>
                <Divider style={{ margin: "5px 0" }} />
                <NavLink to={`/user/${user.id}`}>
                  <MenuItem key="profile">资料</MenuItem>
                </NavLink>
                <NavLink to={`/user/${user.id}/edit`}>
                  <MenuItem key="settings">设置</MenuItem>
                </NavLink>
                <MenuItem
                  key="logout"
                  style={{ color: "rgb(var(--danger-6))" }}
                  onClick={() => logoutButton.current?.click()}
                >
                  登出
                </MenuItem>
              </Menu>
            }
          >
            <UserAvatar
              user={user}
              style={{
                cursor: "pointer",
                backgroundColor: "rgb(var(--primary-6))",
              }}
            />
          </Dropdown>
        ) : (
          <Space>
            <Button onClick={() => setLoginVisible(true)}>登录</Button>
            <Link to="/register">
              <Button type="primary">注册</Button>
            </Link>
          </Space>
        )}
      </Space>

      <Drawer
        visible={menuVisible}
        placement="left"
        title="菜单"
        footer={null}
        closable={false}
        bodyStyle={{ backgroundColor: "var(--color-menu-light-bg)" }}
        onOk={() => setMenuVisible(false)}
        onCancel={() => setMenuVisible(false)}
      >
        <NavbarMenu close={() => setMenuVisible(false)} />
      </Drawer>

      <fetcher.Form method="post" action="/logout" hidden>
        <button type="submit" hidden ref={logoutButton} />
      </fetcher.Form>
    </Row>
  );
}
