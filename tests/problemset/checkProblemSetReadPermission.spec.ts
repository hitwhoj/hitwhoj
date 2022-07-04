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
import { checkProblemSetReadPermission as check } from "~/utils/permission/problemset";

describe("checkProblemSetReadPermission", () => {
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

  it("Root 可以读取不属于任何团队的公开题单", () =>
    resolves(check(root, problemSetPub)));
  it("Root 可以读取不属于任何团队的私有题单", () =>
    resolves(check(root, problemSetPrv)));
  it("Root 可以读取担任 Owner 的团队的公开题单", () =>
    resolves(check(root, problemSetTeamAPub)));
  it("Root 可以读取担任 Owner 的团队的私有题单", () =>
    resolves(check(root, problemSetTeamAPrv)));
  it("Root 可以读取担任 Admin 的团队的公开题单", () =>
    resolves(check(root, problemSetTeamBPub)));
  it("Root 可以读取担任 Admin 的团队的私有题单", () =>
    resolves(check(root, problemSetTeamBPrv)));
  it("Root 可以读取担任 Member 的团队的公开题单", () =>
    resolves(check(root, problemSetTeamCPub)));
  it("Root 可以读取担任 Member 的团队的私有题单", () =>
    resolves(check(root, problemSetTeamCPrv)));
  it("Root 可以读取其他团队的公开题单", () =>
    resolves(check(root, problemSetTeamDPub)));
  it("Root 可以读取其他团队的私有题单", () =>
    resolves(check(root, problemSetTeamDPrv)));

  it("Admin 可以读取不属于任何团队的公开题单", () =>
    resolves(check(admin, problemSetPub)));
  it("Admin 可以读取不属于任何团队的私有题单", () =>
    resolves(check(admin, problemSetPrv)));
  it("Admin 可以读取担任 Owner 的团队的公开题单", () =>
    resolves(check(admin, problemSetTeamAPub)));
  it("Admin 可以读取担任 Owner 的团队的私有题单", () =>
    resolves(check(admin, problemSetTeamAPrv)));
  it("Admin 可以读取担任 Admin 的团队的公开题单", () =>
    resolves(check(admin, problemSetTeamBPub)));
  it("Admin 可以读取担任 Admin 的团队的私有题单", () =>
    resolves(check(admin, problemSetTeamBPrv)));
  it("Admin 可以读取担任 Member 的团队的公开题单", () =>
    resolves(check(admin, problemSetTeamCPub)));
  it("Admin 可以读取担任 Member 的团队的私有题单", () =>
    resolves(check(admin, problemSetTeamCPrv)));
  it("Admin 可以读取其他团队的公开题单", () =>
    resolves(check(admin, problemSetTeamDPub)));
  it("Admin 可以读取其他团队的私有题单", () =>
    resolves(check(admin, problemSetTeamDPrv)));

  it("User 可以读取不属于任何团队的公开题单", () =>
    resolves(check(user, problemSetPub)));
  it("User 不可以读取不属于任何团队的私有题单", () =>
    rejects(check(user, problemSetPrv)));
  it("User 可以读取担任 Owner 的团队的公开题单", () =>
    resolves(check(user, problemSetTeamAPub)));
  it("User 可以读取担任 Owner 的团队的私有题单", () =>
    resolves(check(user, problemSetTeamAPrv)));
  it("User 可以读取担任 Admin 的团队的公开题单", () =>
    resolves(check(user, problemSetTeamBPub)));
  it("User 可以读取担任 Admin 的团队的私有题单", () =>
    resolves(check(user, problemSetTeamBPrv)));
  it("User 可以读取担任 Member 的团队的公开题单", () =>
    resolves(check(user, problemSetTeamCPub)));
  it("User 不可以读取担任 Member 的团队的私有题单", () =>
    rejects(check(user, problemSetTeamCPrv)));
  it("User 可以读取其他团队的公开题单", () =>
    resolves(check(user, problemSetTeamDPub)));
  it("User 不可以读取其他团队的私有题单", () =>
    rejects(check(user, problemSetTeamDPrv)));

  it("Banned 可以读取不属于任何团队的公开题单", () =>
    resolves(check(banned, problemSetPub)));
  it("Banned 不可以读取不属于任何团队的私有题单", () =>
    rejects(check(banned, problemSetPrv)));
  it("Banned 可以读取担任 Owner 的团队的公开题单", () =>
    resolves(check(banned, problemSetTeamAPub)));
  it("Banned 可以读取担任 Owner 的团队的私有题单", () =>
    resolves(check(banned, problemSetTeamAPrv)));
  it("Banned 可以读取担任 Admin 的团队的公开题单", () =>
    resolves(check(banned, problemSetTeamBPub)));
  it("Banned 可以读取担任 Admin 的团队的私有题单", () =>
    resolves(check(banned, problemSetTeamBPrv)));
  it("Banned 可以读取担任 Member 的团队的公开题单", () =>
    resolves(check(banned, problemSetTeamCPub)));
  it("Banned 不可以读取担任 Member 的团队的私有题单", () =>
    rejects(check(banned, problemSetTeamCPrv)));
  it("Banned 可以读取其他团队的公开题单", () =>
    resolves(check(banned, problemSetTeamDPub)));
  it("Banned 不可以读取其他团队的私有题单", () =>
    rejects(check(banned, problemSetTeamDPrv)));

  it("Guest 可以读取不属于任何团队的公开题单", () =>
    resolves(check(guest, problemSetPub)));
  it("Guest 不可以读取不属于任何团队的私有题单", () =>
    rejects(check(guest, problemSetPrv)));
  it("Guest 可以读取其他团队的公开题单", () =>
    resolves(check(guest, problemSetTeamDPub)));
  it("Guest 不可以读取其他团队的私有题单", () =>
    rejects(check(guest, problemSetTeamDPrv)));
});
