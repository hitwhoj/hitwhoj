import { assert } from "chai";
import { createRequest } from "tests/tools";
import { permissionContestCreate as permission } from "~/utils/permission/contest";

describe("permissionContestCreate", () => {
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

  it("Root 可以创建比赛", async () => assert(await permission.check(root)));
  it("Admin 可以创建比赛", async () => assert(await permission.check(admin)));
  it("User 不可以创建比赛", async () =>
    assert(!(await permission.check(user))));
  it("Banned 不可以创建比赛", async () =>
    assert(!(await permission.check(banned))));
  it("Guest 不可以创建比赛", async () =>
    assert(!(await permission.check(guest))));
});
