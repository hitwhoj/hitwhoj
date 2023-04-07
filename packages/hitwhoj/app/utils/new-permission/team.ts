import { db } from "~/utils/server/db.server";
import type { User } from "~/utils/permission/role/user";
import { NewContestUser } from "~/utils/new-permission/contest";

/**
 * 如果资源与团队有关，则调用团队的权限检查
 */
export class NewTeamUser {
  readonly user: User;
  readonly teamId: string | null;
  private role: string | "Guest" | null = null;
  private privilege: number | null = null;
  constructor(user: User, teamId: string | null) {
    this.user = user;
    this.teamId = teamId;
  }

  contest(contestId: number | null) {
    return new NewContestUser(this, contestId);
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
          select: {
            roleName: true,
            role: { select: { role: true, privilege: true } },
          },
        });
        if (member) {
          this.role = member.roleName;
          this.privilege = member.role.privilege;
        }
      }
      // fallback non-team resource to guest
      this.role ??= "Guest";
      this.privilege ??= null;
    }
    console.log(this.role, this.privilege);
    return { role: this.role, privilege: this.privilege };
  }
  async hasPrivilege(...privileges: number[]) {
    const { privilege } = await this.initialize();
    return privileges.map(
      (item) => privilege !== null && (privilege & item) === item
    );
  }
  async checkPrivilege(...privileges: number[]) {
    const privilege = await this.hasPrivilege(...privileges);
    if (privilege.some((item) => !item)) {
      throw new Response("Privilege denied", { status: 403 });
    }
  }
}
