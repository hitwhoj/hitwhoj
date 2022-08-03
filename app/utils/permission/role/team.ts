import type { TeamMemberRole } from "@prisma/client";
import { db } from "~/utils/server/db.server";
import { ContestUser } from "./contest";
import type { User } from "./user";
import { UserPermission } from "./user";

/**
 * 团队中用户的权限
 *
 * [Owner, Admin, Member, Guest]
 */
export class TeamPermission {
  constructor(
    readonly owner: boolean,
    readonly admin: boolean,
    readonly member: boolean,
    readonly guest: boolean,
    readonly fallback = UserPermission.Admins
  ) {}

  with(fallback: UserPermission) {
    return new TeamPermission(
      this.owner,
      this.admin,
      this.member,
      this.guest,
      fallback
    );
  }

  static Everyone = new TeamPermission(true, true, true, true);
  static Members = new TeamPermission(true, true, true, false);
  static Admins = new TeamPermission(true, true, false, false);
  static Owners = new TeamPermission(true, false, false, false);
  static Nobody = new TeamPermission(false, false, false, false);
}

/**
 * 如果资源与团队有关，则调用团队的权限检查
 */
export class TeamUser {
  readonly user: User;
  readonly teamId: number | null;
  private role: TeamMemberRole | "Guest" | null = null;

  constructor(user: User, teamId: number | null) {
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
          select: { role: true },
        });
        this.role = member?.role ?? "Guest";
      }
      // fallback non-team resource to guest
      this.role ??= "Guest";
    }

    return { role: this.role };
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
      }
    });
  }

  async checkPermission(...permissions: TeamPermission[]) {
    const perms = await this.hasPermission(...permissions);
    if (perms.some((perm) => !perm)) {
      throw new Response("Permission denied", { status: 403 });
    }
  }
}
