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
import { permissionProblemSubmit as permission } from "~/utils/permission/problem";
import test from "node:test";
import assert from "node:assert";

test("permissionProblemSubmit", async () => {
  const root = await createRequest(1);
  const admin = await createRequest(2);
  const user = await createRequest(3);
  const banned = await createRequest(4);
  const guest = new Request("http://localhost:8080/");

  assert(await permission.check(root, problemPub), "Root 可以提交不属于任何团队的公开题目");
  assert(await permission.check(root, problemPrv), "Root 可以提交不属于任何团队的私有题目");
  assert(await permission.check(root, problemTeamAPub), "Root 可以提交担任 Owner 身份的团队的公开题目");
  assert(await permission.check(root, problemTeamAPrv), "Root 可以提交担任 Owner 身份的团队的私有题目");
  assert(await permission.check(root, problemTeamBPub), "Root 可以提交担任 Admin 身份的团队的公开题目");
  assert(await permission.check(root, problemTeamBPrv), "Root 可以提交担任 Admin 身份的团队的私有题目");
  assert(await permission.check(root, problemTeamCPub), "Root 可以提交担任 Member 身份的团队的公开题目");
  assert(await permission.check(root, problemTeamCPrv), "Root 可以提交担任 Member 身份的团队的私有题目");
  assert(await permission.check(root, problemTeamDPub), "Root 可以提交其他团队的公开题目");
  assert(await permission.check(root, problemTeamDPrv), "Root 可以提交其他团队的私有题目");

  assert(await permission.check(admin, problemPub), "Admin 可以提交不属于任何团队的公开题目");
  assert(await permission.check(admin, problemPrv), "Admin 可以提交不属于任何团队的私有题目");
  assert(await permission.check(admin, problemTeamAPub), "Admin 可以提交担任 Owner 身份的团队的公开题目");
  assert(await permission.check(admin, problemTeamAPrv), "Admin 可以提交担任 Owner 身份的团队的私有题目");
  assert(await permission.check(admin, problemTeamBPub), "Admin 可以提交担任 Admin 身份的团队的公开题目");
  assert(await permission.check(admin, problemTeamBPrv), "Admin 可以提交担任 Admin 身份的团队的私有题目");
  assert(await permission.check(admin, problemTeamCPub), "Admin 可以提交担任 Member 身份的团队的公开题目");
  assert(await permission.check(admin, problemTeamCPrv), "Admin 可以提交担任 Member 身份的团队的私有题目");
  assert(await permission.check(admin, problemTeamDPub), "Admin 可以提交其他团队的公开题目");
  assert(await permission.check(admin, problemTeamDPrv), "Admin 可以提交其他团队的私有题目");

  assert(await permission.check(user, problemPub), "User 可以提交不属于任何团队的公开题目");
  assert(!(await permission.check(user, problemPrv)), "User 不可以提交不属于任何团队的私有题目");
  assert(await permission.check(user, problemTeamAPub), "User 可以提交担任 Owner 身份的团队的公开题目");
  assert(await permission.check(user, problemTeamAPrv), "User 可以提交担任 Owner 身份的团队的私有题目");
  assert(await permission.check(user, problemTeamBPub), "User 可以提交担任 Admin 身份的团队的公开题目");
  assert(await permission.check(user, problemTeamBPrv), "User 可以提交担任 Admin 身份的团队的私有题目");
  assert(await permission.check(user, problemTeamCPub), "User 可以提交担任 Member 身份的团队的公开题目");
  assert(!(await permission.check(user, problemTeamCPrv)), "User 不可以提交担任 Member 身份的团队的私有题目");
  assert(!(await permission.check(user, problemTeamDPub)), "User 不可以提交其他团队的公开题目");
  assert(!(await permission.check(user, problemTeamDPrv)), "User 不可以提交其他团队的私有题目");

  assert(!(await permission.check(banned, problemPub)), "Banned 不可以提交不属于任何团队的公开题目");
  assert(!(await permission.check(banned, problemPrv)), "Banned 不可以提交不属于任何团队的私有题目");
  assert(!(await permission.check(banned, problemTeamAPub)), "Banned 不可以提交担任 Owner 身份的团队的公开题目");
  assert(!(await permission.check(banned, problemTeamAPrv)), "Banned 不可以提交担任 Owner 身份的团队的私有题目");
  assert(!(await permission.check(banned, problemTeamBPub)), "Banned 不可以提交担任 Admin 身份的团队的公开题目");
  assert(!(await permission.check(banned, problemTeamBPrv)), "Banned 不可以提交担任 Admin 身份的团队的私有题目");
  assert(!(await permission.check(banned, problemTeamCPub)), "Banned 不可以提交担任 Member 身份的团队的公开题目");
  assert(!(await permission.check(banned, problemTeamCPrv)), "Banned 不可以提交担任 Member 身份的团队的私有题目");
  assert(!(await permission.check(banned, problemTeamDPub)), "Banned 不可以提交其他团队的公开题目");
  assert(!(await permission.check(banned, problemTeamDPrv)), "Banned 不可以提交其他团队的私有题目");

  assert(!(await permission.check(guest, problemPub)), "Guest 不可以提交不属于任何团队的公开题目");
  assert(!(await permission.check(guest, problemPrv)), "Guest 不可以提交不属于任何团队的私有题目");
  assert(!(await permission.check(guest, problemTeamDPub)), "Guest 不可以提交其他团队的公开题目");
  assert(!(await permission.check(guest, problemTeamDPrv)), "Guest 不可以提交其他团队的私有题目");
});
