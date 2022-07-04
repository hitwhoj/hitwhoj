import { Request } from "@remix-run/node";
import { before } from "mocha";
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
  rejects,
  resolves,
} from "../tools";
import { checkProblemSetWritePermission as check } from "~/utils/permission/problemset";

describe("checkProblemSetWritePermission", () => {
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

  it("Root 可以修改不属于任何团队的公开题单", () =>
    resolves(check(root, problemSetPub)));
  it("Root 可以修改不属于任何团队的私有题单", () =>
    resolves(check(root, problemSetPrv)));
  it("Root 可以修改担任 Owner 的团队的公开题单", () =>
    resolves(check(root, problemSetTeamAPub)));
  it("Root 可以修改担任 Owner 的团队的私有题单", () =>
    resolves(check(root, problemSetTeamAPrv)));
  it("Root 可以修改担任 Admin 的团队的公开题单", () =>
    resolves(check(root, problemSetTeamBPub)));
  it("Root 可以修改担任 Admin 的团队的私有题单", () =>
    resolves(check(root, problemSetTeamBPrv)));
  it("Root 可以修改担任 Member 的团队的公开题单", () =>
    resolves(check(root, problemSetTeamCPub)));
  it("Root 可以修改担任 Member 的团队的私有题单", () =>
    resolves(check(root, problemSetTeamCPrv)));
  it("Root 可以修改其他团队的公开题单", () =>
    resolves(check(root, problemSetTeamDPub)));
  it("Root 可以修改其他团队的私有题单", () =>
    resolves(check(root, problemSetTeamDPrv)));

  it("Admin 可以修改不属于任何团队的公开题单", () =>
    resolves(check(admin, problemSetPub)));
  it("Admin 可以修改不属于任何团队的私有题单", () =>
    resolves(check(admin, problemSetPrv)));
  it("Admin 可以修改担任 Owner 的团队的公开题单", () =>
    resolves(check(admin, problemSetTeamAPub)));
  it("Admin 可以修改担任 Owner 的团队的私有题单", () =>
    resolves(check(admin, problemSetTeamAPrv)));
  it("Admin 可以修改担任 Admin 的团队的公开题单", () =>
    resolves(check(admin, problemSetTeamBPub)));
  it("Admin 可以修改担任 Admin 的团队的私有题单", () =>
    resolves(check(admin, problemSetTeamBPrv)));
  it("Admin 可以修改担任 Member 的团队的公开题单", () =>
    resolves(check(admin, problemSetTeamCPub)));
  it("Admin 可以修改担任 Member 的团队的私有题单", () =>
    resolves(check(admin, problemSetTeamCPrv)));
  it("Admin 可以修改其他团队的公开题单", () =>
    resolves(check(admin, problemSetTeamDPub)));
  it("Admin 可以修改其他团队的私有题单", () =>
    resolves(check(admin, problemSetTeamDPrv)));

  it("User 不可以修改不属于任何团队的公开题单", () =>
    rejects(check(user, problemSetPub)));
  it("User 不可以修改不属于任何团队的私有题单", () =>
    rejects(check(user, problemSetPrv)));
  it("User 可以修改担任 Owner 的团队的公开题单", () =>
    resolves(check(user, problemSetTeamAPub)));
  it("User 可以修改担任 Owner 的团队的私有题单", () =>
    resolves(check(user, problemSetTeamAPrv)));
  it("User 可以修改担任 Admin 的团队的公开题单", () =>
    resolves(check(user, problemSetTeamBPub)));
  it("User 可以修改担任 Admin 的团队的私有题单", () =>
    resolves(check(user, problemSetTeamBPrv)));
  it("User 不可以修改担任 Member 的团队的公开题单", () =>
    rejects(check(user, problemSetTeamCPub)));
  it("User 不可以修改担任 Member 的团队的私有题单", () =>
    rejects(check(user, problemSetTeamCPrv)));
  it("User 不可以修改其他团队的公开题单", () =>
    rejects(check(user, problemSetTeamDPub)));
  it("User 不可以修改其他团队的私有题单", () =>
    rejects(check(user, problemSetTeamDPrv)));

  it("Banned 不可以修改不属于任何团队的公开题单", () =>
    rejects(check(banned, problemSetPub)));
  it("Banned 不可以修改不属于任何团队的私有题单", () =>
    rejects(check(banned, problemSetPrv)));
  it("Banned 不可以修改担任 Owner 的团队的公开题单", () =>
    rejects(check(banned, problemSetTeamAPub)));
  it("Banned 不可以修改担任 Owner 的团队的私有题单", () =>
    rejects(check(banned, problemSetTeamAPrv)));
  it("Banned 不可以修改担任 Admin 的团队的公开题单", () =>
    rejects(check(banned, problemSetTeamBPub)));
  it("Banned 不可以修改担任 Admin 的团队的私有题单", () =>
    rejects(check(banned, problemSetTeamBPrv)));
  it("Banned 不可以修改担任 Member 的团队的公开题单", () =>
    rejects(check(banned, problemSetTeamCPub)));
  it("Banned 不可以修改担任 Member 的团队的私有题单", () =>
    rejects(check(banned, problemSetTeamCPrv)));
  it("Banned 不可以修改其他团队的公开题单", () =>
    rejects(check(banned, problemSetTeamDPub)));
  it("Banned 不可以修改其他团队的私有题单", () =>
    rejects(check(banned, problemSetTeamDPrv)));

  it("Guest 不可以修改不属于任何团队的公开题单", () =>
    rejects(check(guest, problemSetPub)));
  it("Guest 不可以修改不属于任何团队的私有题单", () =>
    rejects(check(guest, problemSetPrv)));
  it("Guest 不可以修改其他团队的公开题单", () =>
    rejects(check(guest, problemSetTeamDPub)));
  it("Guest 不可以修改其他团队的私有题单", () =>
    rejects(check(guest, problemSetTeamDPrv)));
});
