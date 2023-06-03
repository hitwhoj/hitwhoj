// @ts-ignore
import type { TeamMemberRole } from "@prisma/client";
import { db } from "~/utils/server/db.server";
import type { TeamPermission } from "../permission/team";
import { ContestUser } from "./contest";
import type { User } from "./user";

/**
 * 如果资源与团队有关，则调用团队的权限检查
 */
export class TeamUser {
  readonly user: User;
  readonly teamId: string | null;
  private role: TeamMemberRole | "Guest" | null = null;

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
}
