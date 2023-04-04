import type { LoaderArgs } from "@remix-run/node";
import { json } from "@remix-run/node";
import { findRequestUser } from "~/utils/permission";
import { db } from "~/utils/server/db.server";
import { searchUserData } from "~/utils/db/user";
import { Link, useLoaderData } from "@remix-run/react";
import { HiOutlinePlus } from "react-icons/hi";

import { PERM_TEAM } from "~/utils/new-permission/privilege";
export async function loader({ request }: LoaderArgs) {
  const self = await findRequestUser(request);
  if (self.userId !== null) {
    const user = await db.user.findUnique({
      where: {
        id: self.userId,
      },
      select: searchUserData,
    });
    if (!user) {
      throw new Response("您还没有登录", { status: 404 });
    }
    const teams = await db.teamMember.findMany({
      where: {
        userId: self.userId,
      },
    });
    let domains = [];
    for (let i = 0; i < teams.length; i++) {
      let item = teams[i];
      let team = await db.team.findUnique({
        where: {
          id: item.teamId,
        },
      });
      const [hasEditPriv] = await self
        .team(item.teamId)
        .hasPrivilege(
          PERM_TEAM.PERM_TEAM_VIEW_INTERNAL,
          PERM_TEAM.PERM_TEAM_EDIT_INTERNAL
        );
      team = Object.assign(team, item);
      team = Object.assign(team, hasEditPriv);
      domains.push(team);
    }
    return json({ user, domains });
  } else {
    throw new Response("User not found", { status: 404 });
  }
}
export function TbodyCompoent(props: {
  name: any;
  role: any;
  action: any;
  hasPrivilege: any;
}) {
  const { name, role, action, hasPrivilege } = props;
  const link = "/team/".concat(action).concat("/profile");
  const config = "/team/".concat(action).concat("/role");
  return (
    <tbody>
    <tr key={name}>
      <td>{name}</td>
      <td>
        <span className="badge">{role}</span>
      </td>
      <td>
        {action == 0 ? (
          <Link to="/">
            <span>查看</span>
          </Link>
        ) : (
          <>
            <Link to={link}>
              <span>查看</span>
            </Link>
            {hasPrivilege || role === "Owner" ? (
              <>
                ,
                <Link to={config}>
                  <span>管理</span>
                </Link>
              </>
            ) : (
              <></>
            )}
          </>
        )}
      </td>
    </tr>
    </tbody>
  );
}
export default function Domain() {
  const { user, domains } = useLoaderData<typeof loader>();
  console.log(domains);
  return (
    <div>
      <h1 className="flex items-center justify-between">
        <span>我的团队</span>
        {
          <Link to="/team/new" className="btn btn-primary gap-2">
            <HiOutlinePlus className="h-4 w-4" />
            <span>新建团队</span>
          </Link>
        }
      </h1>
      <table className="not-prose table-compact table w-full">
        <thead>
        <tr>
          <th>名称</th>
          <th>我的角色</th>
          <th>动作</th>
        </tr>
        </thead>
        <TbodyCompoent
          name={"System"}
          role={user.role}
          action={0}
          hasPrivilege={-1}
        />
        {domains.map((item) => {
          return item?.id ?? null ? (
            <TbodyCompoent
              key={item.id}
              hasPrivilege={item.hasEditPriv}
              name={item.name}
              role={item.roleName}
              action={item.teamId}
            />
          ) : null;
        })}
      </table>
    </div>
  );
}
