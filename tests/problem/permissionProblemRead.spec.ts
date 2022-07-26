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
import { permissionProblemRead as permission } from "~/utils/permission/problem";
import { assert } from "chai";

describe("permissionProblemRead", () => {
  let root: Request;
  let admin: Request;
  let user: Request;
  let banned: Request;
  let guest: Request;

  before(async () => {
    root = await createRequest(1);
    admin = await createRequest(2);
    user = await createRequest(3);
    banned = await createRequest(4);
    guest = new Request("http://localhost:8080/");
  });

  it("Root 可以访问不属于任何团队的公开题目", async () =>
    assert(await permission.check(root, problemPub)));
  it("Root 可以访问不属于任何团队的私有题目", async () =>
    assert(await permission.check(root, problemPrv)));
  it("Root 可以访问担任 Owner 身份的团队的公开题目", async () =>
    assert(await permission.check(root, problemTeamAPub)));
  it("Root 可以访问担任 Owner 身份的团队的私有题目", async () =>
    assert(await permission.check(root, problemTeamAPrv)));
  it("Root 可以访问担任 Admin 身份的团队的公开题目", async () =>
    assert(await permission.check(root, problemTeamBPub)));
  it("Root 可以访问担任 Admin 身份的团队的私有题目", async () =>
    assert(await permission.check(root, problemTeamBPrv)));
  it("Root 可以访问担任 Member 身份的团队的公开题目", async () =>
    assert(await permission.check(root, problemTeamCPub)));
  it("Root 可以访问担任 Member 身份的团队的私有题目", async () =>
    assert(await permission.check(root, problemTeamCPrv)));
  it("Root 可以访问其他团队的公开题目", async () =>
    assert(await permission.check(root, problemTeamDPub)));
  it("Root 可以访问其他团队的私有题目", async () =>
    assert(await permission.check(root, problemTeamDPrv)));

  it("Admin 可以访问不属于任何团队的公开题目", async () =>
    assert(await permission.check(admin, problemPub)));
  it("Admin 可以访问不属于任何团队的私有题目", async () =>
    assert(await permission.check(admin, problemPrv)));
  it("Admin 可以访问担任 Owner 身份的团队的公开题目", async () =>
    assert(await permission.check(admin, problemTeamAPub)));
  it("Admin 可以访问担任 Owner 身份的团队的私有题目", async () =>
    assert(await permission.check(admin, problemTeamAPrv)));
  it("Admin 可以访问担任 Admin 身份的团队的公开题目", async () =>
    assert(await permission.check(admin, problemTeamBPub)));
  it("Admin 可以访问担任 Admin 身份的团队的私有题目", async () =>
    assert(await permission.check(admin, problemTeamBPrv)));
  it("Admin 可以访问担任 Member 身份的团队的公开题目", async () =>
    assert(await permission.check(admin, problemTeamCPub)));
  it("Admin 可以访问担任 Member 身份的团队的私有题目", async () =>
    assert(await permission.check(admin, problemTeamCPrv)));
  it("Admin 可以访问其他团队的公开题目", async () =>
    assert(await permission.check(admin, problemTeamDPub)));
  it("Admin 可以访问其他团队的私有题目", async () =>
    assert(await permission.check(admin, problemTeamDPrv)));

  it("User 可以访问不属于任何团队的公开题目", async () =>
    assert(await permission.check(user, problemPub)));
  it("User 不可以访问不属于任何团队的私有题目", async () =>
    assert(!(await permission.check(user, problemPrv))));
  it("User 可以访问担任 Owner 身份的团队的公开题目", async () =>
    assert(await permission.check(user, problemTeamAPub)));
  it("User 可以访问担任 Owner 身份的团队的私有题目", async () =>
    assert(await permission.check(user, problemTeamAPrv)));
  it("User 可以访问担任 Admin 身份的团队的公开题目", async () =>
    assert(await permission.check(user, problemTeamBPub)));
  it("User 可以访问担任 Admin 身份的团队的私有题目", async () =>
    assert(await permission.check(user, problemTeamBPrv)));
  it("User 可以访问担任 Member 身份的团队的公开题目", async () =>
    assert(await permission.check(user, problemTeamCPub)));
  it("User 不可以访问担任 Member 身份的团队的私有题目", async () =>
    assert(!(await permission.check(user, problemTeamCPrv))));
  it("User 可以访问其他团队的公开题目", async () =>
    assert(await permission.check(user, problemTeamDPub)));
  it("User 不可以访问其他团队的私有题目", async () =>
    assert(!(await permission.check(user, problemTeamDPrv))));

  it("Banned 可以访问不属于任何团队的公开题目", async () =>
    assert(await permission.check(banned, problemPub)));
  it("Banned 不可以访问不属于任何团队的私有题目", async () =>
    assert(!(await permission.check(banned, problemPrv))));
  it("Banned 可以访问担任 Owner 身份的团队的公开题目", async () =>
    assert(await permission.check(banned, problemTeamAPub)));
  it("Banned 可以访问担任 Owner 身份的团队的私有题目", async () =>
    assert(await permission.check(banned, problemTeamAPrv)));
  it("Banned 可以访问担任 Admin 身份的团队的公开题目", async () =>
    assert(await permission.check(banned, problemTeamBPub)));
  it("Banned 可以访问担任 Admin 身份的团队的私有题目", async () =>
    assert(await permission.check(banned, problemTeamBPrv)));
  it("Banned 可以访问担任 Member 身份的团队的公开题目", async () =>
    assert(await permission.check(banned, problemTeamCPub)));
  it("Banned 不可以访问担任 Member 身份的团队的私有题目", async () =>
    assert(!(await permission.check(banned, problemTeamCPrv))));
  it("Banned 可以访问其他团队的公开题目", async () =>
    assert(await permission.check(banned, problemTeamDPub)));
  it("Banned 不可以访问其他团队的私有题目", async () =>
    assert(!(await permission.check(banned, problemTeamDPrv))));

  it("Guest 可以访问不属于任何团队的公开题目", async () =>
    assert(await permission.check(guest, problemPub)));
  it("Guest 不可以访问不属于任何团队的私有题目", async () =>
    assert(!(await permission.check(guest, problemPrv))));
  it("Guest 可以访问其他团队的公开题目", async () =>
    assert(await permission.check(guest, problemTeamDPub)));
  it("Guest 不可以访问其他团队的私有题目", async () =>
    assert(!(await permission.check(guest, problemTeamDPrv))));
});
