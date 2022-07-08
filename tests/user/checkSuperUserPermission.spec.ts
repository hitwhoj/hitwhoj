import { createRequest, rejects, resolves } from "tests/tools";
import { Request } from "@remix-run/node";
import { checkSuperUserPermission as check } from "~/utils/permission/user";

describe("checkSuperUserPermission", () => {
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

  it("Root 是超级管理员", () => resolves(check(root)));
  it("Admin 不是超级管理员", () => rejects(check(admin)));
  it("User 不是超级管理员", () => rejects(check(user)));
  it("Banned 不是超级管理员", () => rejects(check(banned)));
  it("Guest 不是超级管理员", () => rejects(check(guest)));
});
