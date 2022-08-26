import type { ChatRoomRole } from "@prisma/client";
import { db } from "~/utils/server/db.server";
import type { ChatRoomPermission } from "../permission/room";
import type { User } from "./user";

/**
 * 如果资源与团队有关，则调用团队的权限检查
 */
export class ChatRoomUser {
  readonly user: User;
  readonly roomId: number | null;
  private role: ChatRoomRole | "Guest" | null = null;

  constructor(user: User, roomId: number | null) {
    this.user = user;
    this.roomId = roomId;
  }

  private async initialize() {
    if (this.role === null) {
      if (this.user.userId && this.roomId) {
        const member = await db.chatRoomUser.findUnique({
          where: {
            roomId_userId: {
              roomId: this.roomId,
              userId: this.user.userId,
            },
          },
          select: { role: true },
        });
        this.role = member?.role ?? "Guest";
      }
      // fallback non-room user to guest
      this.role ??= "Guest";
    }

    return { role: this.role };
  }

  async hasPermission(...permissions: ChatRoomPermission[]) {
    const { role } = await this.initialize();

    const fallback = await this.user.hasPermission(
      ...permissions.map(({ fallback }) => fallback)
    );

    if (!this.roomId) return fallback;

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

  async checkPermission(...permissions: ChatRoomPermission[]) {
    const perms = await this.hasPermission(...permissions);
    if (perms.some((perm) => !perm)) {
      throw new Response("Permission denied", { status: 403 });
    }
  }
}
