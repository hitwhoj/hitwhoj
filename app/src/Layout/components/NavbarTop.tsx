import { NavLink, useFetcher } from "@remix-run/react";
import { useContext, useEffect, useRef, useState } from "react";
import {
  Grid,
  Avatar,
  Space,
  Switch,
  Dropdown,
  Menu,
  Button,
  Divider,
  Drawer,
  Message,
} from "@arco-design/web-react";
import {
  IconUser,
  IconSun,
  IconMoon,
  IconMenu,
} from "@arco-design/web-react/icon";
import { ThemeContext } from "~/utils/context/theme";
import { UserInfoContext } from "~/utils/context/user";
import { LoginModalContext } from "~/utils/context/modal";
import { NavbarMenu } from "./NavbarMenu";
import type { ActionData as LogoutActionData } from "~/routes/logout";

const Row = Grid.Row;
const MenuItem = Menu.Item;

export default function NavbarTop() {
  const { theme, setTheme } = useContext(ThemeContext);
  const user = useContext(UserInfoContext);

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

      {/* logo placeholder */}
      <div style={{ fontSize: "1.5rem" }}>
        <NavLink to="/">HITwh OJ</NavLink>
      </div>

      <Space size="large">
        <Switch
          checked={theme === "dark"}
          onChange={() => setTheme(theme === "dark" ? "light" : "dark")}
          checkedIcon={<IconMoon />}
          uncheckedIcon={<IconSun />}
        />
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
            <Avatar
              style={{
                cursor: "pointer",
                backgroundColor: "rgb(var(--primary-6))",
              }}
            >
              {user.avatar ? (
                <img alt="avatar" src={user.avatar} />
              ) : (
                <IconUser />
              )}
            </Avatar>
          </Dropdown>
        ) : (
          <Space>
            <Button onClick={() => setLoginVisible(true)}>登录</Button>
            <Button type="primary">注册</Button>
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
