import { adminUid, adminUid2, bannedUid, bannedUid2, createRequest, rootUid, rootUid2, userUid, userUid2 } from "../tools";
import { permissionUserProfileRead as permission } from "~/utils/permission/user";
import test from "node:test";
import assert from "node:assert";

test("permissionUserProfileRead", async () => {
  const root = await createRequest(1);
  const admin = await createRequest(2);
  const user = await createRequest(3);
  const banned = await createRequest(4);
  const guest = new Request("http://localhost:8080/");

  assert(await permission.check(root, rootUid), "Root 可以访问自己");
  assert(await permission.check(root, rootUid2), "Root 可以访问其他 Root");
  assert(await permission.check(root, adminUid), "Root 可以访问 Admin");
  assert(await permission.check(root, userUid), "Root 可以访问 User");
  assert(await permission.check(root, bannedUid), "Root 可以访问 Banned");

  assert(await permission.check(admin, rootUid), "Admin 可以访问 Root");
  assert(await permission.check(admin, adminUid), "Admin 可以访问自己");
  assert(await permission.check(admin, adminUid2), "Admin 可以访问其他 Admin");
  assert(await permission.check(admin, userUid), "Admin 可以访问 User");
  assert(await permission.check(admin, bannedUid), "Admin 可以访问 Banned");

  assert(await permission.check(user, rootUid), "User 可以访问 Root");
  assert(await permission.check(user, adminUid), "User 可以访问 Admin");
  assert(await permission.check(user, userUid), "User 可以访问自己");
  assert(await permission.check(user, userUid2), "User 可以访问其他 User");
  assert(await permission.check(user, bannedUid), "User 可以访问 Banned");

  assert(await permission.check(banned, rootUid), "Banned 可以访问 Root");
  assert(await permission.check(banned, adminUid), "Banned 可以访问 Admin");
  assert(await permission.check(banned, userUid), "Banned 可以访问 User");
  assert(await permission.check(banned, bannedUid), "Banned 可以访问自己");
  assert(await permission.check(banned, bannedUid2), "Banned 可以访问其他 Banned");

  assert(await permission.check(guest, rootUid), "Guest 可以访问 Root");
  assert(await permission.check(guest, adminUid), "Guest 可以访问 Admin");
  assert(await permission.check(guest, userUid), "Guest 可以访问 User");
  assert(await permission.check(guest, bannedUid), "Guest 可以访问 Banned");
});
