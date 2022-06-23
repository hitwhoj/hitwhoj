import { Request } from "@remix-run/node";
import { before } from "mocha";
import { checkProblemReadPermission } from "~/utils/permission/problem";
import {
  createRequest,
  problemAdmin2Private,
  problemAdmin2Public,
  problemAdminPrivate,
  problemAdminPublic,
  problemBanned2Private,
  problemBanned2Public,
  problemBannedPrivate,
  problemBannedPublic,
  problemRoot2Private,
  problemRoot2Public,
  problemRootPrivate,
  problemRootPublic,
  problemTeamAPrivate,
  problemTeamAPublic,
  problemTeamBPrivate,
  problemTeamBPublic,
  problemTeamCPrivate,
  problemTeamCPublic,
  problemTeamDPrivate,
  problemTeamDPublic,
  problemUser2Private,
  problemUser2Public,
  problemUserPrivate,
  problemUserPublic,
  rejects,
  resolves,
} from "../tools";

// 测试访问权限
describe("checkUserReadPermission", () => {
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

  // Root
  it("Root 可以访问自己创建的公开题目", () =>
    resolves(checkProblemReadPermission(root, problemRootPublic)));
  it("Root 可以访问自己创建的私有题目", () =>
    resolves(checkProblemReadPermission(root, problemRootPrivate)));
  it("Root 可以访问其他 Root 创建的公开题目", () =>
    resolves(checkProblemReadPermission(root, problemRoot2Public)));
  it("Root 可以访问其他 Root 创建的私有题目", () =>
    resolves(checkProblemReadPermission(root, problemRoot2Private)));
  it("Root 可以访问其他 Admin 创建的公开题目", () =>
    resolves(checkProblemReadPermission(root, problemAdminPublic)));
  it("Root 可以访问其他 Admin 创建的私有题目", () =>
    resolves(checkProblemReadPermission(root, problemAdminPrivate)));
  it("Root 可以访问其他 User 创建的公开题目", () =>
    resolves(checkProblemReadPermission(root, problemUserPublic)));
  it("Root 可以访问其他 User 创建的私有题目", () =>
    resolves(checkProblemReadPermission(root, problemUserPrivate)));
  it("Root 可以访问其他 Banned 创建的公开题目", () =>
    resolves(checkProblemReadPermission(root, problemBannedPublic)));
  it("Root 可以访问其他 Banned 创建的私有题目", () =>
    resolves(checkProblemReadPermission(root, problemBannedPrivate)));
  it("Root 可以访问所属团队（Owner 身份）的公开题目", () =>
    resolves(checkProblemReadPermission(root, problemTeamAPublic)));
  it("Root 可以访问所属团队（Owner 身份）的私有题目", () =>
    resolves(checkProblemReadPermission(root, problemTeamAPrivate)));
  it("Root 可以访问所属团队（Admin 身份）的公开题目", () =>
    resolves(checkProblemReadPermission(root, problemTeamBPublic)));
  it("Root 可以访问所属团队（Admin 身份）的私有题目", () =>
    resolves(checkProblemReadPermission(root, problemTeamBPrivate)));
  it("Root 可以访问所属团队（Member 身份）的公开题目", () =>
    resolves(checkProblemReadPermission(root, problemTeamCPublic)));
  it("Root 可以访问所属团队（Member 身份）的私有题目", () =>
    resolves(checkProblemReadPermission(root, problemTeamCPrivate)));
  it("Root 可以访问其他团队的公开题目", () =>
    resolves(checkProblemReadPermission(root, problemTeamDPublic)));
  it("Root 可以访问其他团队的私有题目", () =>
    resolves(checkProblemReadPermission(root, problemTeamDPrivate)));

  // Admin
  it("Admin 可以访问自己创建的公开题目", () =>
    resolves(checkProblemReadPermission(admin, problemAdminPublic)));
  it("Admin 可以访问自己创建的私有题目", () =>
    resolves(checkProblemReadPermission(admin, problemAdminPrivate)));
  it("Admin 可以访问其他 Root 创建的公开题目", () =>
    resolves(checkProblemReadPermission(admin, problemRootPublic)));
  it("Admin 可以访问其他 Root 创建的私有题目", () =>
    resolves(checkProblemReadPermission(admin, problemRootPrivate)));
  it("Admin 可以访问其他 Admin 创建的公开题目", () =>
    resolves(checkProblemReadPermission(admin, problemAdmin2Public)));
  it("Admin 可以访问其他 Admin 创建的私有题目", () =>
    resolves(checkProblemReadPermission(admin, problemAdmin2Private)));
  it("Admin 可以访问其他 User 创建的公开题目", () =>
    resolves(checkProblemReadPermission(admin, problemUserPublic)));
  it("Admin 可以访问其他 User 创建的私有题目", () =>
    resolves(checkProblemReadPermission(admin, problemUserPrivate)));
  it("Admin 可以访问其他 Banned 创建的公开题目", () =>
    resolves(checkProblemReadPermission(admin, problemBannedPublic)));
  it("Admin 可以访问其他 Banned 创建的私有题目", () =>
    resolves(checkProblemReadPermission(admin, problemBannedPrivate)));
  it("Admin 可以访问所属团队（Owner 身份）的公开题目", () =>
    resolves(checkProblemReadPermission(admin, problemTeamAPublic)));
  it("Admin 可以访问所属团队（Owner 身份）的私有题目", () =>
    resolves(checkProblemReadPermission(admin, problemTeamAPrivate)));
  it("Admin 可以访问所属团队（Admin 身份）的公开题目", () =>
    resolves(checkProblemReadPermission(admin, problemTeamBPublic)));
  it("Admin 可以访问所属团队（Admin 身份）的私有题目", () =>
    resolves(checkProblemReadPermission(admin, problemTeamBPrivate)));
  it("Admin 可以访问所属团队（Member 身份）的公开题目", () =>
    resolves(checkProblemReadPermission(admin, problemTeamCPublic)));
  it("Admin 可以访问所属团队（Member 身份）的私有题目", () =>
    resolves(checkProblemReadPermission(admin, problemTeamCPrivate)));
  it("Admin 可以访问其他团队的公开题目", () =>
    resolves(checkProblemReadPermission(admin, problemTeamDPublic)));
  it("Admin 可以访问其他团队的私有题目", () =>
    resolves(checkProblemReadPermission(admin, problemTeamDPrivate)));

  // User
  it("User 可以访问自己创建的公开题目", () =>
    resolves(checkProblemReadPermission(user, problemUserPublic)));
  it("User 可以访问自己创建的私有题目", () =>
    resolves(checkProblemReadPermission(user, problemUserPrivate)));
  it("User 可以访问其他 Root 创建的公开题目", () =>
    resolves(checkProblemReadPermission(user, problemRootPublic)));
  it("User 不可以访问其他 Root 创建的私有题目", () =>
    rejects(checkProblemReadPermission(user, problemRootPrivate)));
  it("User 可以访问其他 Admin 创建的公开题目", () =>
    resolves(checkProblemReadPermission(user, problemAdminPublic)));
  it("User 不可以访问其他 Admin 创建的私有题目", () =>
    rejects(checkProblemReadPermission(user, problemAdminPrivate)));
  it("User 可以访问其他 User 创建的公开题目", () =>
    resolves(checkProblemReadPermission(user, problemUser2Public)));
  it("User 不可以访问其他 User 创建的私有题目", () =>
    rejects(checkProblemReadPermission(user, problemUser2Private)));
  it("User 可以访问其他 Banned 创建的公开题目", () =>
    resolves(checkProblemReadPermission(user, problemBannedPublic)));
  it("User 不可以访问其他 Banned 创建的私有题目", () =>
    rejects(checkProblemReadPermission(user, problemBannedPrivate)));
  it("User 可以访问所属团队（Owner 身份）的公开题目", () =>
    resolves(checkProblemReadPermission(user, problemTeamAPublic)));
  it("User 可以访问所属团队（Owner 身份）的私有题目", () =>
    resolves(checkProblemReadPermission(user, problemTeamAPrivate)));
  it("User 可以访问所属团队（Admin 身份）的公开题目", () =>
    resolves(checkProblemReadPermission(user, problemTeamBPublic)));
  it("User 可以访问所属团队（Admin 身份）的私有题目", () =>
    resolves(checkProblemReadPermission(user, problemTeamBPrivate)));
  it("User 可以访问所属团队（Member 身份）的公开题目", () =>
    resolves(checkProblemReadPermission(user, problemTeamCPublic)));
  it("User 不可以访问所属团队（Member 身份）的私有题目", () =>
    rejects(checkProblemReadPermission(user, problemTeamCPrivate)));
  it("User 可以访问其他团队的公开题目", () =>
    resolves(checkProblemReadPermission(user, problemTeamDPublic)));
  it("User 不可以访问其他团队的私有题目", () =>
    rejects(checkProblemReadPermission(user, problemTeamDPrivate)));

  // Banned
  it("Banned 可以访问自己创建的公开题目", () =>
    resolves(checkProblemReadPermission(banned, problemBannedPublic)));
  it("Banned 可以访问自己创建的私有题目", () =>
    resolves(checkProblemReadPermission(banned, problemBannedPrivate)));
  it("Banned 可以访问其他 Root 创建的公开题目", () =>
    resolves(checkProblemReadPermission(banned, problemRootPublic)));
  it("Banned 不可以访问其他 Root 创建的私有题目", () =>
    rejects(checkProblemReadPermission(banned, problemRootPrivate)));
  it("Banned 可以访问其他 Admin 创建的公开题目", () =>
    resolves(checkProblemReadPermission(banned, problemAdminPublic)));
  it("Banned 不可以访问其他 Admin 创建的私有题目", () =>
    rejects(checkProblemReadPermission(banned, problemAdminPrivate)));
  it("Banned 可以访问其他 User 创建的公开题目", () =>
    resolves(checkProblemReadPermission(banned, problemUserPublic)));
  it("Banned 不可以访问其他 User 创建的私有题目", () =>
    rejects(checkProblemReadPermission(banned, problemUserPrivate)));
  it("Banned 可以访问其他 Banned 创建的公开题目", () =>
    resolves(checkProblemReadPermission(banned, problemBanned2Public)));
  it("Banned 不可以访问其他 Banned 创建的私有题目", () =>
    rejects(checkProblemReadPermission(banned, problemBanned2Private)));
  it("Banned 可以访问所属团队（Owner 身份）的公开题目", () =>
    resolves(checkProblemReadPermission(banned, problemTeamAPublic)));
  it("Banned 可以访问所属团队（Owner 身份）的私有题目", () =>
    resolves(checkProblemReadPermission(banned, problemTeamAPrivate)));
  it("Banned 可以访问所属团队（Admin 身份）的公开题目", () =>
    resolves(checkProblemReadPermission(banned, problemTeamBPublic)));
  it("Banned 可以访问所属团队（Admin 身份）的私有题目", () =>
    resolves(checkProblemReadPermission(banned, problemTeamBPrivate)));
  it("Banned 可以访问所属团队（Member 身份）的公开题目", () =>
    resolves(checkProblemReadPermission(banned, problemTeamCPublic)));
  it("Banned 不可以访问所属团队（Member 身份）的私有题目", () =>
    rejects(checkProblemReadPermission(banned, problemTeamCPrivate)));
  it("Banned 可以访问其他团队的公开题目", () =>
    resolves(checkProblemReadPermission(banned, problemTeamDPublic)));
  it("Banned 不可以访问其他团队的私有题目", () =>
    rejects(checkProblemReadPermission(banned, problemTeamDPrivate)));

  // Guest
  it("Guest 可以访问其他 Root 创建的公开题目", () =>
    resolves(checkProblemReadPermission(guest, problemRootPublic)));
  it("Guest 不可以访问其他 Root 创建的私有题目", () =>
    rejects(checkProblemReadPermission(guest, problemRootPrivate)));
  it("Guest 可以访问其他 Admin 创建的公开题目", () =>
    resolves(checkProblemReadPermission(guest, problemAdminPublic)));
  it("Guest 不可以访问其他 Admin 创建的私有题目", () =>
    rejects(checkProblemReadPermission(guest, problemAdminPrivate)));
  it("Guest 可以访问其他 User 创建的公开题目", () =>
    resolves(checkProblemReadPermission(guest, problemUserPublic)));
  it("Guest 不可以访问其他 User 创建的私有题目", () =>
    rejects(checkProblemReadPermission(guest, problemUserPrivate)));
  it("Guest 可以访问其他 Banned 创建的公开题目", () =>
    resolves(checkProblemReadPermission(guest, problemBannedPublic)));
  it("Guest 不可以访问其他 Banned 创建的私有题目", () =>
    rejects(checkProblemReadPermission(guest, problemBannedPrivate)));
  it("Guest 可以访问其他团队的公开题目", () =>
    resolves(checkProblemReadPermission(guest, problemTeamDPublic)));
  it("Guest 不可以访问其他团队的私有题目", () =>
    rejects(checkProblemReadPermission(guest, problemTeamDPrivate)));
});
