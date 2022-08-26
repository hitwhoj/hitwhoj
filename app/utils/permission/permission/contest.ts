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
