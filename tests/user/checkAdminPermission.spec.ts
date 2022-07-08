import { createRequest, rejects, resolves } from "tests/tools";
import { Request } from "@remix-run/node";
import { checkAdminPermission as check } from "~/utils/permission/user";

describe("checkAdminPermission", () => {
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

  it("Root 是管理员", () => resolves(check(root)));
  it("Admin 是管理员", () => resolves(check(admin)));
  it("User 不是管理员", () => rejects(check(user)));
  it("Banned 不是管理员", () => rejects(check(banned)));
  it("Guest 不是管理员", () => rejects(check(guest)));
});
