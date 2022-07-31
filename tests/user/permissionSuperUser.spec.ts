import { createRequest } from "tests/tools";
import { Request } from "@remix-run/node";
import { permissionSuperUser as permission } from "~/utils/permission/user";
import test from "node:test";
import assert from "node:assert";
import { checkPermission } from "~/utils/permission";

test("permissionSuperUser", async () => {
  const root = await createRequest(1);
  const admin = await createRequest(2);
  const user = await createRequest(3);
  const banned = await createRequest(4);
  const guest = new Request("http://localhost:8080/");

  assert(await checkPermission(permission, root), "Root 是超级管理员");
  assert(!(await checkPermission(permission, admin)), "Admin 不是超级管理员");
  assert(!(await checkPermission(permission, user)), "User 不是超级管理员");
  assert(!(await checkPermission(permission, banned)), "Banned 不是超级管理员");
  assert(!(await checkPermission(permission, guest)), "Guest 不是超级管理员");
});
