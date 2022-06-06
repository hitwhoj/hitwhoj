import type { LoaderFunction } from "@remix-run/node";
import { Link, Outlet, useLoaderData, useMatches } from "@remix-run/react";
import { db } from "~/utils/server/db.server";
import type { Team } from "@prisma/client";
import { invariant } from "~/utils/invariant";
import { idScheme } from "~/utils/scheme";
import { useState, useEffect } from "react";
import { Menu } from "@arco-design/web-react";
const MenuItem = Menu.Item;

type LoaderData = {
  team: Team;
};

export const loader: LoaderFunction<LoaderData> = async ({ params }) => {
  const teamId = invariant(idScheme, params.teamId);
  const team = await db.team.findUnique({
    where: { id: teamId },
  });
  if (!team) {
    throw new Response("Team not found", { status: 404 });
  }

  return { team };
};

const MenuItems = [
  {
    name: "Index",
    href: "",
  },
  {
    name: "Homework",
    href: "homework",
  },
  {
    name: "Members",
    href: "members",
  },
  {
    name: "Settings",
    href: "settings",
  },
];

export default function Record() {
  const { team } = useLoaderData<LoaderData>();
  const matches = useMatches();
  const [selectedKeys, setSelectedKeys] = useState<string[]>([]);
  useEffect(() => {
    const activeMenuItem = matches[2].pathname.split("/")[3];
    const selectedKey = MenuItems.find((item) => item.href === activeMenuItem);
    if (selectedKey) {
      setSelectedKeys([selectedKey.name]);
    }
  }, [matches]);

  return (
    <div>
      <h1> Team:{team.name} </h1>
      <Menu
        mode="horizontal"
        selectedKeys={selectedKeys}
        style={{
          width: "100%",
          paddingLeft: 0,
        }}
      >
        {MenuItems.map((item) => (
          <MenuItem key={item.name}>
            <Link to={item.href}>{item.name}</Link>
          </MenuItem>
        ))}
      </Menu>
      <Outlet />
    </div>
  );
}
