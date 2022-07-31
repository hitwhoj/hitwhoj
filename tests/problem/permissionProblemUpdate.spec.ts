import {
  createRequest,
  problemPrv,
  problemPub,
  problemTeamAPrv,
  problemTeamAPub,
  problemTeamBPrv,
  problemTeamBPub,
  problemTeamCPrv,
  problemTeamCPub,
  problemTeamDPrv,
  problemTeamDPub,
} from "../tools";
import { permissionProblemUpdate as permission } from "~/utils/permission/problem";
import test from "node:test";
import assert from "node:assert";
import { checkPermission } from "~/utils/permission";

test("permissionProblemUpdate", async () => {
  const root = await createRequest(1);
  const admin = await createRequest(2);
  const user = await createRequest(3);
  const banned = await createRequest(4);
  const guest = new Request("http://localhost:8080/");

  assert(await checkPermission(permission, root, problemPub), "Root 可以修改不属于任何团队的公开题目");
  assert(await checkPermission(permission, root, problemPrv), "Root 可以修改不属于任何团队的私有题目");
  assert(await checkPermission(permission, root, problemTeamAPub), "Root 可以修改担任 Owner 身份的团队的公开题目");
  assert(await checkPermission(permission, root, problemTeamAPrv), "Root 可以修改担任 Owner 身份的团队的私有题目");
  assert(await checkPermission(permission, root, problemTeamBPub), "Root 可以修改担任 Admin 身份的团队的公开题目");
  assert(await checkPermission(permission, root, problemTeamBPrv), "Root 可以修改担任 Admin 身份的团队的私有题目");
  assert(await checkPermission(permission, root, problemTeamCPub), "Root 可以修改担任 Member 身份的团队的公开题目");
  assert(await checkPermission(permission, root, problemTeamCPrv), "Root 可以修改担任 Member 身份的团队的私有题目");
  assert(await checkPermission(permission, root, problemTeamDPub), "Root 可以修改其他团队的公开题目");
  assert(await checkPermission(permission, root, problemTeamDPrv), "Root 可以修改其他团队的私有题目");

  assert(await checkPermission(permission, admin, problemPub), "Admin 可以修改不属于任何团队的公开题目");
  assert(await checkPermission(permission, admin, problemPrv), "Admin 可以修改不属于任何团队的私有题目");
  assert(await checkPermission(permission, admin, problemTeamAPub), "Admin 可以修改担任 Owner 身份的团队的公开题目");
  assert(await checkPermission(permission, admin, problemTeamAPrv), "Admin 可以修改担任 Owner 身份的团队的私有题目");
  assert(await checkPermission(permission, admin, problemTeamBPub), "Admin 可以修改担任 Admin 身份的团队的公开题目");
  assert(await checkPermission(permission, admin, problemTeamBPrv), "Admin 可以修改担任 Admin 身份的团队的私有题目");
  assert(await checkPermission(permission, admin, problemTeamCPub), "Admin 可以修改担任 Member 身份的团队的公开题目");
  assert(await checkPermission(permission, admin, problemTeamCPrv), "Admin 可以修改担任 Member 身份的团队的私有题目");
  assert(await checkPermission(permission, admin, problemTeamDPub), "Admin 可以修改其他团队的公开题目");
  assert(await checkPermission(permission, admin, problemTeamDPrv), "Admin 可以修改其他团队的私有题目");

  assert(!(await checkPermission(permission, user, problemPub)), "User 不可以修改不属于任何团队的公开题目");
  assert(!(await checkPermission(permission, user, problemPrv)), "User 不可以修改不属于任何团队的私有题目");
  assert(await checkPermission(permission, user, problemTeamAPub), "User 可以修改担任 Owner 身份的团队的公开题目");
  assert(await checkPermission(permission, user, problemTeamAPrv), "User 可以修改担任 Owner 身份的团队的私有题目");
  assert(await checkPermission(permission, user, problemTeamBPub), "User 可以修改担任 Admin 身份的团队的公开题目");
  assert(await checkPermission(permission, user, problemTeamBPrv), "User 可以修改担任 Admin 身份的团队的私有题目");
  assert(!(await checkPermission(permission, user, problemTeamCPub)), "User 不可以修改担任 Member 身份的团队的公开题目");
  assert(!(await checkPermission(permission, user, problemTeamCPrv)), "User 不可以修改担任 Member 身份的团队的私有题目");
  assert(!(await checkPermission(permission, user, problemTeamDPub)), "User 不可以修改其他团队的公开题目");
  assert(!(await checkPermission(permission, user, problemTeamDPrv)), "User 不可以修改其他团队的私有题目");

  assert(!(await checkPermission(permission, banned, problemPub)), "Banned 不可以修改不属于任何团队的公开题目");
  assert(!(await checkPermission(permission, banned, problemPrv)), "Banned 不可以修改不属于任何团队的私有题目");
  assert(!(await checkPermission(permission, banned, problemTeamAPub)), "Banned 不可以修改担任 Owner 身份的团队的公开题目");
  assert(!(await checkPermission(permission, banned, problemTeamAPrv)), "Banned 不可以修改担任 Owner 身份的团队的私有题目");
  assert(!(await checkPermission(permission, banned, problemTeamBPub)), "Banned 不可以修改担任 Admin 身份的团队的公开题目");
  assert(!(await checkPermission(permission, banned, problemTeamBPrv)), "Banned 不可以修改担任 Admin 身份的团队的私有题目");
  assert(!(await checkPermission(permission, banned, problemTeamCPub)), "Banned 不可以修改担任 Member 身份的团队的公开题目");
  assert(!(await checkPermission(permission, banned, problemTeamCPrv)), "Banned 不可以修改担任 Member 身份的团队的私有题目");
  assert(!(await checkPermission(permission, banned, problemTeamDPub)), "Banned 不可以修改其他团队的公开题目");
  assert(!(await checkPermission(permission, banned, problemTeamDPrv)), "Banned 不可以修改其他团队的私有题目");

  assert(!(await checkPermission(permission, guest, problemPub)), "Guest 不可以修改不属于任何团队的公开题目");
  assert(!(await checkPermission(permission, guest, problemPrv)), "Guest 不可以修改不属于任何团队的私有题目");
  assert(!(await checkPermission(permission, guest, problemTeamDPub)), "Guest 不可以修改其他团队的公开题目");
  assert(!(await checkPermission(permission, guest, problemTeamDPrv)), "Guest 不可以修改其他团队的私有题目");
});
