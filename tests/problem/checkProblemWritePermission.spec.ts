import { Request } from "@remix-run/node";
import { before } from "mocha";
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
  rejects,
  resolves,
} from "../tools";
import { checkProblemWritePermission as check } from "~/utils/permission/problem";

describe("checkProblemWritePermission", () => {
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

  it("Root 可以修改不属于任何团队的公开题目", () =>
    resolves(check(root, problemPub)));
  it("Root 可以修改不属于任何团队的私有题目", () =>
    resolves(check(root, problemPrv)));
  it("Root 可以修改担任 Owner 身份的团队的公开题目", () =>
    resolves(check(root, problemTeamAPub)));
  it("Root 可以修改担任 Owner 身份的团队的私有题目", () =>
    resolves(check(root, problemTeamAPrv)));
  it("Root 可以修改担任 Admin 身份的团队的公开题目", () =>
    resolves(check(root, problemTeamBPub)));
  it("Root 可以修改担任 Admin 身份的团队的私有题目", () =>
    resolves(check(root, problemTeamBPrv)));
  it("Root 可以修改担任 Member 身份的团队的公开题目", () =>
    resolves(check(root, problemTeamCPub)));
  it("Root 可以修改担任 Member 身份的团队的私有题目", () =>
    resolves(check(root, problemTeamCPrv)));
  it("Root 可以修改其他团队的公开题目", () =>
    resolves(check(root, problemTeamDPub)));
  it("Root 可以修改其他团队的私有题目", () =>
    resolves(check(root, problemTeamDPrv)));

  it("Admin 可以修改不属于任何团队的公开题目", () =>
    resolves(check(admin, problemPub)));
  it("Admin 可以修改不属于任何团队的私有题目", () =>
    resolves(check(admin, problemPrv)));
  it("Admin 可以修改担任 Owner 身份的团队的公开题目", () =>
    resolves(check(admin, problemTeamAPub)));
  it("Admin 可以修改担任 Owner 身份的团队的私有题目", () =>
    resolves(check(admin, problemTeamAPrv)));
  it("Admin 可以修改担任 Admin 身份的团队的公开题目", () =>
    resolves(check(admin, problemTeamBPub)));
  it("Admin 可以修改担任 Admin 身份的团队的私有题目", () =>
    resolves(check(admin, problemTeamBPrv)));
  it("Admin 可以修改担任 Member 身份的团队的公开题目", () =>
    resolves(check(admin, problemTeamCPub)));
  it("Admin 可以修改担任 Member 身份的团队的私有题目", () =>
    resolves(check(admin, problemTeamCPrv)));
  it("Admin 可以修改其他团队的公开题目", () =>
    resolves(check(admin, problemTeamDPub)));
  it("Admin 可以修改其他团队的私有题目", () =>
    resolves(check(admin, problemTeamDPrv)));

  it("User 不可以修改不属于任何团队的公开题目", () =>
    rejects(check(user, problemPub)));
  it("User 不可以修改不属于任何团队的私有题目", () =>
    rejects(check(user, problemPrv)));
  it("User 可以修改担任 Owner 身份的团队的公开题目", () =>
    resolves(check(user, problemTeamAPub)));
  it("User 可以修改担任 Owner 身份的团队的私有题目", () =>
    resolves(check(user, problemTeamAPrv)));
  it("User 可以修改担任 Admin 身份的团队的公开题目", () =>
    resolves(check(user, problemTeamBPub)));
  it("User 可以修改担任 Admin 身份的团队的私有题目", () =>
    resolves(check(user, problemTeamBPrv)));
  it("User 不可以修改担任 Member 身份的团队的公开题目", () =>
    rejects(check(user, problemTeamCPub)));
  it("User 不可以修改担任 Member 身份的团队的私有题目", () =>
    rejects(check(user, problemTeamCPrv)));
  it("User 不可以修改其他团队的公开题目", () =>
    rejects(check(user, problemTeamDPub)));
  it("User 不可以修改其他团队的私有题目", () =>
    rejects(check(user, problemTeamDPrv)));

  it("Banned 不可以修改不属于任何团队的公开题目", () =>
    rejects(check(banned, problemPub)));
  it("Banned 不可以修改不属于任何团队的私有题目", () =>
    rejects(check(banned, problemPrv)));
  it("Banned 不可以修改担任 Owner 身份的团队的公开题目", () =>
    rejects(check(banned, problemTeamAPub)));
  it("Banned 不可以修改担任 Owner 身份的团队的私有题目", () =>
    rejects(check(banned, problemTeamAPrv)));
  it("Banned 不可以修改担任 Admin 身份的团队的公开题目", () =>
    rejects(check(banned, problemTeamBPub)));
  it("Banned 不可以修改担任 Admin 身份的团队的私有题目", () =>
    rejects(check(banned, problemTeamBPrv)));
  it("Banned 不可以修改担任 Member 身份的团队的公开题目", () =>
    rejects(check(banned, problemTeamCPub)));
  it("Banned 不可以修改担任 Member 身份的团队的私有题目", () =>
    rejects(check(banned, problemTeamCPrv)));
  it("Banned 不可以修改其他团队的公开题目", () =>
    rejects(check(banned, problemTeamDPub)));
  it("Banned 不可以修改其他团队的私有题目", () =>
    rejects(check(banned, problemTeamDPrv)));

  it("Guest 不可以修改不属于任何团队的公开题目", () =>
    rejects(check(guest, problemPub)));
  it("Guest 不可以修改不属于任何团队的私有题目", () =>
    rejects(check(guest, problemPrv)));
  it("Guest 不可以修改其他团队的公开题目", () =>
    rejects(check(guest, problemTeamDPub)));
  it("Guest 不可以修改其他团队的私有题目", () =>
    rejects(check(guest, problemTeamDPrv)));
});
