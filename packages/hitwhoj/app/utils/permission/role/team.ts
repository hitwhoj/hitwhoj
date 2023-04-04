import { db } from "~/utils/server/db.server";
import type { TeamPermission } from "~/utils/permission/permission/team";
import { ContestUser } from "~/utils/permission/role/contest";
import type { User } from "~/utils/permission/role/user";

/**
 * 如果资源与团队有关，则调用团队的权限检查
 */
export class TeamUser {
  readonly user: User;
  readonly teamId: string | null;
  private role: string | "Guest" | null = null;
  private privilege: number | null = null;
  constructor(user: User, teamId: string | null) {
    this.user = user;
    this.teamId = teamId;
  }

  contest(contestId: number | null) {
    return new ContestUser(this, contestId);
  }

  private async initialize() {
    if (this.role === null) {
      if (this.user.userId && this.teamId) {
        const member = await db.teamMember.findUnique({
          where: {
            userId_teamId: {
              userId: this.user.userId,
              teamId: this.teamId,
            },
          },
          select: { roleName: true },
        });
        if (member) {
          this.role = member.roleName;
          const memberPrivilege = await db.teamRole.findUnique({
            where: {
              teamId_role: {
                role: member.roleName,
                teamId: this.teamId,
              },
            },
            select: { privilege: true },
          });
          this.privilege = memberPrivilege?.privilege ?? null;
        }
      }
      // fallback non-team resource to guest
      this.role ??= "Guest";
      this.privilege ??= null;
    }
    return { role: this.role, privilege: this.privilege };
  }
  async hasPrivilege(...privileges: number[]) {
    const { privilege } = await this.initialize();
    let flag: boolean[] = [];
    privileges.map((item) => {
      if (!privilege) {
        flag.push(false);
      } else if ((privilege & item) === item) {
        flag.push(true);
      } else {
        flag.push(false);
      }
    });
    return flag;
  }
  async checkPrivilege(...privileges: number[]) {
    const privilege = await this.hasPrivilege(...privileges);
    if (privilege.some((item) => !item)) {
      throw new Response("Privilege denied", { status: 403 });
    }
  }
  async hasPermission(...permissions: TeamPermission[]) {
    const { role } = await this.initialize();

    const fallback = await this.user.hasPermission(
      ...permissions.map(({ fallback }) => fallback)
    );

    if (!this.teamId) return fallback;

    return permissions.map((permission, index) => {
      if (fallback[index]) return true;

      switch (role) {
        case "Owner":
          return permission.owner;
        case "Admin":
          return permission.admin;
        case "Member":
          return permission.member;
        case "Guest":
          return permission.guest;
        default:
          return false;
      }
    });
  }
  async checkPermission(...permissions: TeamPermission[]) {
    const perms = await this.hasPermission(...permissions);
    if (perms.some((perm) => !perm)) {
      throw new Response("Permission denied", { status: 403 });
    }
  }
  async hasPrivilegeOrPermission(
    privilege: number,
    permission: TeamPermission
  ) {
    return (
      (await this.hasPrivilege(privilege)) ||
      (await this.hasPermission(permission))
    );
  }
  async checkPrivilegeOrPermission(
    privilege: number,
    permission: TeamPermission
  ) {
    const privileges = await this.hasPrivilege(privilege);
    if (privileges.some((item) => !item)) {
      await this.checkPermission(permission);
    }
  }
}
