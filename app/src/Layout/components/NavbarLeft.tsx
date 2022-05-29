import { NavLink, useMatches } from "@remix-run/react";
import { Menu } from "@arco-design/web-react";
import { IconAlignLeft } from "@arco-design/web-react/icon";
import { useEffect, useState } from "react";

// 左侧导航栏列表
type Route = {
  name: string;
  href: string;
  icon?: React.ReactNode;
};

const navBarRoutes: Route[] = [
  {
    name: "Problems",
    href: "/problem",
    icon: <IconAlignLeft />,
  },
  {
    name: "ProblemSet",
    href: "/problemset",
    icon: <IconAlignLeft />,
  },
  {
    name: "Contest",
    href: "/contest",
    icon: <IconAlignLeft />,
  },
  {
    name: "Team",
    href: "/team",
    icon: <IconAlignLeft />,
  },
  {
    name: "Record",
    href: "/record",
    icon: <IconAlignLeft />,
  },
  {
    name: "Comments",
    href: "/comment",
    icon: <IconAlignLeft />,
  },
  {
    name: "Docs",
    href: "/docs",
    icon: <IconAlignLeft />,
  },
];

export default function NavbarLeft() {
  const matches = useMatches();
  const [selectedKeys, setSelectedKeys] = useState<string[]>([]);
  useEffect(() => {
    const pathName = matches[1].pathname.split("/")[1];
    const selectedKey = navBarRoutes.find(
      (route) => route.href === `/${pathName}`
    );
    selectedKey?.href && setSelectedKeys([selectedKey.href]);
  }, [matches]);

  return (
    <div>
      <NavLink to="/">
        <div
          style={{
            height: "4rem",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <h1 style={{ color: "var(--color-text-1)" }}>HITwhOJ</h1>
        </div>
      </NavLink>
      <Menu
        style={{
          width: "100%",
        }}
        selectedKeys={selectedKeys}
      >
        {navBarRoutes.map((route) => (
          <NavLink prefetch="intent" to={route.href} key={route.href}>
            <Menu.Item key={route.href}>
              {route.icon}
              {route.name}
            </Menu.Item>
          </NavLink>
        ))}
      </Menu>
    </div>
  );
}
