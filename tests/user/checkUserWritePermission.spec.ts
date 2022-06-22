import { Request } from "@remix-run/node";
import { commitSession } from "~/utils/sessions";
import { checkUserWritePermission } from "~/utils/permission/user";
import { rejects, resolves } from "../tools";

async function createRequest(userId: number) {
  return new Request("http://localhost:8080/", {
    headers: { Cookie: `${(await commitSession(userId)).split(";")[0]}` },
  });
}

let root: Request;
let admin: Request;
let user: Request;
let banned: Request;
const guest = new Request("http://localhost:8080/");

// 预设
const rootUid = 1;
const adminUid = 2;
const userUid = 3;
const bannedUid = 4;
const rootUid2 = 5;
const adminUid2 = 6;
const userUid2 = 7;
const bannedUid2 = 8;

// 登录用户
beforeAll(async () => {
  root = await createRequest(1);
  admin = await createRequest(2);
  user = await createRequest(3);
  banned = await createRequest(4);
});

// 测试修改权限
describe("checkUserWritePermission", () => {
  // Root
  it("Root 可以修改自己", () =>
    resolves(checkUserWritePermission(root, rootUid)));
  it("Root 可以修改其他 Root", () =>
    resolves(checkUserWritePermission(root, rootUid2)));
  it("Root 可以修改 Admin", () =>
    resolves(checkUserWritePermission(root, adminUid)));
  it("Root 可以修改 User", () =>
    resolves(checkUserWritePermission(root, userUid)));
  it("Root 可以修改 Banned", () =>
    resolves(checkUserWritePermission(root, bannedUid)));

  // Admin
  it("Admin 可以修改 Root", () =>
    resolves(checkUserWritePermission(admin, rootUid)));
  it("Admin 可以修改自己", () =>
    resolves(checkUserWritePermission(admin, adminUid)));
  it("Admin 可以修改其他 Admin", () =>
    resolves(checkUserWritePermission(admin, adminUid2)));
  it("Admin 可以修改 User", () =>
    resolves(checkUserWritePermission(admin, userUid)));
  it("Admin 可以修改 Banned", () =>
    resolves(checkUserWritePermission(admin, bannedUid)));

  // User
  it("User 不可以修改 Root", () =>
    rejects(checkUserWritePermission(user, rootUid)));
  it("User 不可以修改 Admin", () =>
    rejects(checkUserWritePermission(user, adminUid)));
  it("User 可以修改自己", () =>
    resolves(checkUserWritePermission(user, userUid)));
  it("User 不可以修改其他 User", () =>
    rejects(checkUserWritePermission(user, userUid2)));
  it("User 不可以修改 Banned", () =>
    rejects(checkUserWritePermission(user, bannedUid)));

  // Banned
  it("Banned 不可以修改 Root", () =>
    rejects(checkUserWritePermission(banned, rootUid)));
  it("Banned 不可以修改 Admin", () =>
    rejects(checkUserWritePermission(banned, adminUid)));
  it("Banned 不可以修改 User", () =>
    rejects(checkUserWritePermission(banned, userUid)));
  it("Banned 可以修改自己", () =>
    rejects(checkUserWritePermission(banned, bannedUid)));
  it("Banned 不可以修改其他 Banned", () =>
    rejects(checkUserWritePermission(banned, bannedUid2)));

  // Guest
  it("Guest 不可以修改 Root", () =>
    rejects(checkUserWritePermission(guest, rootUid)));
  it("Guest 不可以修改 Admin", () =>
    rejects(checkUserWritePermission(guest, adminUid)));
  it("Guest 不可以修改 User", () =>
    rejects(checkUserWritePermission(guest, userUid)));
  it("Guest 不可以修改 Banned", () =>
    rejects(checkUserWritePermission(guest, bannedUid)));
});
