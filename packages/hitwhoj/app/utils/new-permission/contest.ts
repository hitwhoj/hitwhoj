import type { ContestParticipantRole } from "@prisma/client";
import { db } from "~/utils/server/db.server";
import type { NewTeamUser } from "~/utils/new-permission/team";

export class NewContestUser {
  readonly team: NewTeamUser;
  readonly contestId: number | null;
  private role: ContestParticipantRole | "Guest" | null = null;
  private privilege: number | null = null;
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

    return { role: this.role, privilege: this.privilege ?? null };
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
