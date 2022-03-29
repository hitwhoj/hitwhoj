import { Link } from "remix";
import { useContext, useState, useEffect } from "react";
import { UserInfoContext } from "~/root";
import {
  Grid,
  Avatar,
  Space,
  Switch,
  Dropdown,
  Menu,
} from "@arco-design/web-react";
import { IconUser, IconSun, IconMoon } from "@arco-design/web-react/icon";

const Row = Grid.Row;
const Col = Grid.Col;
const MenuItem = Menu.Item;

export default function NavbarLeft() {
  const { user, uid } = useContext(UserInfoContext);
  const [theme, setTheme] = useState<string | null>();
  useEffect(() => {
    // document.body.setAttribute('arco-theme', 'dark');
    setTheme(document.body.getAttribute("arco-theme"));
  }, []);
  const changeTheme = (value: boolean) => {
    if (!value) {
      document.body.setAttribute("arco-theme", "dark");
      setTheme("dark");
    } else {
      document.body.setAttribute("arco-theme", "light");
      setTheme("light");
    }
  };

  return (
    <Row
      justify="end"
      align="center"
      style={{
        height: "4rem",
        backgroundColor: "var(--color-bg-2)",
      }}
    >
      <Col span={4}>
        <Space size="large">
          <Switch
            checked={theme !== "dark"}
            onChange={changeTheme}
            checkedIcon={<IconSun />}
            uncheckedIcon={<IconMoon />}
          />
          {uid ? (
            <Link to={`/user/${uid}`}>
              <Dropdown
                position="bottom"
                droplist={
                  <Menu>
                    <MenuItem key="profile">
                      <Link to={`/user/${uid}`}>profile</Link>
                    </MenuItem>
                    <MenuItem key="settings">
                      <Link to={`/user/${uid}/edit`}>settings</Link>
                    </MenuItem>
                    <MenuItem key="logout">
                      <Link to="/logout">logout</Link>
                    </MenuItem>
                  </Menu>
                }
              >
                <Avatar style={{ backgroundColor: "#00d0b6" }}>
                  {user?.avatar ? (
                    <img alt="avatar" src={user?.avatar} />
                  ) : (
                    <IconUser />
                  )}
                </Avatar>
              </Dropdown>
            </Link>
          ) : (
            <Avatar style={{ backgroundColor: "#14a9f8" }}>
              <IconUser />
            </Avatar>
          )}
        </Space>
      </Col>
    </Row>
  );
}
