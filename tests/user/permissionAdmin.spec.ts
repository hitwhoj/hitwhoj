import { createRequest } from "tests/tools";
import { Request } from "@remix-run/node";
import { permissionAdmin as permission } from "~/utils/permission/user";
import { assert } from "chai";

describe("permissionAdmin", () => {
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

  it("Root 是管理员", async () => assert(await permission.check(root)));
  it("Admin 是管理员", async () => assert(await permission.check(admin)));
  it("User 不是管理员", async () => assert(!(await permission.check(user))));
  it("Banned 不是管理员", async () =>
    assert(!(await permission.check(banned))));
  it("Guest 不是管理员", async () => assert(!(await permission.check(guest))));
});
