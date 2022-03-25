import { Link } from "remix";
import { Menu, Message } from "@arco-design/web-react";
import { IconAlignLeft } from "@arco-design/web-react/icon";

// 左侧导航栏列表
type Route = {
  name: string;
  href: string;
  icon?: React.ReactNode;
};

const navBarRoutes: Route[] = [
  {
    name: "problems",
    href: "/problem",
    icon: <IconAlignLeft />,
  },
  {
    name: "problemSet",
    href: "/problemset",
    icon: <IconAlignLeft />,
  },
  {
    name: "contest",
    href: "/contest",
    icon: <IconAlignLeft />,
  },
  {
    name: "team",
    href: "/team",
    icon: <IconAlignLeft />,
  },
  {
    name: "record",
    href: "/record",
    icon: <IconAlignLeft />,
  },
  {
    name: "comments",
    href: "/comment",
    icon: <IconAlignLeft />,
  },
  {
    name: "docs",
    href: "/docs",
    icon: <IconAlignLeft />,
  },
];

export default function NavbarLeft() {
  return (
    <div>
      <Link to={"/"}>
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
      </Link>
      <Menu
        onClickMenuItem={(key) =>
          Message.info({ content: `You select ${key}`, showIcon: true })
        }
        style={{
          width: "100%",
        }}
      >
        {navBarRoutes.map((route) => (
          <Menu.Item key={route.href}>
            {route.icon}
            {route.name}
          </Menu.Item>
        ))}
      </Menu>
    </div>
  );
}
