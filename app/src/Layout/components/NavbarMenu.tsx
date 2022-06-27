import { NavLink, useMatches } from "@remix-run/react";
import { Menu, Space, Tabs } from "@arco-design/web-react";
import {
  IconArchive,
  IconBook,
  IconHistory,
  IconMessage,
  IconQuestionCircle,
  IconTrophy,
  IconUserGroup,
} from "@arco-design/web-react/icon";
import { useEffect, useState } from "react";

// 左侧导航栏列表
const navBarRoutes = [
  {
    name: "题目",
    href: "/problem",
    icon: <IconBook />,
  },
  {
    name: "题单",
    href: "/problemset",
    icon: <IconArchive />,
  },
  {
    name: "比赛",
    href: "/contest",
    icon: <IconTrophy />,
  },
  {
    name: "团队",
    href: "/team",
    icon: <IconUserGroup />,
  },
  {
    name: "评测",
    href: "/record",
    icon: <IconHistory />,
  },
  {
    name: "讨论",
    href: "/comment",
    icon: <IconMessage />,
  },
  {
    name: "文档",
    href: "/docs",
    icon: <IconQuestionCircle />,
  },
];

export function NavbarTabs() {
  const matches = useMatches();
  const [selectedKey, setSelectedKey] = useState("");

  useEffect(() => {
    const pathname = matches.at(1)?.pathname.split("/")?.[1];
    const selectedKey = navBarRoutes.find(
      (route) => route.href === `/${pathname}`
    );
    setSelectedKey(selectedKey ? selectedKey.href : "");
  }, [matches]);

  return (
    <Tabs
      activeTab={selectedKey}
      direction="vertical"
      size="large"
      type="text"
      className="navbar-left"
    >
      {navBarRoutes.map((route) => (
        <Tabs.TabPane
          key={route.href}
          title={
            <NavLink to={route.href}>
              <Space>
                {route.icon}
                {route.name}
              </Space>
            </NavLink>
          }
        />
      ))}
    </Tabs>
  );
}

export function NavbarMenu({ close }: { close: () => void }) {
  const matches = useMatches();
  const [selectedKey, setSelectedKey] = useState("");

  useEffect(() => {
    const pathname = matches.at(1)?.pathname.split("/")?.[1];
    const selectedKey = navBarRoutes.find(
      (route) => route.href === `/${pathname}`
    );
    setSelectedKey(selectedKey ? selectedKey.href : "");
  }, [matches]);

  return (
    <Menu selectedKeys={[selectedKey]} tabIndex={undefined}>
      {navBarRoutes.map((route) => (
        <NavLink to={route.href} key={route.href}>
          <Menu.Item key={route.href} onClick={close}>
            {route.icon}
            {route.name}
          </Menu.Item>
        </NavLink>
      ))}
    </Menu>
  );
}
