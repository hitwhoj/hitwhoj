import type { LoaderArgs } from "@remix-run/node";
import { json } from "@remix-run/node";
import { findRequestUser } from "~/utils/permission";
import { db } from "~/utils/server/db.server";
import { searchUserData } from "~/utils/db/user";
import { Link, useLoaderData } from "@remix-run/react";
import { HiOutlinePlus } from "react-icons/hi";
type Props = {
  id: string,
  name: string,
  userId:number,
  teamId:string,
  roleName:string,
  hasEditPriv:boolean
}
import { PERM_TEAM } from "~/utils/new-permission/privilege";
export async function loader({ request }: LoaderArgs) {
  const self = await findRequestUser(request);
  if (!self.userId) {
    throw new Response("User not found", { status: 404 });
  }
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
      select:{
        id:true,
        name:true,
      }
    });
    const [hasEditPriv] = await self
      .newTeam(item.teamId)
      .hasPrivilege(PERM_TEAM.PERM_TEAM_EDIT_INTERNAL);
    team = Object.assign(team, item);
    team = Object.assign(team, { hasEditPriv: hasEditPriv });
    domains.push(team);
    console.log('temp:',team)
  }
  return json({ user, domains });
}
export function TbodyComponent(props: {
  name: string;
  role: string;
  action: string;
  hasPrivilege: boolean;
}) {
  const { name, role, action, hasPrivilege } = props;
  const link = `/${action}/`;
  const config = `/${action}/control/role`;
  return (
    <tbody>
      <tr key={name}>
        <td>{name}</td>
        <td>
          <span className="badge">{role}</span>
        </td>
        <td>
          {
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
          }
        </td>
      </tr>
    </tbody>
  );
}
export default function Domain() {
  const { domains } = useLoaderData<typeof loader>();
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
        {domains.map((item) => {
          return item?.id ?? null ? (
            <TbodyComponent
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
