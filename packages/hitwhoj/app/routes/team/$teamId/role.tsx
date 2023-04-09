import type { LoaderArgs, ActionArgs } from "@remix-run/node";
import { findRequestUser } from "~/utils/permission";
import { invariant } from "~/utils/invariant";
import { json } from "@remix-run/node";
import { Form, useLoaderData } from "@remix-run/react";
import { db } from "~/utils/server/db.server";
import { searchUserData } from "~/utils/db/user";
import { Privileges } from "~/utils/permission/privilege";
import { PERM_TEAM } from "~/utils/new-permission/privilege";
import { countRoles, getAllRolesAndPrivilege } from "~/utils/domain/role";
import { HiOutlinePlus } from "react-icons/hi";
import { teamIdScheme, teamRoleScheme } from "~/utils/new-permission/scheme";

export async function loader({ request, params }: LoaderArgs) {
  const self = await findRequestUser(request);
  const teamId = invariant(teamIdScheme, params.teamId, { status: 404 });
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
  let roles = [];
  for (let i = 0; i < teamMember.length; i++) {
    const item = teamMember[i];
    const user = await db.user.findUnique({
      where: {
        id: item.userId,
      },
      select: searchUserData,
    });
    roles = [...roles, { item, user }];
  }
  const teamRole = await db.teamRole.findMany({
    where: {
      teamId: teamId,
    },
  });
  const Allroles = await getAllRolesAndPrivilege(roles, teamRole, teamId);
  return json({ roles, teamId, teamRole, Allroles });
}
const TeamMemberRole = ["Owner", "Admin", "Member"];
export async function action({ request, params }: ActionArgs) {
  const teamId = invariant(teamIdScheme, params.teamId, { status: 404 });
  const self = await findRequestUser(request);
  await self.checkPrivilege(Privileges.PRIV_OPERATE);

  const form = await request.formData();
  const _action = form.get("_action");
  switch (_action) {
    case ActionType.CreateRole: {
      //1.要开事务
      const role = invariant(teamRoleScheme, form.get("role"));
      if (TeamMemberRole.includes(role)) {
        throw new Response("Role已经存在", { status: 404 });
      }
      const hasRole = await db.teamRole.findUnique({
        where: { teamId_role: { role: role, teamId: teamId } },
      });
      if (hasRole !== null) {
        throw new Response("Role已经存在", { status: 404 });
      }
      await db.teamRole.create({
        data: {
          role: role,
          description: "用户定义的角色",
          privilege: PERM_TEAM.PERM_MEMBER,
          teamId: teamId,
        },
      });
      return null;
    }
  }
  throw new Response("Invalid action", { status: 400 });
}
enum ActionType {
  CreateRole = "createRole",
}
//角色管理
function DomainRole(props: { roles: any; teamRole: any }) {
  const roles = props.roles;
  const teamRole = props.teamRole;
  const ArrayRoles = countRoles(roles, teamRole);
  return (
    <div>
      <table className="not-prose table-compact table w-full">
        <thead>
          <tr>
            <th>角色</th>
            <th>说明</th>
            <th>用户数</th>
          </tr>
        </thead>
        <tbody>
          {ArrayRoles.map((item) => {
            return (
              <tr key={item.role}>
                <td>{item.role}</td>
                <td>{item.description}</td>
                <td>{item.count}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

export default function Role() {
  const { roles, teamRole } = useLoaderData<typeof loader>();
  return (
    <div>
      <h2 className="flex items-center justify-between">
        <span>团队角色</span>
        <label htmlFor="my-modal" className="btn btn-primary gap-2">
          <HiOutlinePlus />
          创建角色
        </label>
      </h2>
      <input type="checkbox" id="my-modal" className="modal-toggle" />
      <div className="modal">
        <div className="modal-box">
          <Form method="post">
            <div className="form-control">
              <span className="label-text">角色名:</span>
              <input
                type="text"
                placeholder="Role"
                name="role"
                required
                pattern="\w+"
                className="input input-bordered"
              />
            </div>
            <button
              className="btn btn-primary gap-2"
              type="submit"
              name="_action"
              value={ActionType.CreateRole}
            >
              <span>提交</span>
            </button>
            <span> </span>
            <label htmlFor="my-modal" className="btn">
              取消
            </label>
          </Form>
        </div>
      </div>
      <DomainRole roles={roles} teamRole={teamRole} />
    </div>
  );
}
