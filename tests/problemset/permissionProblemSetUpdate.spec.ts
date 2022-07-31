import {
  createRequest,
  problemSetPrv,
  problemSetPub,
  problemSetTeamAPrv,
  problemSetTeamAPub,
  problemSetTeamBPrv,
  problemSetTeamBPub,
  problemSetTeamCPrv,
  problemSetTeamCPub,
  problemSetTeamDPrv,
  problemSetTeamDPub,
} from "../tools";
import { permissionProblemSetUpdate as permission } from "~/utils/permission/problemset";
import test from "node:test";
import assert from "node:assert";
import { checkPermission } from "~/utils/permission";

test("permissionProblemSetUpdate", async () => {
  const root = await createRequest(1);
  const admin = await createRequest(2);
  const user = await createRequest(3);
  const banned = await createRequest(4);
  const guest = new Request("http://localhost:8080/");

  assert(await checkPermission(permission, root, problemSetPub), "Root 可以修改不属于任何团队的公开题单");
  assert(await checkPermission(permission, root, problemSetPrv), "Root 可以修改不属于任何团队的私有题单");
  assert(await checkPermission(permission, root, problemSetTeamAPub), "Root 可以修改担任 Owner 的团队的公开题单");
  assert(await checkPermission(permission, root, problemSetTeamAPrv), "Root 可以修改担任 Owner 的团队的私有题单");
  assert(await checkPermission(permission, root, problemSetTeamBPub), "Root 可以修改担任 Admin 的团队的公开题单");
  assert(await checkPermission(permission, root, problemSetTeamBPrv), "Root 可以修改担任 Admin 的团队的私有题单");
  assert(await checkPermission(permission, root, problemSetTeamCPub), "Root 可以修改担任 Member 的团队的公开题单");
  assert(await checkPermission(permission, root, problemSetTeamCPrv), "Root 可以修改担任 Member 的团队的私有题单");
  assert(await checkPermission(permission, root, problemSetTeamDPub), "Root 可以修改其他团队的公开题单");
  assert(await checkPermission(permission, root, problemSetTeamDPrv), "Root 可以修改其他团队的私有题单");

  assert(await checkPermission(permission, admin, problemSetPub), "Admin 可以修改不属于任何团队的公开题单");
  assert(await checkPermission(permission, admin, problemSetPrv), "Admin 可以修改不属于任何团队的私有题单");
  assert(await checkPermission(permission, admin, problemSetTeamAPub), "Admin 可以修改担任 Owner 的团队的公开题单");
  assert(await checkPermission(permission, admin, problemSetTeamAPrv), "Admin 可以修改担任 Owner 的团队的私有题单");
  assert(await checkPermission(permission, admin, problemSetTeamBPub), "Admin 可以修改担任 Admin 的团队的公开题单");
  assert(await checkPermission(permission, admin, problemSetTeamBPrv), "Admin 可以修改担任 Admin 的团队的私有题单");
  assert(await checkPermission(permission, admin, problemSetTeamCPub), "Admin 可以修改担任 Member 的团队的公开题单");
  assert(await checkPermission(permission, admin, problemSetTeamCPrv), "Admin 可以修改担任 Member 的团队的私有题单");
  assert(await checkPermission(permission, admin, problemSetTeamDPub), "Admin 可以修改其他团队的公开题单");
  assert(await checkPermission(permission, admin, problemSetTeamDPrv), "Admin 可以修改其他团队的私有题单");

  assert(!(await checkPermission(permission, user, problemSetPub)), "User 不可以修改不属于任何团队的公开题单");
  assert(!(await checkPermission(permission, user, problemSetPrv)), "User 不可以修改不属于任何团队的私有题单");
  assert(await checkPermission(permission, user, problemSetTeamAPub), "User 可以修改担任 Owner 的团队的公开题单");
  assert(await checkPermission(permission, user, problemSetTeamAPrv), "User 可以修改担任 Owner 的团队的私有题单");
  assert(await checkPermission(permission, user, problemSetTeamBPub), "User 可以修改担任 Admin 的团队的公开题单");
  assert(await checkPermission(permission, user, problemSetTeamBPrv), "User 可以修改担任 Admin 的团队的私有题单");
  assert(!(await checkPermission(permission, user, problemSetTeamCPub)), "User 不可以修改担任 Member 的团队的公开题单");
  assert(!(await checkPermission(permission, user, problemSetTeamCPrv)), "User 不可以修改担任 Member 的团队的私有题单");
  assert(!(await checkPermission(permission, user, problemSetTeamDPub)), "User 不可以修改其他团队的公开题单");
  assert(!(await checkPermission(permission, user, problemSetTeamDPrv)), "User 不可以修改其他团队的私有题单");

  assert(!(await checkPermission(permission, banned, problemSetPub)), "Banned 不可以修改不属于任何团队的公开题单");
  assert(!(await checkPermission(permission, banned, problemSetPrv)), "Banned 不可以修改不属于任何团队的私有题单");
  assert(!(await checkPermission(permission, banned, problemSetTeamAPub)), "Banned 不可以修改担任 Owner 的团队的公开题单");
  assert(!(await checkPermission(permission, banned, problemSetTeamAPrv)), "Banned 不可以修改担任 Owner 的团队的私有题单");
  assert(!(await checkPermission(permission, banned, problemSetTeamBPub)), "Banned 不可以修改担任 Admin 的团队的公开题单");
  assert(!(await checkPermission(permission, banned, problemSetTeamBPrv)), "Banned 不可以修改担任 Admin 的团队的私有题单");
  assert(!(await checkPermission(permission, banned, problemSetTeamCPub)), "Banned 不可以修改担任 Member 的团队的公开题单");
  assert(!(await checkPermission(permission, banned, problemSetTeamCPrv)), "Banned 不可以修改担任 Member 的团队的私有题单");
  assert(!(await checkPermission(permission, banned, problemSetTeamDPub)), "Banned 不可以修改其他团队的公开题单");
  assert(!(await checkPermission(permission, banned, problemSetTeamDPrv)), "Banned 不可以修改其他团队的私有题单");

  assert(!(await checkPermission(permission, guest, problemSetPub)), "Guest 不可以修改不属于任何团队的公开题单");
  assert(!(await checkPermission(permission, guest, problemSetPrv)), "Guest 不可以修改不属于任何团队的私有题单");
  assert(!(await checkPermission(permission, guest, problemSetTeamDPub)), "Guest 不可以修改其他团队的公开题单");
  assert(!(await checkPermission(permission, guest, problemSetTeamDPrv)), "Guest 不可以修改其他团队的私有题单");
});
