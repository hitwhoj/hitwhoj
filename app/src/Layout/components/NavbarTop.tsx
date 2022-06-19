import { NavLink } from "@remix-run/react";
import { useContext, useState } from "react";
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

const Row = Grid.Row;
const MenuItem = Menu.Item;

export default function NavbarTop() {
  const { theme, setTheme } = useContext(ThemeContext);
  const user = useContext(UserInfoContext);

  const setLoginVisible = useContext(LoginModalContext);

  const [menuVisible, setMenuVisible] = useState(false);

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
              <Menu>
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
                <NavLink to="/logout">
                  <MenuItem
                    key="logout"
                    style={{ color: "rgb(var(--danger-6))" }}
                  >
                    登出
                  </MenuItem>
                </NavLink>
              </Menu>
            }
          >
            <Avatar style={{ backgroundColor: "#00d0b6", cursor: "pointer" }}>
              {user.avatar ? (
                <img alt="avatar" src={user.avatar} />
              ) : (
                <IconUser />
              )}
            </Avatar>
          </Dropdown>
        ) : (
          <Space size="medium">
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
    </Row>
  );
}
