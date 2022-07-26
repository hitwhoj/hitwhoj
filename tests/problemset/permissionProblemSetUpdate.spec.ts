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

test("permissionProblemSetUpdate", async () => {
  const root = await createRequest(1);
  const admin = await createRequest(2);
  const user = await createRequest(3);
  const banned = await createRequest(4);
  const guest = new Request("http://localhost:8080/");

  assert(await permission.check(root, problemSetPub), "Root 可以修改不属于任何团队的公开题单");
  assert(await permission.check(root, problemSetPrv), "Root 可以修改不属于任何团队的私有题单");
  assert(await permission.check(root, problemSetTeamAPub), "Root 可以修改担任 Owner 的团队的公开题单");
  assert(await permission.check(root, problemSetTeamAPrv), "Root 可以修改担任 Owner 的团队的私有题单");
  assert(await permission.check(root, problemSetTeamBPub), "Root 可以修改担任 Admin 的团队的公开题单");
  assert(await permission.check(root, problemSetTeamBPrv), "Root 可以修改担任 Admin 的团队的私有题单");
  assert(await permission.check(root, problemSetTeamCPub), "Root 可以修改担任 Member 的团队的公开题单");
  assert(await permission.check(root, problemSetTeamCPrv), "Root 可以修改担任 Member 的团队的私有题单");
  assert(await permission.check(root, problemSetTeamDPub), "Root 可以修改其他团队的公开题单");
  assert(await permission.check(root, problemSetTeamDPrv), "Root 可以修改其他团队的私有题单");

  assert(await permission.check(admin, problemSetPub), "Admin 可以修改不属于任何团队的公开题单");
  assert(await permission.check(admin, problemSetPrv), "Admin 可以修改不属于任何团队的私有题单");
  assert(await permission.check(admin, problemSetTeamAPub), "Admin 可以修改担任 Owner 的团队的公开题单");
  assert(await permission.check(admin, problemSetTeamAPrv), "Admin 可以修改担任 Owner 的团队的私有题单");
  assert(await permission.check(admin, problemSetTeamBPub), "Admin 可以修改担任 Admin 的团队的公开题单");
  assert(await permission.check(admin, problemSetTeamBPrv), "Admin 可以修改担任 Admin 的团队的私有题单");
  assert(await permission.check(admin, problemSetTeamCPub), "Admin 可以修改担任 Member 的团队的公开题单");
  assert(await permission.check(admin, problemSetTeamCPrv), "Admin 可以修改担任 Member 的团队的私有题单");
  assert(await permission.check(admin, problemSetTeamDPub), "Admin 可以修改其他团队的公开题单");
  assert(await permission.check(admin, problemSetTeamDPrv), "Admin 可以修改其他团队的私有题单");

  assert(!(await permission.check(user, problemSetPub)), "User 不可以修改不属于任何团队的公开题单");
  assert(!(await permission.check(user, problemSetPrv)), "User 不可以修改不属于任何团队的私有题单");
  assert(await permission.check(user, problemSetTeamAPub), "User 可以修改担任 Owner 的团队的公开题单");
  assert(await permission.check(user, problemSetTeamAPrv), "User 可以修改担任 Owner 的团队的私有题单");
  assert(await permission.check(user, problemSetTeamBPub), "User 可以修改担任 Admin 的团队的公开题单");
  assert(await permission.check(user, problemSetTeamBPrv), "User 可以修改担任 Admin 的团队的私有题单");
  assert(!(await permission.check(user, problemSetTeamCPub)), "User 不可以修改担任 Member 的团队的公开题单");
  assert(!(await permission.check(user, problemSetTeamCPrv)), "User 不可以修改担任 Member 的团队的私有题单");
  assert(!(await permission.check(user, problemSetTeamDPub)), "User 不可以修改其他团队的公开题单");
  assert(!(await permission.check(user, problemSetTeamDPrv)), "User 不可以修改其他团队的私有题单");

  assert(!(await permission.check(banned, problemSetPub)), "Banned 不可以修改不属于任何团队的公开题单");
  assert(!(await permission.check(banned, problemSetPrv)), "Banned 不可以修改不属于任何团队的私有题单");
  assert(!(await permission.check(banned, problemSetTeamAPub)), "Banned 不可以修改担任 Owner 的团队的公开题单");
  assert(!(await permission.check(banned, problemSetTeamAPrv)), "Banned 不可以修改担任 Owner 的团队的私有题单");
  assert(!(await permission.check(banned, problemSetTeamBPub)), "Banned 不可以修改担任 Admin 的团队的公开题单");
  assert(!(await permission.check(banned, problemSetTeamBPrv)), "Banned 不可以修改担任 Admin 的团队的私有题单");
  assert(!(await permission.check(banned, problemSetTeamCPub)), "Banned 不可以修改担任 Member 的团队的公开题单");
  assert(!(await permission.check(banned, problemSetTeamCPrv)), "Banned 不可以修改担任 Member 的团队的私有题单");
  assert(!(await permission.check(banned, problemSetTeamDPub)), "Banned 不可以修改其他团队的公开题单");
  assert(!(await permission.check(banned, problemSetTeamDPrv)), "Banned 不可以修改其他团队的私有题单");

  assert(!(await permission.check(guest, problemSetPub)), "Guest 不可以修改不属于任何团队的公开题单");
  assert(!(await permission.check(guest, problemSetPrv)), "Guest 不可以修改不属于任何团队的私有题单");
  assert(!(await permission.check(guest, problemSetTeamDPub)), "Guest 不可以修改其他团队的公开题单");
  assert(!(await permission.check(guest, problemSetTeamDPrv)), "Guest 不可以修改其他团队的私有题单");
});
