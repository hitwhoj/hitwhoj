import { Request } from "@remix-run/node";
import { checkProblemWritePermission } from "~/utils/permission/problem";
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

// 测试修改权限
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
  it("Root 可以修改自己创建的公开题目", () =>
    resolves(checkProblemWritePermission(root, problemRootPublic)));
  it("Root 可以修改自己创建的私有题目", () =>
    resolves(checkProblemWritePermission(root, problemRootPrivate)));
  it("Root 可以修改其他 Root 创建的公开题目", () =>
    resolves(checkProblemWritePermission(root, problemRoot2Public)));
  it("Root 可以修改其他 Root 创建的私有题目", () =>
    resolves(checkProblemWritePermission(root, problemRoot2Private)));
  it("Root 可以修改其他 Admin 创建的公开题目", () =>
    resolves(checkProblemWritePermission(root, problemAdminPublic)));
  it("Root 可以修改其他 Admin 创建的私有题目", () =>
    resolves(checkProblemWritePermission(root, problemAdminPrivate)));
  it("Root 可以修改其他 User 创建的公开题目", () =>
    resolves(checkProblemWritePermission(root, problemUserPublic)));
  it("Root 可以修改其他 User 创建的私有题目", () =>
    resolves(checkProblemWritePermission(root, problemUserPrivate)));
  it("Root 可以修改其他 Banned 创建的公开题目", () =>
    resolves(checkProblemWritePermission(root, problemBannedPublic)));
  it("Root 可以修改其他 Banned 创建的私有题目", () =>
    resolves(checkProblemWritePermission(root, problemBannedPrivate)));
  it("Root 可以修改所属团队（Owner 身份）的公开题目", () =>
    resolves(checkProblemWritePermission(root, problemTeamAPublic)));
  it("Root 可以修改所属团队（Owner 身份）的私有题目", () =>
    resolves(checkProblemWritePermission(root, problemTeamAPrivate)));
  it("Root 可以修改所属团队（Admin 身份）的公开题目", () =>
    resolves(checkProblemWritePermission(root, problemTeamBPublic)));
  it("Root 可以修改所属团队（Admin 身份）的私有题目", () =>
    resolves(checkProblemWritePermission(root, problemTeamBPrivate)));
  it("Root 可以修改所属团队（Member 身份）的公开题目", () =>
    resolves(checkProblemWritePermission(root, problemTeamCPublic)));
  it("Root 可以修改所属团队（Member 身份）的私有题目", () =>
    resolves(checkProblemWritePermission(root, problemTeamCPrivate)));
  it("Root 可以修改其他团队的公开题目", () =>
    resolves(checkProblemWritePermission(root, problemTeamDPublic)));
  it("Root 可以修改其他团队的私有题目", () =>
    resolves(checkProblemWritePermission(root, problemTeamDPrivate)));

  // Admin
  it("Admin 可以修改自己创建的公开题目", () =>
    resolves(checkProblemWritePermission(admin, problemAdminPublic)));
  it("Admin 可以修改自己创建的私有题目", () =>
    resolves(checkProblemWritePermission(admin, problemAdminPrivate)));
  it("Admin 可以修改其他 Root 创建的公开题目", () =>
    resolves(checkProblemWritePermission(admin, problemRootPublic)));
  it("Admin 可以修改其他 Root 创建的私有题目", () =>
    resolves(checkProblemWritePermission(admin, problemRootPrivate)));
  it("Admin 可以修改其他 Admin 创建的公开题目", () =>
    resolves(checkProblemWritePermission(admin, problemAdmin2Public)));
  it("Admin 可以修改其他 Admin 创建的私有题目", () =>
    resolves(checkProblemWritePermission(admin, problemAdmin2Private)));
  it("Admin 可以修改其他 User 创建的公开题目", () =>
    resolves(checkProblemWritePermission(admin, problemUserPublic)));
  it("Admin 可以修改其他 User 创建的私有题目", () =>
    resolves(checkProblemWritePermission(admin, problemUserPrivate)));
  it("Admin 可以修改其他 Banned 创建的公开题目", () =>
    resolves(checkProblemWritePermission(admin, problemBannedPublic)));
  it("Admin 可以修改其他 Banned 创建的私有题目", () =>
    resolves(checkProblemWritePermission(admin, problemBannedPrivate)));
  it("Admin 可以修改所属团队（Owner 身份）的公开题目", () =>
    resolves(checkProblemWritePermission(admin, problemTeamAPublic)));
  it("Admin 可以修改所属团队（Owner 身份）的私有题目", () =>
    resolves(checkProblemWritePermission(admin, problemTeamAPrivate)));
  it("Admin 可以修改所属团队（Admin 身份）的公开题目", () =>
    resolves(checkProblemWritePermission(admin, problemTeamBPublic)));
  it("Admin 可以修改所属团队（Admin 身份）的私有题目", () =>
    resolves(checkProblemWritePermission(admin, problemTeamBPrivate)));
  it("Admin 可以修改所属团队（Member 身份）的公开题目", () =>
    resolves(checkProblemWritePermission(admin, problemTeamCPublic)));
  it("Admin 可以修改所属团队（Member 身份）的私有题目", () =>
    resolves(checkProblemWritePermission(admin, problemTeamCPrivate)));
  it("Admin 可以修改其他团队的公开题目", () =>
    resolves(checkProblemWritePermission(admin, problemTeamDPublic)));
  it("Admin 可以修改其他团队的私有题目", () =>
    resolves(checkProblemWritePermission(admin, problemTeamDPrivate)));

  // User
  it("User 可以修改自己创建的公开题目", () =>
    resolves(checkProblemWritePermission(user, problemUserPublic)));
  it("User 可以修改自己创建的私有题目", () =>
    resolves(checkProblemWritePermission(user, problemUserPrivate)));
  it("User 不可以修改其他 Root 创建的公开题目", () =>
    rejects(checkProblemWritePermission(user, problemRootPublic)));
  it("User 不可以修改其他 Root 创建的私有题目", () =>
    rejects(checkProblemWritePermission(user, problemRootPrivate)));
  it("User 不可以修改其他 Admin 创建的公开题目", () =>
    rejects(checkProblemWritePermission(user, problemAdminPublic)));
  it("User 不可以修改其他 Admin 创建的私有题目", () =>
    rejects(checkProblemWritePermission(user, problemAdminPrivate)));
  it("User 不可以修改其他 User 创建的公开题目", () =>
    rejects(checkProblemWritePermission(user, problemUser2Public)));
  it("User 不可以修改其他 User 创建的私有题目", () =>
    rejects(checkProblemWritePermission(user, problemUser2Private)));
  it("User 不可以修改其他 Banned 创建的公开题目", () =>
    rejects(checkProblemWritePermission(user, problemBannedPublic)));
  it("User 不可以修改其他 Banned 创建的私有题目", () =>
    rejects(checkProblemWritePermission(user, problemBannedPrivate)));
  it("User 可以修改所属团队（Owner 身份）的公开题目", () =>
    resolves(checkProblemWritePermission(user, problemTeamAPublic)));
  it("User 可以修改所属团队（Owner 身份）的私有题目", () =>
    resolves(checkProblemWritePermission(user, problemTeamAPrivate)));
  it("User 可以修改所属团队（Admin 身份）的公开题目", () =>
    resolves(checkProblemWritePermission(user, problemTeamBPublic)));
  it("User 可以修改所属团队（Admin 身份）的私有题目", () =>
    resolves(checkProblemWritePermission(user, problemTeamBPrivate)));
  it("User 不可以修改所属团队（Member 身份）的公开题目", () =>
    rejects(checkProblemWritePermission(user, problemTeamCPublic)));
  it("User 不可以修改所属团队（Member 身份）的私有题目", () =>
    rejects(checkProblemWritePermission(user, problemTeamCPrivate)));
  it("User 不可以修改其他团队的公开题目", () =>
    rejects(checkProblemWritePermission(user, problemTeamDPublic)));
  it("User 不可以修改其他团队的私有题目", () =>
    rejects(checkProblemWritePermission(user, problemTeamDPrivate)));

  // Banned
  it("Banned 不可以修改自己创建的公开题目", () =>
    rejects(checkProblemWritePermission(banned, problemBannedPublic)));
  it("Banned 不可以修改自己创建的私有题目", () =>
    rejects(checkProblemWritePermission(banned, problemBannedPrivate)));
  it("Banned 不可以修改其他 Root 创建的公开题目", () =>
    rejects(checkProblemWritePermission(banned, problemRootPublic)));
  it("Banned 不可以修改其他 Root 创建的私有题目", () =>
    rejects(checkProblemWritePermission(banned, problemRootPrivate)));
  it("Banned 不可以修改其他 Admin 创建的公开题目", () =>
    rejects(checkProblemWritePermission(banned, problemAdminPublic)));
  it("Banned 不可以修改其他 Admin 创建的私有题目", () =>
    rejects(checkProblemWritePermission(banned, problemAdminPrivate)));
  it("Banned 不可以修改其他 User 创建的公开题目", () =>
    rejects(checkProblemWritePermission(banned, problemUserPublic)));
  it("Banned 不可以修改其他 User 创建的私有题目", () =>
    rejects(checkProblemWritePermission(banned, problemUserPrivate)));
  it("Banned 不可以修改其他 Banned 创建的公开题目", () =>
    rejects(checkProblemWritePermission(banned, problemBanned2Public)));
  it("Banned 不可以修改其他 Banned 创建的私有题目", () =>
    rejects(checkProblemWritePermission(banned, problemBanned2Private)));
  it("Banned 不可以修改所属团队（Owner 身份）的公开题目", () =>
    rejects(checkProblemWritePermission(banned, problemTeamAPublic)));
  it("Banned 不可以修改所属团队（Owner 身份）的私有题目", () =>
    rejects(checkProblemWritePermission(banned, problemTeamAPrivate)));
  it("Banned 不可以修改所属团队（Admin 身份）的公开题目", () =>
    rejects(checkProblemWritePermission(banned, problemTeamBPublic)));
  it("Banned 不可以修改所属团队（Admin 身份）的私有题目", () =>
    rejects(checkProblemWritePermission(banned, problemTeamBPrivate)));
  it("Banned 不可以修改所属团队（Member 身份）的公开题目", () =>
    rejects(checkProblemWritePermission(banned, problemTeamCPublic)));
  it("Banned 不可以修改所属团队（Member 身份）的私有题目", () =>
    rejects(checkProblemWritePermission(banned, problemTeamCPrivate)));
  it("Banned 不可以修改其他团队的公开题目", () =>
    rejects(checkProblemWritePermission(banned, problemTeamDPublic)));
  it("Banned 不可以修改其他团队的私有题目", () =>
    rejects(checkProblemWritePermission(banned, problemTeamDPrivate)));

  // Guest
  it("Guest 不可以修改其他 Root 创建的公开题目", () =>
    rejects(checkProblemWritePermission(guest, problemRootPublic)));
  it("Guest 不可以修改其他 Root 创建的私有题目", () =>
    rejects(checkProblemWritePermission(guest, problemRootPrivate)));
  it("Guest 不可以修改其他 Admin 创建的公开题目", () =>
    rejects(checkProblemWritePermission(guest, problemAdminPublic)));
  it("Guest 不可以修改其他 Admin 创建的私有题目", () =>
    rejects(checkProblemWritePermission(guest, problemAdminPrivate)));
  it("Guest 不可以修改其他 User 创建的公开题目", () =>
    rejects(checkProblemWritePermission(guest, problemUserPublic)));
  it("Guest 不可以修改其他 User 创建的私有题目", () =>
    rejects(checkProblemWritePermission(guest, problemUserPrivate)));
  it("Guest 不可以修改其他 Banned 创建的公开题目", () =>
    rejects(checkProblemWritePermission(guest, problemBannedPublic)));
  it("Guest 不可以修改其他 Banned 创建的私有题目", () =>
    rejects(checkProblemWritePermission(guest, problemBannedPrivate)));
  it("Guest 不可以修改其他团队的公开题目", () =>
    rejects(checkProblemWritePermission(guest, problemTeamDPublic)));
  it("Guest 不可以修改其他团队的私有题目", () =>
    rejects(checkProblemWritePermission(guest, problemTeamDPrivate)));
});
