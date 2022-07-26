import { Request } from "@remix-run/node";
import { assert } from "chai";
import { permissionUserProfileWrite as permission } from "~/utils/permission/user";
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

// 测试修改权限
describe("permissionUserProfileWrite", () => {
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
  it("Root 可以修改自己的用户资料", async () =>
    assert(await permission.check(root, rootUid)));
  it("Root 可以修改其他 Root 的用户资料", async () =>
    assert(await permission.check(root, rootUid2)));
  it("Root 可以修改 Admin 的用户资料", async () =>
    assert(await permission.check(root, adminUid)));
  it("Root 可以修改 User 的用户资料", async () =>
    assert(await permission.check(root, userUid)));
  it("Root 可以修改 Banned 的用户资料", async () =>
    assert(await permission.check(root, bannedUid)));

  // Admin
  it("Admin 可以修改 Root 的用户资料", async () =>
    assert(await permission.check(admin, rootUid)));
  it("Admin 可以修改自己的用户资料", async () =>
    assert(await permission.check(admin, adminUid)));
  it("Admin 可以修改其他 Admin 的用户资料", async () =>
    assert(await permission.check(admin, adminUid2)));
  it("Admin 可以修改 User 的用户资料", async () =>
    assert(await permission.check(admin, userUid)));
  it("Admin 可以修改 Banned 的用户资料", async () =>
    assert(await permission.check(admin, bannedUid)));

  // User
  it("User 不可以修改 Root 的用户资料", async () =>
    assert(!(await permission.check(user, rootUid))));
  it("User 不可以修改 Admin 的用户资料", async () =>
    assert(!(await permission.check(user, adminUid))));
  it("User 可以修改自己的用户资料", async () =>
    assert(await permission.check(user, userUid)));
  it("User 不可以修改其他 User 的用户资料", async () =>
    assert(!(await permission.check(user, userUid2))));
  it("User 不可以修改 Banned 的用户资料", async () =>
    assert(!(await permission.check(user, bannedUid))));

  // Banned
  it("Banned 不可以修改 Root 的用户资料", async () =>
    assert(!(await permission.check(banned, rootUid))));
  it("Banned 不可以修改 Admin 的用户资料", async () =>
    assert(!(await permission.check(banned, adminUid))));
  it("Banned 不可以修改 User 的用户资料", async () =>
    assert(!(await permission.check(banned, userUid))));
  it("Banned 不可以修改自己的用户资料", async () =>
    assert(!(await permission.check(banned, bannedUid))));
  it("Banned 不可以修改其他 Banned 的用户资料", async () =>
    assert(!(await permission.check(banned, bannedUid2))));

  // Guest
  it("Guest 不可以修改 Root 的用户资料", async () =>
    assert(!(await permission.check(guest, rootUid))));
  it("Guest 不可以修改 Admin 的用户资料", async () =>
    assert(!(await permission.check(guest, adminUid))));
  it("Guest 不可以修改 User 的用户资料", async () =>
    assert(!(await permission.check(guest, userUid))));
  it("Guest 不可以修改 Banned 的用户资料", async () =>
    assert(!(await permission.check(guest, bannedUid))));
});
