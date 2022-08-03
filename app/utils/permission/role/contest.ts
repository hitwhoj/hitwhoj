import type { ContestParticipantRole } from "@prisma/client";
import { db } from "~/utils/server/db.server";
import type { TeamUser } from "./team";
import { TeamPermission } from "./team";

/**
 * 用户在比赛中的权限
 *
 * [Mod, Jury, Contestant, Guest]
 */
export class ContestPermission {
  constructor(
    readonly mod: boolean,
    readonly jury: boolean,
    readonly contestant: boolean,
    readonly guest: boolean,
    readonly fallback = TeamPermission.Admins
  ) {}

  with(fallback: TeamPermission) {
    return new ContestPermission(
      this.mod,
      this.jury,
      this.contestant,
      this.guest,
      fallback
    );
  }

  static Everyone = new ContestPermission(true, true, true, true);
  static Contestants = new ContestPermission(true, true, true, false);
  static Juries = new ContestPermission(true, true, false, false);
  static Mods = new ContestPermission(true, false, false, false);
  static Nobody = new ContestPermission(false, false, false, false);
}

export class ContestUser {
  readonly team: TeamUser;
  readonly contestId: number | null;
  private role: ContestParticipantRole | "Guest" | null = null;

  constructor(team: TeamUser, contestId: number | null) {
    this.team = team;
    this.contestId = contestId;
  }

  private async initialize() {
    if (this.role === null) {
      if (this.contestId && this.team.user.userId) {
        const participant = await db.contestParticipant.findUnique({
          where: {
            contestId_userId: {
              contestId: this.contestId,
              userId: this.team.user.userId,
            },
          },
          select: { role: true },
        });
        this.role = participant?.role ?? "Guest";
      }
      this.role ??= "Guest";
    }

    return { role: this.role };
  }

  async hasPermission(...permissions: ContestPermission[]) {
    const { role } = await this.initialize();

    const fallback = await this.team.hasPermission(
      ...permissions.map(({ fallback }) => fallback)
    );

    if (!this.contestId) return fallback;

    return permissions.map((permission, index) => {
      if (fallback[index]) return true;

      switch (role) {
        case "Mod":
          return permission.mod;
        case "Jury":
          return permission.jury;
        case "Contestant":
          return permission.contestant;
        case "Guest":
          return permission.guest;
      }
    });
  }

  async checkPermission(...permissions: ContestPermission[]) {
    const perms = await this.hasPermission(...permissions);
    if (perms.some((perm) => !perm)) {
      throw new Response("Permission denied", { status: 403 });
    }
  }
}
