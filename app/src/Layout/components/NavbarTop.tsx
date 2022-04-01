import { Link, NavLink } from "remix";
import { useState, useEffect } from "react";
import {
  Grid,
  Avatar,
  Space,
  Switch,
  Dropdown,
  Menu,
  Button,
  Divider,
} from "@arco-design/web-react";
import { IconUser, IconSun, IconMoon } from "@arco-design/web-react/icon";
import { User } from "@prisma/client";

const Row = Grid.Row;
const MenuItem = Menu.Item;

type NavbarTopProps = {
  theme: string;
  user: Pick<User, "uid" | "username" | "nickname" | "avatar"> | null;
};

export default function NavbarTop({
  theme: initialTheme,
  user,
}: NavbarTopProps) {
  const [theme, setTheme] = useState<string>(initialTheme);

  useEffect(() => {
    document.body.setAttribute("arco-theme", theme);
    document.cookie = `theme=${theme}; path=/; max-age=31536000`;
  }, [theme]);

  return (
    <Row
      justify="end"
      align="center"
      style={{
        height: "4rem",
        padding: "0 5%",
        backgroundColor: "var(--color-bg-2)",
      }}
    >
      <Space size="large">
        <Switch
          checked={theme !== "dark"}
          onChange={() => setTheme(theme === "dark" ? "light" : "dark")}
          checkedIcon={<IconSun />}
          uncheckedIcon={<IconMoon />}
        />
        {user ? (
          <Link to={`/user/${user.uid}`}>
            <Dropdown
              position="bottom"
              droplist={
                <Menu>
                  <NavLink to={`/user/${user.uid}`}>
                    <MenuItem key="user">
                      {user.nickname && <div></div>}
                      <div>
                        <b>{user.nickname} </b>
                        <span>@{user.username}</span>
                      </div>
                    </MenuItem>
                  </NavLink>
                  <Divider style={{ margin: "5px 0" }} />
                  <NavLink to={`/user/${user.uid}`}>
                    <MenuItem key="profile">资料</MenuItem>
                  </NavLink>
                  <NavLink to={`/user/${user.uid}/edit`}>
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
              <Avatar style={{ backgroundColor: "#00d0b6" }}>
                {user.avatar ? (
                  <img alt="avatar" src={user.avatar} />
                ) : (
                  <IconUser />
                )}
              </Avatar>
            </Dropdown>
          </Link>
        ) : (
          <Space size="medium">
            <Link to="/login" aria-label="login">
              <Button>登录</Button>
            </Link>
            <Link to="/register" aria-label="register">
              <Button type="primary">注册</Button>
            </Link>
          </Space>
        )}
      </Space>
    </Row>
  );
}
