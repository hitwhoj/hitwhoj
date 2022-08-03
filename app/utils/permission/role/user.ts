import type { SystemUserRole } from "@prisma/client";
import { db } from "~/utils/server/db.server";
import type { Privilege } from "../privilege";
import { TeamUser } from "./team";

/**
 * 系统用户的权限
 *
 * [Root, Admin, User, Guest]
 */
export class UserPermission {
  constructor(
    readonly root: boolean,
    readonly admin: boolean,
    readonly user: boolean,
    readonly guest: boolean
  ) {}

  static Everyone = new UserPermission(true, true, true, true);
  static Users = new UserPermission(true, true, true, false);
  static Admins = new UserPermission(true, true, false, false);
  static Roots = new UserPermission(true, false, false, false);
  static Nobody = new UserPermission(false, false, false, false);
}

/**
 * 用于当前登录用户的权限检查
 */
export class User {
  readonly userId: number | null;
  private role: SystemUserRole | "Guest" | null = null;
  private privilege: number | null = null;

  constructor(userId: number | null) {
    this.userId = userId;
  }

  private async initialize() {
    if (this.role === null || this.privilege === null) {
      if (this.userId) {
        const user = await db.user.findUnique({
          where: { id: this.userId },
          select: { role: true, privilege: true },
        });
        this.role = user?.role ?? "Guest";
        this.privilege = user?.privilege ?? 0;
      }
      // fallback non-login user
      this.role ??= "Guest";
      this.privilege ??= 0;
    }

    return { role: this.role, privilege: this.privilege };
  }

  async hasPermission(...permissions: UserPermission[]) {
    const { role } = await this.initialize();

    return permissions.map((perm) => {
      switch (role) {
        case "Root":
          return perm.root;
        case "Admin":
          return perm.admin;
        case "User":
          return perm.user;
        case "Guest":
          return perm.guest;
      }
    });
  }

  async checkPermission(...permissions: UserPermission[]) {
    const perms = await this.hasPermission(...permissions);
    if (perms.some((value) => !value)) {
      throw new Response("您的权限不足", { status: 403 });
    }
  }

  async hasPrivilege(...privileges: Privilege[]) {
    const { privilege } = await this.initialize();
    return privileges.map((priv) => (priv & privilege) === priv);
  }

  async checkPrivilege(...privileges: Privilege[]) {
    const privs = await this.hasPrivilege(...privileges);
    if (privs.some((value) => !value)) {
      throw new Response("您的权力不足", { status: 403 });
    }
  }

  team(teamId: number | null) {
    return new TeamUser(this, teamId);
  }
}
