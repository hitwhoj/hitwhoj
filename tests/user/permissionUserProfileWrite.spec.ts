import { adminUid, adminUid2, bannedUid, bannedUid2, createRequest, rootUid, rootUid2, userUid, userUid2 } from "../tools";
import { permissionUserProfileWrite as permission } from "~/utils/permission/user";
import test from "node:test";
import assert from "node:assert";

// 测试修改权限
test("permissionUserProfileWrite", async () => {
  const root = await createRequest(1);
  const admin = await createRequest(2);
  const user = await createRequest(3);
  const banned = await createRequest(4);
  const guest = new Request("http://localhost:8080/");

  assert(await permission.check(root, rootUid), "Root 可以修改自己的用户资料");
  assert(await permission.check(root, rootUid2), "Root 可以修改其他 Root 的用户资料");
  assert(await permission.check(root, adminUid), "Root 可以修改 Admin 的用户资料");
  assert(await permission.check(root, userUid), "Root 可以修改 User 的用户资料");
  assert(await permission.check(root, bannedUid), "Root 可以修改 Banned 的用户资料");

  assert(await permission.check(admin, rootUid), "Admin 可以修改 Root 的用户资料");
  assert(await permission.check(admin, adminUid), "Admin 可以修改自己的用户资料");
  assert(await permission.check(admin, adminUid2), "Admin 可以修改其他 Admin 的用户资料");
  assert(await permission.check(admin, userUid), "Admin 可以修改 User 的用户资料");
  assert(await permission.check(admin, bannedUid), "Admin 可以修改 Banned 的用户资料");

  assert(!(await permission.check(user, rootUid)), "User 不可以修改 Root 的用户资料");
  assert(!(await permission.check(user, adminUid)), "User 不可以修改 Admin 的用户资料");
  assert(await permission.check(user, userUid), "User 可以修改自己的用户资料");
  assert(!(await permission.check(user, userUid2)), "User 不可以修改其他 User 的用户资料");
  assert(!(await permission.check(user, bannedUid)), "User 不可以修改 Banned 的用户资料");

  assert(!(await permission.check(banned, rootUid)), "Banned 不可以修改 Root 的用户资料");
  assert(!(await permission.check(banned, adminUid)), "Banned 不可以修改 Admin 的用户资料");
  assert(!(await permission.check(banned, userUid)), "Banned 不可以修改 User 的用户资料");
  assert(!(await permission.check(banned, bannedUid)), "Banned 不可以修改自己的用户资料");
  assert(!(await permission.check(banned, bannedUid2)), "Banned 不可以修改其他 Banned 的用户资料");

  assert(!(await permission.check(guest, rootUid)), "Guest 不可以修改 Root 的用户资料");
  assert(!(await permission.check(guest, adminUid)), "Guest 不可以修改 Admin 的用户资料");
  assert(!(await permission.check(guest, userUid)), "Guest 不可以修改 User 的用户资料");
  assert(!(await permission.check(guest, bannedUid)), "Guest 不可以修改 Banned 的用户资料");
});
