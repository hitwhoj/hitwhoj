import { Request } from "@remix-run/node";
import { checkUserReadPermission } from "~/utils/permission/user";
import {
  adminUid,
  adminUid2,
  bannedUid,
  bannedUid2,
  createRequest,
  resolves,
  rootUid,
  rootUid2,
  userUid,
  userUid2,
} from "../tools";

// 测试访问权限
describe("checkUserReadPermission", () => {
  let root: Request;
  let admin: Request;
  let user: Request;
  let banned: Request;
  let guest: Request;

  before(async () => {
    root = await createRequest(1);
    admin = await createRequest(2);
    user = await createRequest(3);
    banned = await createRequest(4);
    guest = new Request("http://localhost:8080/");
  });

  // Root
  it("Root 可以访问自己", () =>
    resolves(checkUserReadPermission(root, rootUid)));
  it("Root 可以访问其他 Root", () =>
    resolves(checkUserReadPermission(root, rootUid2)));
  it("Root 可以访问 Admin", () =>
    resolves(checkUserReadPermission(root, adminUid)));
  it("Root 可以访问 User", () =>
    resolves(checkUserReadPermission(root, userUid)));
  it("Root 可以访问 Banned", () =>
    resolves(checkUserReadPermission(root, bannedUid)));

  // Admin
  it("Admin 可以访问 Root", () =>
    resolves(checkUserReadPermission(admin, rootUid)));
  it("Admin 可以访问自己", () =>
    resolves(checkUserReadPermission(admin, adminUid)));
  it("Admin 可以访问其他 Admin", () =>
    resolves(checkUserReadPermission(admin, adminUid2)));
  it("Admin 可以访问 User", () =>
    resolves(checkUserReadPermission(admin, userUid)));
  it("Admin 可以访问 Banned", () =>
    resolves(checkUserReadPermission(admin, bannedUid)));

  // User
  it("User 可以访问 Root", () =>
    resolves(checkUserReadPermission(user, rootUid)));
  it("User 可以访问 Admin", () =>
    resolves(checkUserReadPermission(user, adminUid)));
  it("User 可以访问自己", () =>
    resolves(checkUserReadPermission(user, userUid)));
  it("User 可以访问其他 User", () =>
    resolves(checkUserReadPermission(user, userUid2)));
  it("User 可以访问 Banned", () =>
    resolves(checkUserReadPermission(user, bannedUid)));

  // Banned
  it("Banned 可以访问 Root", () =>
    resolves(checkUserReadPermission(banned, rootUid)));
  it("Banned 可以访问 Admin", () =>
    resolves(checkUserReadPermission(banned, adminUid)));
  it("Banned 可以访问 User", () =>
    resolves(checkUserReadPermission(banned, userUid)));
  it("Banned 可以访问自己", () =>
    resolves(checkUserReadPermission(banned, bannedUid)));
  it("Banned 可以访问其他 Banned", () =>
    resolves(checkUserReadPermission(banned, bannedUid2)));

  // Guest
  it("Guest 可以访问 Root", () =>
    resolves(checkUserReadPermission(guest, rootUid)));
  it("Guest 可以访问 Admin", () =>
    resolves(checkUserReadPermission(guest, adminUid)));
  it("Guest 可以访问 User", () =>
    resolves(checkUserReadPermission(guest, userUid)));
  it("Guest 可以访问 Banned", () =>
    resolves(checkUserReadPermission(guest, bannedUid)));
});
