import { adminUid, adminUid2, bannedUid, bannedUid2, createRequest, rootUid, rootUid2, userUid, userUid2 } from "../tools";
import { permissionUserProfileWrite as permission } from "~/utils/permission/user";
import test from "node:test";
import assert from "node:assert";
import { checkPermission } from "~/utils/permission";

// 测试修改权限
test("permissionUserProfileWrite", async () => {
  const root = await createRequest(1);
  const admin = await createRequest(2);
  const user = await createRequest(3);
  const banned = await createRequest(4);
  const guest = new Request("http://localhost:8080/");

  assert(await checkPermission(permission, root, rootUid), "Root 可以修改自己的用户资料");
  assert(await checkPermission(permission, root, rootUid2), "Root 可以修改其他 Root 的用户资料");
  assert(await checkPermission(permission, root, adminUid), "Root 可以修改 Admin 的用户资料");
  assert(await checkPermission(permission, root, userUid), "Root 可以修改 User 的用户资料");
  assert(await checkPermission(permission, root, bannedUid), "Root 可以修改 Banned 的用户资料");

  assert(await checkPermission(permission, admin, rootUid), "Admin 可以修改 Root 的用户资料");
  assert(await checkPermission(permission, admin, adminUid), "Admin 可以修改自己的用户资料");
  assert(await checkPermission(permission, admin, adminUid2), "Admin 可以修改其他 Admin 的用户资料");
  assert(await checkPermission(permission, admin, userUid), "Admin 可以修改 User 的用户资料");
  assert(await checkPermission(permission, admin, bannedUid), "Admin 可以修改 Banned 的用户资料");

  assert(!(await checkPermission(permission, user, rootUid)), "User 不可以修改 Root 的用户资料");
  assert(!(await checkPermission(permission, user, adminUid)), "User 不可以修改 Admin 的用户资料");
  assert(await checkPermission(permission, user, userUid), "User 可以修改自己的用户资料");
  assert(!(await checkPermission(permission, user, userUid2)), "User 不可以修改其他 User 的用户资料");
  assert(!(await checkPermission(permission, user, bannedUid)), "User 不可以修改 Banned 的用户资料");

  assert(!(await checkPermission(permission, banned, rootUid)), "Banned 不可以修改 Root 的用户资料");
  assert(!(await checkPermission(permission, banned, adminUid)), "Banned 不可以修改 Admin 的用户资料");
  assert(!(await checkPermission(permission, banned, userUid)), "Banned 不可以修改 User 的用户资料");
  assert(!(await checkPermission(permission, banned, bannedUid)), "Banned 不可以修改自己的用户资料");
  assert(!(await checkPermission(permission, banned, bannedUid2)), "Banned 不可以修改其他 Banned 的用户资料");

  assert(!(await checkPermission(permission, guest, rootUid)), "Guest 不可以修改 Root 的用户资料");
  assert(!(await checkPermission(permission, guest, adminUid)), "Guest 不可以修改 Admin 的用户资料");
  assert(!(await checkPermission(permission, guest, userUid)), "Guest 不可以修改 User 的用户资料");
  assert(!(await checkPermission(permission, guest, bannedUid)), "Guest 不可以修改 Banned 的用户资料");
});
