import { Request } from "@remix-run/node";
import { assert } from "chai";
import { permissionUserProfileRead as permission } from "~/utils/permission/user";
import {
  adminUid,
  adminUid2,
  bannedUid,
  bannedUid2,
  createRequest,
  rootUid,
  rootUid2,
  userUid,
  userUid2,
} from "../tools";

// 测试访问权限
describe("permissionUserProfileRead", () => {
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
  it("Root 可以访问自己", async () =>
    assert(await permission.check(root, rootUid)));
  it("Root 可以访问其他 Root", async () =>
    assert(await permission.check(root, rootUid2)));
  it("Root 可以访问 Admin", async () =>
    assert(await permission.check(root, adminUid)));
  it("Root 可以访问 User", async () =>
    assert(await permission.check(root, userUid)));
  it("Root 可以访问 Banned", async () =>
    assert(await permission.check(root, bannedUid)));

  // Admin
  it("Admin 可以访问 Root", async () =>
    assert(await permission.check(admin, rootUid)));
  it("Admin 可以访问自己", async () =>
    assert(await permission.check(admin, adminUid)));
  it("Admin 可以访问其他 Admin", async () =>
    assert(await permission.check(admin, adminUid2)));
  it("Admin 可以访问 User", async () =>
    assert(await permission.check(admin, userUid)));
  it("Admin 可以访问 Banned", async () =>
    assert(await permission.check(admin, bannedUid)));

  // User
  it("User 可以访问 Root", async () =>
    assert(await permission.check(user, rootUid)));
  it("User 可以访问 Admin", async () =>
    assert(await permission.check(user, adminUid)));
  it("User 可以访问自己", async () =>
    assert(await permission.check(user, userUid)));
  it("User 可以访问其他 User", async () =>
    assert(await permission.check(user, userUid2)));
  it("User 可以访问 Banned", async () =>
    assert(await permission.check(user, bannedUid)));

  // Banned
  it("Banned 可以访问 Root", async () =>
    assert(await permission.check(banned, rootUid)));
  it("Banned 可以访问 Admin", async () =>
    assert(await permission.check(banned, adminUid)));
  it("Banned 可以访问 User", async () =>
    assert(await permission.check(banned, userUid)));
  it("Banned 可以访问自己", async () =>
    assert(await permission.check(banned, bannedUid)));
  it("Banned 可以访问其他 Banned", async () =>
    assert(await permission.check(banned, bannedUid2)));

  // Guest
  it("Guest 可以访问 Root", async () =>
    assert(await permission.check(guest, rootUid)));
  it("Guest 可以访问 Admin", async () =>
    assert(await permission.check(guest, adminUid)));
  it("Guest 可以访问 User", async () =>
    assert(await permission.check(guest, userUid)));
  it("Guest 可以访问 Banned", async () =>
    assert(await permission.check(guest, bannedUid)));
});
