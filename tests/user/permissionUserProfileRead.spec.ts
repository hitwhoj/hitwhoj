import { adminUid, adminUid2, bannedUid, bannedUid2, createRequest, rootUid, rootUid2, userUid, userUid2 } from "../tools";
import { permissionUserProfileRead as permission } from "~/utils/permission/user";
import test from "node:test";
import assert from "node:assert";
import { checkPermission } from "~/utils/permission";

test("permissionUserProfileRead", async () => {
  const root = await createRequest(1);
  const admin = await createRequest(2);
  const user = await createRequest(3);
  const banned = await createRequest(4);
  const guest = new Request("http://localhost:8080/");

  assert(await checkPermission(permission, root, rootUid), "Root 可以访问自己");
  assert(await checkPermission(permission, root, rootUid2), "Root 可以访问其他 Root");
  assert(await checkPermission(permission, root, adminUid), "Root 可以访问 Admin");
  assert(await checkPermission(permission, root, userUid), "Root 可以访问 User");
  assert(await checkPermission(permission, root, bannedUid), "Root 可以访问 Banned");

  assert(await checkPermission(permission, admin, rootUid), "Admin 可以访问 Root");
  assert(await checkPermission(permission, admin, adminUid), "Admin 可以访问自己");
  assert(await checkPermission(permission, admin, adminUid2), "Admin 可以访问其他 Admin");
  assert(await checkPermission(permission, admin, userUid), "Admin 可以访问 User");
  assert(await checkPermission(permission, admin, bannedUid), "Admin 可以访问 Banned");

  assert(await checkPermission(permission, user, rootUid), "User 可以访问 Root");
  assert(await checkPermission(permission, user, adminUid), "User 可以访问 Admin");
  assert(await checkPermission(permission, user, userUid), "User 可以访问自己");
  assert(await checkPermission(permission, user, userUid2), "User 可以访问其他 User");
  assert(await checkPermission(permission, user, bannedUid), "User 可以访问 Banned");

  assert(await checkPermission(permission, banned, rootUid), "Banned 可以访问 Root");
  assert(await checkPermission(permission, banned, adminUid), "Banned 可以访问 Admin");
  assert(await checkPermission(permission, banned, userUid), "Banned 可以访问 User");
  assert(await checkPermission(permission, banned, bannedUid), "Banned 可以访问自己");
  assert(await checkPermission(permission, banned, bannedUid2), "Banned 可以访问其他 Banned");

  assert(await checkPermission(permission, guest, rootUid), "Guest 可以访问 Root");
  assert(await checkPermission(permission, guest, adminUid), "Guest 可以访问 Admin");
  assert(await checkPermission(permission, guest, userUid), "Guest 可以访问 User");
  assert(await checkPermission(permission, guest, bannedUid), "Guest 可以访问 Banned");
});
