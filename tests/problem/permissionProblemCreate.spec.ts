import { createRequest } from "tests/tools";
import { permissionProblemCreate as permission } from "~/utils/permission/problem";
import test from "node:test";
import assert from "node:assert";
import { checkPermission } from "~/utils/permission";

test("permissionProblemCreate", async () => {
  const root = await createRequest(1);
  const admin = await createRequest(2);
  const user = await createRequest(3);
  const banned = await createRequest(4);
  const guest = new Request("http://localhost:8080/");

  assert(await checkPermission(permission, root), "Root 可以创建题目");
  assert(await checkPermission(permission, admin), "Admin 可以创建题目");
  assert(!(await checkPermission(permission, user)), "User 不可以创建题目");
  assert(!(await checkPermission(permission, banned)), "Banned 不可以创建题目");
  assert(!(await checkPermission(permission, guest)), "Guest 不可以创建题目");
});
