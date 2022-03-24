import { Link } from "remix";
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
    icon: <div />,
  },
  {
    name: "problemSet",
    href: "/problemset",
    icon: <div />,
  },
  {
    name: "contest",
    href: "/contest",
    icon: <div />,
  },
  {
    name: "team",
    href: "/team",
    icon: <div />,
  },
  {
    name: "record",
    href: "/record",
    icon: <div />,
  },
  {
    name: "comments",
    href: "/comment",
    icon: <div />,
  },
  {
    name: "docs",
    href: "/docs",
    icon: <div />,
  },
];

export default function NavbarLeft(props: { drawerWidth: string }) {
  return (
    /**
     * sx={{
        width: `${props.drawerWidth}`,
        "& .MuiDrawer-paper": {
          width: `${props.drawerWidth}`,
          boxSizing: "border-box",
        },
      }}
     */
    <div>
      <div>
        <Link to={"/"}>
          <h1>HITwhOJ</h1>
        </Link>
      </div>
      <div>
        width-{props.drawerWidth}
        <ul>
          {navBarRoutes.map((route: Route) => (
            <li key={route.href}>
              <Link to={route.href} key={route.href}>
                {route.name}
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
