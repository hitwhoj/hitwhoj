import { Request } from "@remix-run/node";
import { checkProblemSubmitPermission } from "~/utils/permission/problem";
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

// 测试提交权限
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
  it("Root 可以提交自己创建的公开题目", () =>
    resolves(checkProblemSubmitPermission(root, problemRootPublic)));
  it("Root 可以提交自己创建的私有题目", () =>
    resolves(checkProblemSubmitPermission(root, problemRootPrivate)));
  it("Root 可以提交其他 Root 创建的公开题目", () =>
    resolves(checkProblemSubmitPermission(root, problemRoot2Public)));
  it("Root 可以提交其他 Root 创建的私有题目", () =>
    resolves(checkProblemSubmitPermission(root, problemRoot2Private)));
  it("Root 可以提交其他 Admin 创建的公开题目", () =>
    resolves(checkProblemSubmitPermission(root, problemAdminPublic)));
  it("Root 可以提交其他 Admin 创建的私有题目", () =>
    resolves(checkProblemSubmitPermission(root, problemAdminPrivate)));
  it("Root 可以提交其他 User 创建的公开题目", () =>
    resolves(checkProblemSubmitPermission(root, problemUserPublic)));
  it("Root 可以提交其他 User 创建的私有题目", () =>
    resolves(checkProblemSubmitPermission(root, problemUserPrivate)));
  it("Root 可以提交其他 Banned 创建的公开题目", () =>
    resolves(checkProblemSubmitPermission(root, problemBannedPublic)));
  it("Root 可以提交其他 Banned 创建的私有题目", () =>
    resolves(checkProblemSubmitPermission(root, problemBannedPrivate)));
  it("Root 可以提交所属团队（Owner 身份）的公开题目", () =>
    resolves(checkProblemSubmitPermission(root, problemTeamAPublic)));
  it("Root 可以提交所属团队（Owner 身份）的私有题目", () =>
    resolves(checkProblemSubmitPermission(root, problemTeamAPrivate)));
  it("Root 可以提交所属团队（Admin 身份）的公开题目", () =>
    resolves(checkProblemSubmitPermission(root, problemTeamBPublic)));
  it("Root 可以提交所属团队（Admin 身份）的私有题目", () =>
    resolves(checkProblemSubmitPermission(root, problemTeamBPrivate)));
  it("Root 可以提交所属团队（Member 身份）的公开题目", () =>
    resolves(checkProblemSubmitPermission(root, problemTeamCPublic)));
  it("Root 可以提交所属团队（Member 身份）的私有题目", () =>
    resolves(checkProblemSubmitPermission(root, problemTeamCPrivate)));
  it("Root 可以提交其他团队的公开题目", () =>
    resolves(checkProblemSubmitPermission(root, problemTeamDPublic)));
  it("Root 可以提交其他团队的私有题目", () =>
    resolves(checkProblemSubmitPermission(root, problemTeamDPrivate)));

  // Admin
  it("Admin 可以提交自己创建的公开题目", () =>
    resolves(checkProblemSubmitPermission(admin, problemAdminPublic)));
  it("Admin 可以提交自己创建的私有题目", () =>
    resolves(checkProblemSubmitPermission(admin, problemAdminPrivate)));
  it("Admin 可以提交其他 Root 创建的公开题目", () =>
    resolves(checkProblemSubmitPermission(admin, problemRootPublic)));
  it("Admin 可以提交其他 Root 创建的私有题目", () =>
    resolves(checkProblemSubmitPermission(admin, problemRootPrivate)));
  it("Admin 可以提交其他 Admin 创建的公开题目", () =>
    resolves(checkProblemSubmitPermission(admin, problemAdmin2Public)));
  it("Admin 可以提交其他 Admin 创建的私有题目", () =>
    resolves(checkProblemSubmitPermission(admin, problemAdmin2Private)));
  it("Admin 可以提交其他 User 创建的公开题目", () =>
    resolves(checkProblemSubmitPermission(admin, problemUserPublic)));
  it("Admin 可以提交其他 User 创建的私有题目", () =>
    resolves(checkProblemSubmitPermission(admin, problemUserPrivate)));
  it("Admin 可以提交其他 Banned 创建的公开题目", () =>
    resolves(checkProblemSubmitPermission(admin, problemBannedPublic)));
  it("Admin 可以提交其他 Banned 创建的私有题目", () =>
    resolves(checkProblemSubmitPermission(admin, problemBannedPrivate)));
  it("Admin 可以提交所属团队（Owner 身份）的公开题目", () =>
    resolves(checkProblemSubmitPermission(admin, problemTeamAPublic)));
  it("Admin 可以提交所属团队（Owner 身份）的私有题目", () =>
    resolves(checkProblemSubmitPermission(admin, problemTeamAPrivate)));
  it("Admin 可以提交所属团队（Admin 身份）的公开题目", () =>
    resolves(checkProblemSubmitPermission(admin, problemTeamBPublic)));
  it("Admin 可以提交所属团队（Admin 身份）的私有题目", () =>
    resolves(checkProblemSubmitPermission(admin, problemTeamBPrivate)));
  it("Admin 可以提交所属团队（Member 身份）的公开题目", () =>
    resolves(checkProblemSubmitPermission(admin, problemTeamCPublic)));
  it("Admin 可以提交所属团队（Member 身份）的私有题目", () =>
    resolves(checkProblemSubmitPermission(admin, problemTeamCPrivate)));
  it("Admin 可以提交其他团队的公开题目", () =>
    resolves(checkProblemSubmitPermission(admin, problemTeamDPublic)));
  it("Admin 可以提交其他团队的私有题目", () =>
    resolves(checkProblemSubmitPermission(admin, problemTeamDPrivate)));

  // User
  it("User 可以提交自己创建的公开题目", () =>
    resolves(checkProblemSubmitPermission(user, problemUserPublic)));
  it("User 可以提交自己创建的私有题目", () =>
    resolves(checkProblemSubmitPermission(user, problemUserPrivate)));
  it("User 可以提交其他 Root 创建的公开题目", () =>
    resolves(checkProblemSubmitPermission(user, problemRootPublic)));
  it("User 不可以提交其他 Root 创建的私有题目", () =>
    rejects(checkProblemSubmitPermission(user, problemRootPrivate)));
  it("User 可以提交其他 Admin 创建的公开题目", () =>
    resolves(checkProblemSubmitPermission(user, problemAdminPublic)));
  it("User 不可以提交其他 Admin 创建的私有题目", () =>
    rejects(checkProblemSubmitPermission(user, problemAdminPrivate)));
  it("User 可以提交其他 User 创建的公开题目", () =>
    resolves(checkProblemSubmitPermission(user, problemUser2Public)));
  it("User 不可以提交其他 User 创建的私有题目", () =>
    rejects(checkProblemSubmitPermission(user, problemUser2Private)));
  it("User 可以提交其他 Banned 创建的公开题目", () =>
    resolves(checkProblemSubmitPermission(user, problemBannedPublic)));
  it("User 不可以提交其他 Banned 创建的私有题目", () =>
    rejects(checkProblemSubmitPermission(user, problemBannedPrivate)));
  it("User 可以提交所属团队（Owner 身份）的公开题目", () =>
    resolves(checkProblemSubmitPermission(user, problemTeamAPublic)));
  it("User 可以提交所属团队（Owner 身份）的私有题目", () =>
    resolves(checkProblemSubmitPermission(user, problemTeamAPrivate)));
  it("User 可以提交所属团队（Admin 身份）的公开题目", () =>
    resolves(checkProblemSubmitPermission(user, problemTeamBPublic)));
  it("User 可以提交所属团队（Admin 身份）的私有题目", () =>
    resolves(checkProblemSubmitPermission(user, problemTeamBPrivate)));
  it("User 可以提交所属团队（Member 身份）的公开题目", () =>
    resolves(checkProblemSubmitPermission(user, problemTeamCPublic)));
  it("User 不可以提交所属团队（Member 身份）的私有题目", () =>
    rejects(checkProblemSubmitPermission(user, problemTeamCPrivate)));
  it("User 可以提交其他团队的公开题目", () =>
    resolves(checkProblemSubmitPermission(user, problemTeamDPublic)));
  it("User 不可以提交其他团队的私有题目", () =>
    rejects(checkProblemSubmitPermission(user, problemTeamDPrivate)));

  // Banned
  it("Banned 不可以提交自己创建的公开题目", () =>
    rejects(checkProblemSubmitPermission(banned, problemBannedPublic)));
  it("Banned 不可以提交自己创建的私有题目", () =>
    rejects(checkProblemSubmitPermission(banned, problemBannedPrivate)));
  it("Banned 不可以提交其他 Root 创建的公开题目", () =>
    rejects(checkProblemSubmitPermission(banned, problemRootPublic)));
  it("Banned 不可以提交其他 Root 创建的私有题目", () =>
    rejects(checkProblemSubmitPermission(banned, problemRootPrivate)));
  it("Banned 不可以提交其他 Admin 创建的公开题目", () =>
    rejects(checkProblemSubmitPermission(banned, problemAdminPublic)));
  it("Banned 不可以提交其他 Admin 创建的私有题目", () =>
    rejects(checkProblemSubmitPermission(banned, problemAdminPrivate)));
  it("Banned 不可以提交其他 User 创建的公开题目", () =>
    rejects(checkProblemSubmitPermission(banned, problemUserPublic)));
  it("Banned 不可以提交其他 User 创建的私有题目", () =>
    rejects(checkProblemSubmitPermission(banned, problemUserPrivate)));
  it("Banned 不可以提交其他 Banned 创建的公开题目", () =>
    rejects(checkProblemSubmitPermission(banned, problemBanned2Public)));
  it("Banned 不可以提交其他 Banned 创建的私有题目", () =>
    rejects(checkProblemSubmitPermission(banned, problemBanned2Private)));
  it("Banned 不可以提交所属团队（Owner 身份）的公开题目", () =>
    rejects(checkProblemSubmitPermission(banned, problemTeamAPublic)));
  it("Banned 不可以提交所属团队（Owner 身份）的私有题目", () =>
    rejects(checkProblemSubmitPermission(banned, problemTeamAPrivate)));
  it("Banned 不可以提交所属团队（Admin 身份）的公开题目", () =>
    rejects(checkProblemSubmitPermission(banned, problemTeamBPublic)));
  it("Banned 不可以提交所属团队（Admin 身份）的私有题目", () =>
    rejects(checkProblemSubmitPermission(banned, problemTeamBPrivate)));
  it("Banned 不可以提交所属团队（Member 身份）的公开题目", () =>
    rejects(checkProblemSubmitPermission(banned, problemTeamCPublic)));
  it("Banned 不可以提交所属团队（Member 身份）的私有题目", () =>
    rejects(checkProblemSubmitPermission(banned, problemTeamCPrivate)));
  it("Banned 不可以提交其他团队的公开题目", () =>
    rejects(checkProblemSubmitPermission(banned, problemTeamDPublic)));
  it("Banned 不可以提交其他团队的私有题目", () =>
    rejects(checkProblemSubmitPermission(banned, problemTeamDPrivate)));

  // Guest
  it("Guest 不可以提交其他 Root 创建的公开题目", () =>
    rejects(checkProblemSubmitPermission(guest, problemRootPublic)));
  it("Guest 不可以提交其他 Root 创建的私有题目", () =>
    rejects(checkProblemSubmitPermission(guest, problemRootPrivate)));
  it("Guest 不可以提交其他 Admin 创建的公开题目", () =>
    rejects(checkProblemSubmitPermission(guest, problemAdminPublic)));
  it("Guest 不可以提交其他 Admin 创建的私有题目", () =>
    rejects(checkProblemSubmitPermission(guest, problemAdminPrivate)));
  it("Guest 不可以提交其他 User 创建的公开题目", () =>
    rejects(checkProblemSubmitPermission(guest, problemUserPublic)));
  it("Guest 不可以提交其他 User 创建的私有题目", () =>
    rejects(checkProblemSubmitPermission(guest, problemUserPrivate)));
  it("Guest 不可以提交其他 Banned 创建的公开题目", () =>
    rejects(checkProblemSubmitPermission(guest, problemBannedPublic)));
  it("Guest 不可以提交其他 Banned 创建的私有题目", () =>
    rejects(checkProblemSubmitPermission(guest, problemBannedPrivate)));
  it("Guest 不可以提交其他团队的公开题目", () =>
    rejects(checkProblemSubmitPermission(guest, problemTeamDPublic)));
  it("Guest 不可以提交其他团队的私有题目", () =>
    rejects(checkProblemSubmitPermission(guest, problemTeamDPrivate)));
});
