import { createRequest, rejects, resolves } from "tests/tools";
import { Request } from "@remix-run/node";
import { checkContestCreatePermission as check } from "~/utils/permission/contest";

describe("checkContestCreatePermission", () => {
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

  it("Root 可以创建比赛", () => resolves(check(root)));
  it("Admin 可以创建比赛", () => resolves(check(admin)));
  it("User 不可以创建比赛", () => rejects(check(user)));
  it("Banned 不可以创建比赛", () => rejects(check(banned)));
  it("Guest 不可以创建比赛", () => rejects(check(guest)));
});
