import type { ContestParticipantRole } from "@prisma/client";
import { db } from "~/utils/server/db.server";
import type { ContestPermission } from "../permission/contest";
import type { NewTeamUser} from "~/utils/new-permission/team";

export class NewContestUser {
  readonly team: NewTeamUser;
  readonly contestId: number | null;
  private role: ContestParticipantRole | "Guest" | null = null;

  constructor(team: NewTeamUser, contestId: number | null) {
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
        default:
          return false;
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
