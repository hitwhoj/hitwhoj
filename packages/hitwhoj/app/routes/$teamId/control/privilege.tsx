import type { LoaderArgs, ActionArgs } from "@remix-run/node";
import { findRequestUser } from "~/utils/permission";
import { invariant } from "~/utils/invariant";
import { privilegeScheme } from "~/utils/scheme";
import { json } from "@remix-run/node";
import {
  Form,
  NavLink,
  useFetcher,
  useLoaderData,
  useTransition,
} from "@remix-run/react";
import { db } from "~/utils/server/db.server";
import { useState } from "react";
import { searchUserData } from "~/utils/db/user";
import { Privileges } from "~/utils/permission/privilege";
import { PERM_TEAM } from "~/utils/new-permission/privilege";
import {
  getAllDomainPermission,
  getAllRolesAndPrivilege,
} from "~/utils/domain/role";
import { teamIdScheme } from "~/utils/new-permission/scheme";
import { HiOutlineUserGroup } from "react-icons/hi";

type item = {
  userId: number;
  teamId: string;
  roleName: string;
};
type user = {
  id: number;
  username: string;
  role: string;
  privilege: number;
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
  return json({ roles, teamId, team, teamRole, Allroles });
}

enum ActionType {
  ChangePrivilege = "changePrivilege",
}

export async function action({ request, params }: ActionArgs) {
  const teamId = invariant(teamIdScheme, params.teamId, { status: 404 });
  const self = await findRequestUser(request);
  await self.checkPrivilege(Privileges.PRIV_OPERATE);
  const form = await request.formData();
  const _action = form.get("_action");
  switch (_action) {
    //1.更新一下,要加事物
    case ActionType.ChangePrivilege: {
      const role = String(form.get("role"));
      const privilege = invariant(privilegeScheme, form.get("privilege"));
      if (role) {
        await db.teamRole.update({
          where: { teamId_role: { teamId: teamId, role: role } },
          data: { privilege: privilege },
        });
      }
      return null;
    }
  }
  throw new Response("Invalid action", { status: 400 });
}

//priv:
function CheckBoxComponent(props: {
  privilege: number;
  domainPrivilege: number;
  role: string;
}) {
  const privilege = props.privilege;
  const domainPrivilege = props.domainPrivilege;
  const role = props.role;
  const [checked, changeChecked] = useState(
    (domainPrivilege & privilege) === domainPrivilege
  );
  console.log(
    domainPrivilege,
    privilege,
    (domainPrivilege & privilege) === domainPrivilege
  );
  const { state } = useTransition();
  const fetcher = useFetcher();
  const isUpdating = state !== "idle" || role == "Owner";
  let changeHandler = (event: any) => {
    let formData = new FormData();
    formData.append("privilege", String(privilege ^ domainPrivilege));
    formData.append("role", role);
    formData.append("_action", ActionType.ChangePrivilege);
    fetcher.submit(formData, { method: "post" });
    changeChecked(event.target.checked);
  };
  return (
    <>
      <td>
        <Form method="post">
          <input
            type="checkbox"
            checked={checked}
            className="checkbox checkbox-primary"
            disabled={isUpdating}
            onChange={(event) => changeHandler(event)}
          />
        </Form>
      </td>
    </>
  );
}
//权限管理
export default function Privilege() {
  const { Allroles, team } = useLoaderData<typeof loader>();
  const AllPermissions = getAllDomainPermission();
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
        <table className="not-prose table-compact table w-full">
          <thead>
            <tr>
              <th>权限</th>
              {Allroles.map((item) => {
                return <th key={item.role}>{item.role}</th>;
              })}
            </tr>
            {AllPermissions.map((item) => {
              return (
                <tr key={item.id}>
                  <td>{item.permName}</td>
                  {Allroles.map((temp) => {
                    return (
                      <CheckBoxComponent
                        key={temp.role}
                        role={temp.role}
                        privilege={temp.privilege}
                        domainPrivilege={item.privilege}
                      />
                    );
                  })}
                </tr>
              );
            })}
          </thead>
        </table>
      </div>
    </>
  );
}
