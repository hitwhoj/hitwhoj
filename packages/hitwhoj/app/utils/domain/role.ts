import { db } from "~/utils/server/db.server";
import { json } from "@remix-run/node";
import { PERM_TEAM } from "~/utils/new-permission/privilege";

export const TeamMemberRole = {
  Owner: "Owner",
  Admin: "Admin",
  Member: "Member",
};
export function countRoles(props: { roles: any; teamRole: any }) {
  const roles = props.roles;
  const teamRole = props.teamRole;
  let ArrayRoles = [];
  ArrayRoles.push({ role: "Owner", count: 0, description: "系统定义的角色" });
  ArrayRoles.push({ role: "Admin", count: 0, description: "系统定义的角色" });
  ArrayRoles.push({ role: "Member", count: 0, description: "系统定义的角色" });
  let allRole = [];
  for (let i = 0; i < teamRole.length; i++) {
    allRole = ArrayRoles;
    for (let j = 0; j < allRole.length; j++) {
      if (allRole[j].role === teamRole[i].role) {
        break;
      }
      if (j === allRole.length - 1 && allRole[j].role !== teamRole[i].role) {
        allRole.push({
          role: teamRole[i].role,
          count: 0,
          description: "用户定义的角色",
        });
      }
    }
    ArrayRoles = allRole;
  }
  let temp = [];
  for (let i = 0; i < roles.length; i++) {
    temp = ArrayRoles;
    for (let j = 0; j < temp.length; j++) {
      if (temp[j].role === roles[i].item.roleName) {
        temp[j].count++;
        break;
      }
    }
    ArrayRoles = temp;
  }
  return ArrayRoles;
}

export function getAllRoles(props: { roles: any }) {
  const roles = props.roles;
  let AllRoles = ["Owner", "Admin", "Member"];
  for (let i = 0; i < roles.length; i++) {
    AllRoles = [...AllRoles, roles[i].roleName];
  }
  return AllRoles;
}

export async function getAllRolesAndPrivilege(props: {
  roles: any;
  teamRole: any;
  teamId: number;
}) {
  const roles = props.roles;
  const teamRole = props.teamRole;
  let allRoles = countRoles({ roles, teamRole });
  let AllRoles = [{ role: "Owner", privilege: -1 }];
  for (let i = 0; i < allRoles.length; i++) {
    if (allRoles[i].role !== "Owner") {
      const role = await db.teamRole.findUnique({
        where: {
          teamId_role: { teamId: props.teamId, role: allRoles[i].role },
        },
      });
      if (role) {
        AllRoles = [
          ...AllRoles,
          {
            role: role.role,
            privilege: role.privilege,
          },
        ];
      } else {
        AllRoles = [
          ...AllRoles,
          {
            role: allRoles[i].role,
            privilege: 0,
          },
        ];
      }
    }
  }
  return AllRoles;
}

export function getAllDomainPermission() {
  const prem = [];
  prem.push({
    id: 1,
    permName: "团队修改成员的角色",
    privilege: PERM_TEAM.PERM_TEAM_EDIT_MEMBER_ROLE,
  });
  prem.push({
    id: 2,
    permName: "查看团队内部信息",
    privilege: PERM_TEAM.PERM_TEAM_VIEW_INTERNAL,
  });
  prem.push({
    id: 3,
    permName: "修改团队内部信息",
    privilege: PERM_TEAM.PERM_TEAM_EDIT_INTERNAL,
  });
  prem.push({
    id: 4,
    permName: "踢出管理员",
    privilege: PERM_TEAM.PERM_TEAM_KICK_ADMIN,
  });
  prem.push({
    id: 5,
    permName: "踢出普通成员",
    privilege: PERM_TEAM.PERM_TEAM_KICK_MEMBER,
  });
  prem.push({
    id: 6,
    permName: "管理员直接邀请其他成员加入",
    privilege: PERM_TEAM.PERM_TEAM_INVITE_ADMIN,
  });
  prem.push({
    id: 7,
    permName: "团队成员直接邀请其他成员加入",
    privilege: PERM_TEAM.PERM_TEAM_INVITE_MEMBER,
  });
  return prem;
}

export async function getUserAndRole(userId: number) {
  const teams = await db.teamMember.findMany({
    where: {
      userId: userId,
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
    let privilege = await db.teamRole.findUnique({
      where: {
        teamId_role: { role: item.roleName, teamId: item.teamId },
      },
      select: { privilege: true },
    });
    team = Object.assign(team, item);
    team = Object.assign(team, privilege);
    domains.push(team);
  }
  return json(domains);
}
