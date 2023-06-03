//用户管理
import { countRoles } from "~/utils/domain/role";
import type { LoaderArgs, ActionArgs } from "@remix-run/node";
import { findRequestUser } from "~/utils/permission";
import { invariant } from "~/utils/invariant";
import { idScheme } from "~/utils/scheme";
import { json } from "@remix-run/node";
import {
  Form,
  Link,
  NavLink,
  useFetcher,
  useLoaderData,
} from "@remix-run/react";
import { db } from "~/utils/server/db.server";
import { searchUserData } from "~/utils/db/user";
import { Privileges } from "~/utils/permission/privilege";
import { PERM_TEAM } from "~/utils/new-permission/privilege";
import { getAllRolesAndPrivilege } from "~/utils/domain/role";
import { HiOutlinePlus, HiOutlineUserGroup } from "react-icons/hi";
import { teamIdScheme, teamRoleScheme } from "~/utils/new-permission/scheme";
import { UserAvatar } from "~/src/user/UserAvatar";

type item = {
  userId: number;
  teamId: string;
  roleName: string;
};
type user = {
  id: number;
  username: string;
  nickname: string;
  role: string;
  privilege: number;
  avatar: string;
  bio: string;
  premium: boolean;
};
type Props = {
  user: user;
  item: item;
};
export async function loader({ request, params }: LoaderArgs) {
  const self = await findRequestUser(request);
  const teamId = invariant(teamIdScheme, params.teamId, { status: 404 });
  const team = await db.team.findUnique({
    where: { id: teamId },
  });
  if (!team) {
    throw new Response("团队不存在", { status: 404 });
  }
  await self
    .newTeam(teamId)
    .checkPrivilege(
      PERM_TEAM.PERM_TEAM_VIEW_INTERNAL,
      PERM_TEAM.PERM_TEAM_EDIT_INTERNAL
    );
  const teamMember = await db.teamMember.findMany({
    where: {
      teamId: teamId,
    },
  });
  let roles: Props[] = [];
  for (let i = 0; i < teamMember.length; i++) {
    const item = teamMember[i];
    const user = await db.user.findUnique({
      where: {
        id: item.userId,
      },
      select: searchUserData,
    });
    // @ts-ignore
    roles = [...roles, { item, user }];
  }
  const teamRole = await db.teamRole.findMany({
    where: {
      teamId: teamId,
    },
  });
  const Allroles = await getAllRolesAndPrivilege(roles, teamRole, teamId);
  return json({ roles, team, teamRole, Allroles });
}
enum ActionType {
  ChangeRole = "changeRole",
  AddUser = "addUser",
}
export async function action({ request, params }: ActionArgs) {
  const teamId = invariant(teamIdScheme, params.teamId, { status: 404 });
  const self = await findRequestUser(request);
  await self.checkPrivilege(Privileges.PRIV_OPERATE);
  const form = await request.formData();
  const _action = form.get("_action");
  switch (_action) {
    case ActionType.ChangeRole: {
      //1.更新一下,要加事物
      const role = invariant(teamRoleScheme, form.get("role"));
      const userId = invariant(idScheme, form.get("userId"));
      const oldRole = await db.teamMember.findUnique({
        where: {
          userId_teamId: { userId: userId, teamId },
        },
      });
      if (!oldRole) {
        throw new Response("原角色不存在", { status: 403 });
      }
      if (role !== oldRole.roleName) {
        await db.teamMember.update({
          where: {
            userId_teamId: { userId: userId, teamId },
          },
          data: {
            roleName: role,
          },
        });
      }
      return null;
    }
    case ActionType.AddUser: {
      const userId = invariant(idScheme, form.get("userId"));
      const user = await db.user.findUnique({
        where: {
          id: userId,
        },
      });
      if (!user) {
        throw new Response("用户不存在", { status: 404 });
      }
      const hasTeam = await db.teamMember.findUnique({
        where: {
          userId_teamId: { userId: userId, teamId },
        },
      });
      if (hasTeam) {
        throw new Response("用户已经存在域中", { status: 404 });
      }
      await db.teamMember.create({
        data: {
          userId: userId,
          teamId: teamId,
          roleName: "Member",
        },
      });
      return null;
    }
  }
  throw new Response("Invalid action", { status: 400 });
}
export default function Users() {
  const { roles, teamRole, team } = useLoaderData<typeof loader>();
  const Allroles = countRoles(roles, teamRole);
  const fetcher = useFetcher();
  let selectHandler = (event: any, id: string) => {
    let formData = new FormData();
    formData.append("userId", id);
    formData.append("role", event.target.value);
    formData.append("_action", "changeRole");
    fetcher.submit(formData, { method: "post" });
  };
  return (
    <>
      <h1 className="flex items-center gap-4">
        <HiOutlineUserGroup className="shrink-0" />
        <span>{team.name}</span>
      </h1>
      <div className="not-prose tabs tabs-boxed bg-base-100">
        <NavLink className="tab" to={`/${team.id}/control/role`}>
          角色
        </NavLink>
        <NavLink className="tab" to={`/${team.id}/control/users`}>
          用户
        </NavLink>
        <NavLink className="tab" to={`/${team.id}/control/privilege`}>
          权限
        </NavLink>
        <NavLink className="tab" to={`/${team.id}/control/settings`}>
          设置
        </NavLink>
      </div>
      <div>
        <h2 className="flex items-center justify-between">
          <span>团队成员</span>
          <label htmlFor="user-modal" className="btn btn-primary gap-2">
            <HiOutlinePlus />
            添加用户
          </label>
        </h2>
        <input type="checkbox" id="user-modal" className="modal-toggle" />
        <div className="modal">
          <div className="modal-box">
            <Form method="post">
              <div className="form-control">
                <span className="label-text">用户id:</span>
                <input
                  type="text"
                  placeholder="UserId"
                  name="userId"
                  required
                  pattern="\w+"
                  className="input input-bordered"
                />
              </div>
              <button
                className="btn btn-primary gap-2"
                type="submit"
                name="_action"
                value={ActionType.AddUser}
              >
                <span>提交</span>
              </button>
              <span> </span>
              <label htmlFor="user-modal" className="btn">
                取消
              </label>
            </Form>
          </div>
        </div>
      </div>
      <div>
        <table className="not-prose table-compact table w-full">
          <thead>
            <tr>
              <th>用户ID</th>
              <th>用户名</th>
              <th>角色</th>
            </tr>
          </thead>
          <tbody>
            {roles.map((role) => {
              return (
                <>
                  <tr key={role.user.id}>
                    <td>{role.user.id}</td>
                    <td>
                      <div className="flex items-center gap-4">
                        <UserAvatar
                          user={role.user}
                          className="bg-base-100 h-16 w-16 shrink-0 text-2xl"
                        />
                        <div>
                          <Link
                            to={`/${team.id}/user/${role.user.id}`}
                            className="link link-hover block font-bold"
                          >
                            {role.user.username}
                          </Link>
                        </div>
                      </div>
                    </td>
                    <td>
                      <select
                        className="select select-primary"
                        defaultValue={role.item.roleName}
                        onChange={() =>
                          selectHandler(event, role.item.userId.toString())
                        }
                      >
                        {Allroles.map((item) => {
                          return <option key={item.role}>{item.role}</option>;
                        })}
                      </select>
                    </td>
                  </tr>
                </>
              );
            })}
          </tbody>
        </table>
      </div>
    </>
  );
}
