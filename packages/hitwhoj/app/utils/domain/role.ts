import { db } from "~/utils/server/db.server";
import { json } from "@remix-run/node";
import { PERM_TEAM, Privileges } from "~/utils/new-permission/privilege";
import { number, string } from "zod";
export const TeamMemberRole = {
  Owner: "Owner",
  Admin: "Admin",
  Member: "Member",
  Guest: "Guest",
};
export const TeamMember = {
  userId: number,
  teamId: string,
  roleName: string,
};
export const TeamRole = {
  teamId: string,
  role: string,
  description: string,
  privilege: number,
};
type Roles = {
  item: { userId: number; teamId: string; roleName: string };
  user: { id: number; username: string; role: string; privilege: number };
};
type TeamRoles = {
  teamId: string;
  role: string;
  description: string;
  privilege: number;
};
export function countRoles(roles: Roles[], teamRole: TeamRoles[]) {
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

export function getAllRoles(roles: Roles[]) {
  let AllRoles = ["Owner", "Admin", "Member"];
  for (let i = 0; i < roles.length; i++) {
    AllRoles = [...AllRoles, roles[i].item.roleName];
  }
  return AllRoles;
}

export async function getAllRolesAndPrivilege(
  roles: Roles[],
  teamRole: TeamRoles[],
  teamId: string
) {
  let allRoles = countRoles(roles, teamRole);
  let AllRoles = [{ role: "Owner", privilege: -1 }];
  for (let i = 0; i < allRoles.length; i++) {
    if (allRoles[i].role !== "Owner") {
      const role = await db.teamRole.findUnique({
        where: {
          teamId_role: { teamId: teamId, role: allRoles[i].role },
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
    permName: "查看团队内部信息",
    privilege: PERM_TEAM.PERM_TEAM_VIEW_INTERNAL,
  });
  prem.push({
    id: 2,
    permName: "修改团队内部信息",
    privilege: PERM_TEAM.PERM_TEAM_EDIT_INTERNAL,
  });
  prem.push({
    id: 3,
    permName: "团队修改成员的角色",
    privilege: PERM_TEAM.PERM_TEAM_EDIT_MEMBER_ROLE,
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
    permName: "邀请成员加入",
    privilege: PERM_TEAM.PERM_TEAM_INVITE_MEMBER,
  });
  prem.push({
    id: 7,
    permName: "添加比赛",
    privilege: PERM_TEAM.PERM_CREATE_CONTEST,
  });
  prem.push({
    id: 8,
    permName: "查看全部的比赛",
    privilege: PERM_TEAM.PERM_VIEW_CONTEST,
  });
  prem.push({
    id: 9,
    permName: "查看公开的比赛",
    privilege: PERM_TEAM.PERM_VIEW_CONTEST_PUBLIC,
  });
  prem.push({
    id: 10,
    permName: "编辑比赛",
    privilege: PERM_TEAM.PERM_EDIT_CONTEST_PUBLIC,
  });
  prem.push({
    id: 11,
    permName: "创建题目",
    privilege: PERM_TEAM.PERM_CREATE_PROBLEM,
  });
  prem.push({
    id: 12,
    permName: "查看所有题目",
    privilege: PERM_TEAM.PERM_VIEW_PROBLEM,
  });
  prem.push({
    id: 13,
    permName: "查看公开的题目",
    privilege: PERM_TEAM.PERM_VIEW_PROBLEM_PUBLIC,
  });
  prem.push({
    id: 14,
    permName: "编辑题目",
    privilege: PERM_TEAM.PERM_EDIT_PROBLEM,
  });
  prem.push({
    id: 15,
    permName: "添加题单",
    privilege: PERM_TEAM.PERM_CREATE_PROBLEM_SET,
  });
  prem.push({
    id: 16,
    permName: "查看所有题单",
    privilege: PERM_TEAM.PERM_VIEW_PROBLEM_SET,
  });
  prem.push({
    id: 17,
    permName: "查看公开的题单",
    privilege: PERM_TEAM.PERM_VIEW_PROBLEM_SET_PUBLIC,
  });
  prem.push({
    id: 18,
    permName: "编辑题单",
    privilege: PERM_TEAM.PERM_EDIT_PROBLEM_SET,
  });
  return prem;
}
export function getAllSystemPermission() {
  const prem = [];
  prem.push({
    id: 1,
    permName: "登录权限",
    privilege: Privileges.PRIV_LOGIN,
  });
  prem.push({
    id: 2,
    permName: "操作权限",
    privilege: Privileges.PRIV_OPERATE,
  });
  prem.push({
    id: 3,
    permName: "创建团队",
    privilege: Privileges.PRIV_TEAM_CREATE,
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
