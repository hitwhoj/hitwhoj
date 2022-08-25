import {
  isAdmin,
  or,
  Permission,
  isTeamAdmin,
  isTeamOwner,
} from "../permission";
import { db } from "~/utils/server/db.server";
import { findSessionUserOptional } from "~/utils/sessions";

async function findTeamInformation(teamId: number, self: number | undefined) {
  const team = await db.team.findUnique({
    where: { id: teamId },
    select: {
      id: true,
      members: {
        where: { userId: self ?? -1 },
      },
    },
  });

  if (!team) {
    throw new Response("团队不存在", { status: 404 });
  }

  return team;
}

async function findTeamMember(teamId: number, userId: number) {
  const member = await db.teamMember.findUnique({
    where: {
      userId_teamId: {
        userId,
        teamId,
      },
    },
    select: {
      role: true,
    },
  });

  if (!member) {
    throw new Response("成员不存在", { status: 404 });
  }

  return member;
}

/**
 * 检查用户是否有查看团队成员、题目、设置等的权限
 */
export const permissionTeamRead = new Permission(
  async (request: Request, teamId: number) => {
    const self = await findSessionUserOptional(request);
    const team = await findTeamInformation(teamId, self?.id);
    return { self, team };
  },
  or(
    // 如果是系统管理员，则具有所有的查看权限
    ({ self }) => isAdmin(self?.role),
    // 团队成员具有团队的各项查看权限
    ({ team }) => team.members.length > 0
  )
);

/**
 * 检查用户是否具有团队信息、邀请制修改权限
 */
export const permissionTeamSettings = new Permission(
  async (request: Request, teamId: number) => {
    const self = await findSessionUserOptional(request);
    const team = await findTeamInformation(teamId, self?.id);
    return { self, team };
  },
  or(
    // 如果是系统管理员，则具有所有的设置权限
    ({ self }) => isAdmin(self?.role),
    // 团队管理员具有设置权限
    ({ team }) => team.members.length > 0 && isTeamAdmin(team.members[0].role)
  )
);

/**
 * 检查用户是否具有团队解散或转让权限
 */
export const permissionTeamDissolve = new Permission(
  async (request: Request, teamId: number) => {
    const self = await findSessionUserOptional(request);
    const team = await findTeamInformation(teamId, self?.id);
    return { self, team };
  },
  or(
    // 如果是系统管理员，则具有所有的设置权限
    ({ self }) => isAdmin(self?.role),
    // 团队拥有者具有解散和转让权限
    ({ team }) => team.members.length > 0 && isTeamOwner(team.members[0].role)
  )
);

/**
 * 检查用户是否具有团队成员角色设置权限
 */
export const permissionTeamMemberRole = new Permission(
  async (request: Request, teamId: number) => {
    const self = await findSessionUserOptional(request);
    const team = await findTeamInformation(teamId, self?.id);
    return { self, team };
  },
  or(
    // 系统管理员可以设定团队成员角色
    ({ self }) => isAdmin(self?.role),
    // 团队拥有者可以设定团队成员角色
    ({ team }) => team.members.length > 0 && isTeamOwner(team.members[0].role)
  )
);

/**
 * 检查用户是否具有团队成员踢出权限
 */
export const permissionTeamMemberKick = new Permission(
  async (request: Request, teamId: number, kickMemberId: number) => {
    const self = await findSessionUserOptional(request);
    const team = await findTeamInformation(teamId, self?.id);
    const kickMember = await findTeamMember(teamId, kickMemberId);
    return { self, team, kickMember };
  },
  or(
    // 系统管理员可以踢出团队成员
    ({ self }) => isAdmin(self?.role),
    // 团队拥有者可以踢出团队成员(但不能踢自己)
    ({ team, kickMember }) =>
      team.members.length > 0 &&
      isTeamOwner(team.members[0].role) &&
      !isTeamOwner(kickMember.role),
    // 团队管理员可以提出普通成员
    ({ team, kickMember }) =>
      team.members.length > 0 &&
      isTeamAdmin(team.members[0].role) &&
      !isTeamAdmin(kickMember.role)
  )
);
