import { Request } from "@remix-run/node";
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

  // Root
  it("Root 可以修改自己创建的公开题目", () =>
    resolves(check(root, problemRootPublic)));
  it("Root 可以修改自己创建的私有题目", () =>
    resolves(check(root, problemRootPrivate)));
  it("Root 可以修改其他 Root 创建的公开题目", () =>
    resolves(check(root, problemRoot2Public)));
  it("Root 可以修改其他 Root 创建的私有题目", () =>
    resolves(check(root, problemRoot2Private)));
  it("Root 可以修改其他 Admin 创建的公开题目", () =>
    resolves(check(root, problemAdminPublic)));
  it("Root 可以修改其他 Admin 创建的私有题目", () =>
    resolves(check(root, problemAdminPrivate)));
  it("Root 可以修改其他 User 创建的公开题目", () =>
    resolves(check(root, problemUserPublic)));
  it("Root 可以修改其他 User 创建的私有题目", () =>
    resolves(check(root, problemUserPrivate)));
  it("Root 可以修改其他 Banned 创建的公开题目", () =>
    resolves(check(root, problemBannedPublic)));
  it("Root 可以修改其他 Banned 创建的私有题目", () =>
    resolves(check(root, problemBannedPrivate)));
  it("Root 可以修改所属团队（Owner 身份）的公开题目", () =>
    resolves(check(root, problemTeamAPublic)));
  it("Root 可以修改所属团队（Owner 身份）的私有题目", () =>
    resolves(check(root, problemTeamAPrivate)));
  it("Root 可以修改所属团队（Admin 身份）的公开题目", () =>
    resolves(check(root, problemTeamBPublic)));
  it("Root 可以修改所属团队（Admin 身份）的私有题目", () =>
    resolves(check(root, problemTeamBPrivate)));
  it("Root 可以修改所属团队（Member 身份）的公开题目", () =>
    resolves(check(root, problemTeamCPublic)));
  it("Root 可以修改所属团队（Member 身份）的私有题目", () =>
    resolves(check(root, problemTeamCPrivate)));
  it("Root 可以修改其他团队的公开题目", () =>
    resolves(check(root, problemTeamDPublic)));
  it("Root 可以修改其他团队的私有题目", () =>
    resolves(check(root, problemTeamDPrivate)));

  // Admin
  it("Admin 可以修改自己创建的公开题目", () =>
    resolves(check(admin, problemAdminPublic)));
  it("Admin 可以修改自己创建的私有题目", () =>
    resolves(check(admin, problemAdminPrivate)));
  it("Admin 可以修改其他 Root 创建的公开题目", () =>
    resolves(check(admin, problemRootPublic)));
  it("Admin 可以修改其他 Root 创建的私有题目", () =>
    resolves(check(admin, problemRootPrivate)));
  it("Admin 可以修改其他 Admin 创建的公开题目", () =>
    resolves(check(admin, problemAdmin2Public)));
  it("Admin 可以修改其他 Admin 创建的私有题目", () =>
    resolves(check(admin, problemAdmin2Private)));
  it("Admin 可以修改其他 User 创建的公开题目", () =>
    resolves(check(admin, problemUserPublic)));
  it("Admin 可以修改其他 User 创建的私有题目", () =>
    resolves(check(admin, problemUserPrivate)));
  it("Admin 可以修改其他 Banned 创建的公开题目", () =>
    resolves(check(admin, problemBannedPublic)));
  it("Admin 可以修改其他 Banned 创建的私有题目", () =>
    resolves(check(admin, problemBannedPrivate)));
  it("Admin 可以修改所属团队（Owner 身份）的公开题目", () =>
    resolves(check(admin, problemTeamAPublic)));
  it("Admin 可以修改所属团队（Owner 身份）的私有题目", () =>
    resolves(check(admin, problemTeamAPrivate)));
  it("Admin 可以修改所属团队（Admin 身份）的公开题目", () =>
    resolves(check(admin, problemTeamBPublic)));
  it("Admin 可以修改所属团队（Admin 身份）的私有题目", () =>
    resolves(check(admin, problemTeamBPrivate)));
  it("Admin 可以修改所属团队（Member 身份）的公开题目", () =>
    resolves(check(admin, problemTeamCPublic)));
  it("Admin 可以修改所属团队（Member 身份）的私有题目", () =>
    resolves(check(admin, problemTeamCPrivate)));
  it("Admin 可以修改其他团队的公开题目", () =>
    resolves(check(admin, problemTeamDPublic)));
  it("Admin 可以修改其他团队的私有题目", () =>
    resolves(check(admin, problemTeamDPrivate)));

  // User
  it("User 可以修改自己创建的公开题目", () =>
    resolves(check(user, problemUserPublic)));
  it("User 可以修改自己创建的私有题目", () =>
    resolves(check(user, problemUserPrivate)));
  it("User 不可以修改其他 Root 创建的公开题目", () =>
    rejects(check(user, problemRootPublic)));
  it("User 不可以修改其他 Root 创建的私有题目", () =>
    rejects(check(user, problemRootPrivate)));
  it("User 不可以修改其他 Admin 创建的公开题目", () =>
    rejects(check(user, problemAdminPublic)));
  it("User 不可以修改其他 Admin 创建的私有题目", () =>
    rejects(check(user, problemAdminPrivate)));
  it("User 不可以修改其他 User 创建的公开题目", () =>
    rejects(check(user, problemUser2Public)));
  it("User 不可以修改其他 User 创建的私有题目", () =>
    rejects(check(user, problemUser2Private)));
  it("User 不可以修改其他 Banned 创建的公开题目", () =>
    rejects(check(user, problemBannedPublic)));
  it("User 不可以修改其他 Banned 创建的私有题目", () =>
    rejects(check(user, problemBannedPrivate)));
  it("User 可以修改所属团队（Owner 身份）的公开题目", () =>
    resolves(check(user, problemTeamAPublic)));
  it("User 可以修改所属团队（Owner 身份）的私有题目", () =>
    resolves(check(user, problemTeamAPrivate)));
  it("User 可以修改所属团队（Admin 身份）的公开题目", () =>
    resolves(check(user, problemTeamBPublic)));
  it("User 可以修改所属团队（Admin 身份）的私有题目", () =>
    resolves(check(user, problemTeamBPrivate)));
  it("User 不可以修改所属团队（Member 身份）的公开题目", () =>
    rejects(check(user, problemTeamCPublic)));
  it("User 不可以修改所属团队（Member 身份）的私有题目", () =>
    rejects(check(user, problemTeamCPrivate)));
  it("User 不可以修改其他团队的公开题目", () =>
    rejects(check(user, problemTeamDPublic)));
  it("User 不可以修改其他团队的私有题目", () =>
    rejects(check(user, problemTeamDPrivate)));

  // Banned
  it("Banned 不可以修改自己创建的公开题目", () =>
    rejects(check(banned, problemBannedPublic)));
  it("Banned 不可以修改自己创建的私有题目", () =>
    rejects(check(banned, problemBannedPrivate)));
  it("Banned 不可以修改其他 Root 创建的公开题目", () =>
    rejects(check(banned, problemRootPublic)));
  it("Banned 不可以修改其他 Root 创建的私有题目", () =>
    rejects(check(banned, problemRootPrivate)));
  it("Banned 不可以修改其他 Admin 创建的公开题目", () =>
    rejects(check(banned, problemAdminPublic)));
  it("Banned 不可以修改其他 Admin 创建的私有题目", () =>
    rejects(check(banned, problemAdminPrivate)));
  it("Banned 不可以修改其他 User 创建的公开题目", () =>
    rejects(check(banned, problemUserPublic)));
  it("Banned 不可以修改其他 User 创建的私有题目", () =>
    rejects(check(banned, problemUserPrivate)));
  it("Banned 不可以修改其他 Banned 创建的公开题目", () =>
    rejects(check(banned, problemBanned2Public)));
  it("Banned 不可以修改其他 Banned 创建的私有题目", () =>
    rejects(check(banned, problemBanned2Private)));
  it("Banned 不可以修改所属团队（Owner 身份）的公开题目", () =>
    rejects(check(banned, problemTeamAPublic)));
  it("Banned 不可以修改所属团队（Owner 身份）的私有题目", () =>
    rejects(check(banned, problemTeamAPrivate)));
  it("Banned 不可以修改所属团队（Admin 身份）的公开题目", () =>
    rejects(check(banned, problemTeamBPublic)));
  it("Banned 不可以修改所属团队（Admin 身份）的私有题目", () =>
    rejects(check(banned, problemTeamBPrivate)));
  it("Banned 不可以修改所属团队（Member 身份）的公开题目", () =>
    rejects(check(banned, problemTeamCPublic)));
  it("Banned 不可以修改所属团队（Member 身份）的私有题目", () =>
    rejects(check(banned, problemTeamCPrivate)));
  it("Banned 不可以修改其他团队的公开题目", () =>
    rejects(check(banned, problemTeamDPublic)));
  it("Banned 不可以修改其他团队的私有题目", () =>
    rejects(check(banned, problemTeamDPrivate)));

  // Guest
  it("Guest 不可以修改其他 Root 创建的公开题目", () =>
    rejects(check(guest, problemRootPublic)));
  it("Guest 不可以修改其他 Root 创建的私有题目", () =>
    rejects(check(guest, problemRootPrivate)));
  it("Guest 不可以修改其他 Admin 创建的公开题目", () =>
    rejects(check(guest, problemAdminPublic)));
  it("Guest 不可以修改其他 Admin 创建的私有题目", () =>
    rejects(check(guest, problemAdminPrivate)));
  it("Guest 不可以修改其他 User 创建的公开题目", () =>
    rejects(check(guest, problemUserPublic)));
  it("Guest 不可以修改其他 User 创建的私有题目", () =>
    rejects(check(guest, problemUserPrivate)));
  it("Guest 不可以修改其他 Banned 创建的公开题目", () =>
    rejects(check(guest, problemBannedPublic)));
  it("Guest 不可以修改其他 Banned 创建的私有题目", () =>
    rejects(check(guest, problemBannedPrivate)));
  it("Guest 不可以修改其他团队的公开题目", () =>
    rejects(check(guest, problemTeamDPublic)));
  it("Guest 不可以修改其他团队的私有题目", () =>
    rejects(check(guest, problemTeamDPrivate)));
});
