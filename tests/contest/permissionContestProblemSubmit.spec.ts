import { assert } from "chai";
import {
  contestRunningAttendeesPrv,
  contestRunningAttendeesPub,
  contestRunningGuestsPrv,
  contestRunningGuestsPub,
  contestRunningJuriesPrv,
  contestRunningJuriesPub,
  contestRunningModsPrv,
  contestRunningModsPub,
  contestNotStartedAttendeesPrv,
  contestNotStartedAttendeesPub,
  contestNotStartedGuestsPrv,
  contestNotStartedGuestsPub,
  contestNotStartedJuriesPrv,
  contestNotStartedJuriesPub,
  contestNotStartedModsPrv,
  contestNotStartedModsPub,
  contestEndedAttendeesPrv,
  contestEndedAttendeesPub,
  contestEndedGuestsPrv,
  contestEndedGuestsPub,
  contestEndedJuriesPrv,
  contestEndedJuriesPub,
  contestEndedModsPrv,
  contestEndedModsPub,
  createRequest,
} from "tests/tools";
import { permissionContestProblemSubmit as permission } from "~/utils/permission/contest";

describe("permissionContestProblemSubmit", () => {
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

  describe("Running", () => {
    it("Root 不可以在比赛中提交担任 mod 的公开比赛的题目", async () =>
      assert(!(await permission.check(root, contestRunningModsPub))));
    it("Root 不可以在比赛中提交担任 mod 的私有比赛的题目", async () =>
      assert(!(await permission.check(root, contestRunningModsPrv))));
    it("Root 不可以在比赛中提交担任 jury 的公开比赛的题目", async () =>
      assert(!(await permission.check(root, contestRunningJuriesPub))));
    it("Root 不可以在比赛中提交担任 jury 的私有比赛的题目", async () =>
      assert(!(await permission.check(root, contestRunningJuriesPrv))));
    it("Root 可以在比赛中提交担任 attendee 的公开比赛的题目", async () =>
      assert(await permission.check(root, contestRunningAttendeesPub)));
    it("Root 可以在比赛中提交担任 attendee 的私有比赛的题目", async () =>
      assert(await permission.check(root, contestRunningAttendeesPrv)));
    it("Root 不可以在比赛中提交其他的公开比赛的题目", async () =>
      assert(!(await permission.check(root, contestRunningGuestsPub))));
    it("Root 不可以在比赛中提交其他的私有比赛的题目", async () =>
      assert(!(await permission.check(root, contestRunningGuestsPrv))));

    it("Admin 不可以在比赛中提交担任 mod 的公开比赛的题目", async () =>
      assert(!(await permission.check(admin, contestRunningModsPub))));
    it("Admin 不可以在比赛中提交担任 mod 的私有比赛的题目", async () =>
      assert(!(await permission.check(admin, contestRunningModsPrv))));
    it("Admin 不可以在比赛中提交担任 jury 的公开比赛的题目", async () =>
      assert(!(await permission.check(admin, contestRunningJuriesPub))));
    it("Admin 不可以在比赛中提交担任 jury 的私有比赛的题目", async () =>
      assert(!(await permission.check(admin, contestRunningJuriesPrv))));
    it("Admin 可以在比赛中提交担任 attendee 的公开比赛的题目", async () =>
      assert(await permission.check(admin, contestRunningAttendeesPub)));
    it("Admin 可以在比赛中提交担任 attendee 的私有比赛的题目", async () =>
      assert(await permission.check(admin, contestRunningAttendeesPrv)));
    it("Admin 不可以在比赛中提交其他的公开比赛的题目", async () =>
      assert(!(await permission.check(admin, contestRunningGuestsPub))));
    it("Admin 不可以在比赛中提交其他的私有比赛的题目", async () =>
      assert(!(await permission.check(admin, contestRunningGuestsPrv))));

    it("User 不可以在比赛中提交担任 mod 的公开比赛的题目", async () =>
      assert(!(await permission.check(user, contestRunningModsPub))));
    it("User 不可以在比赛中提交担任 mod 的私有比赛的题目", async () =>
      assert(!(await permission.check(user, contestRunningModsPrv))));
    it("User 不可以在比赛中提交担任 jury 的公开比赛的题目", async () =>
      assert(!(await permission.check(user, contestRunningJuriesPub))));
    it("User 不可以在比赛中提交担任 jury 的私有比赛的题目", async () =>
      assert(!(await permission.check(user, contestRunningJuriesPrv))));
    it("User 可以在比赛中提交担任 attendee 的公开比赛的题目", async () =>
      assert(await permission.check(user, contestRunningAttendeesPub)));
    it("User 可以在比赛中提交担任 attendee 的私有比赛的题目", async () =>
      assert(await permission.check(user, contestRunningAttendeesPrv)));
    it("User 不可以在比赛中提交其他的公开比赛的题目", async () =>
      assert(!(await permission.check(user, contestRunningGuestsPub))));
    it("User 不可以在比赛中提交其他的私有比赛的题目", async () =>
      assert(!(await permission.check(user, contestRunningGuestsPrv))));

    it("Banned 不可以在比赛中提交担任 mod 的公开比赛的题目", async () =>
      assert(!(await permission.check(banned, contestRunningModsPub))));
    it("Banned 不可以在比赛中提交担任 mod 的私有比赛的题目", async () =>
      assert(!(await permission.check(banned, contestRunningModsPrv))));
    it("Banned 不可以在比赛中提交担任 jury 的公开比赛的题目", async () =>
      assert(!(await permission.check(banned, contestRunningJuriesPub))));
    it("Banned 不可以在比赛中提交担任 jury 的私有比赛的题目", async () =>
      assert(!(await permission.check(banned, contestRunningJuriesPrv))));
    it("Banned 不可以在比赛中提交担任 attendee 的公开比赛的题目", async () =>
      assert(!(await permission.check(banned, contestRunningAttendeesPub))));
    it("Banned 不可以在比赛中提交担任 attendee 的私有比赛的题目", async () =>
      assert(!(await permission.check(banned, contestRunningAttendeesPrv))));
    it("Banned 不可以在比赛中提交其他的公开比赛的题目", async () =>
      assert(!(await permission.check(banned, contestRunningGuestsPub))));
    it("Banned 不可以在比赛中提交其他的私有比赛的题目", async () =>
      assert(!(await permission.check(banned, contestRunningGuestsPrv))));

    it("Guest 不可以在比赛中提交其他的公开比赛的题目", async () =>
      assert(!(await permission.check(guest, contestRunningGuestsPub))));
    it("Guest 不可以在比赛中提交其他的私有比赛的题目", async () =>
      assert(!(await permission.check(guest, contestRunningGuestsPrv))));
  });

  describe("Not Started", () => {
    it("Root 不可以在比赛开始前提交担任 mod 的公开比赛的题目", async () =>
      assert(!(await permission.check(root, contestNotStartedModsPub))));
    it("Root 不可以在比赛开始前提交担任 mod 的私有比赛的题目", async () =>
      assert(!(await permission.check(root, contestNotStartedModsPrv))));
    it("Root 不可以在比赛开始前提交担任 jury 的公开比赛的题目", async () =>
      assert(!(await permission.check(root, contestNotStartedJuriesPub))));
    it("Root 不可以在比赛开始前提交担任 jury 的私有比赛的题目", async () =>
      assert(!(await permission.check(root, contestNotStartedJuriesPrv))));
    it("Root 不可以在比赛开始前提交担任 attendee 的公开比赛的题目", async () =>
      assert(!(await permission.check(root, contestNotStartedAttendeesPub))));
    it("Root 不可以在比赛开始前提交担任 attendee 的私有比赛的题目", async () =>
      assert(!(await permission.check(root, contestNotStartedAttendeesPrv))));
    it("Root 不可以在比赛开始前提交其他的公开比赛的题目", async () =>
      assert(!(await permission.check(root, contestNotStartedGuestsPub))));
    it("Root 不可以在比赛开始前提交其他的私有比赛的题目", async () =>
      assert(!(await permission.check(root, contestNotStartedGuestsPrv))));

    it("Admin 不可以在比赛开始前提交担任 mod 的公开比赛的题目", async () =>
      assert(!(await permission.check(admin, contestNotStartedModsPub))));
    it("Admin 不可以在比赛开始前提交担任 mod 的私有比赛的题目", async () =>
      assert(!(await permission.check(admin, contestNotStartedModsPrv))));
    it("Admin 不可以在比赛开始前提交担任 jury 的公开比赛的题目", async () =>
      assert(!(await permission.check(admin, contestNotStartedJuriesPub))));
    it("Admin 不可以在比赛开始前提交担任 jury 的私有比赛的题目", async () =>
      assert(!(await permission.check(admin, contestNotStartedJuriesPrv))));
    it("Admin 不可以在比赛开始前提交担任 attendee 的公开比赛的题目", async () =>
      assert(!(await permission.check(admin, contestNotStartedAttendeesPub))));
    it("Admin 不可以在比赛开始前提交担任 attendee 的私有比赛的题目", async () =>
      assert(!(await permission.check(admin, contestNotStartedAttendeesPrv))));
    it("Admin 不可以在比赛开始前提交其他的公开比赛的题目", async () =>
      assert(!(await permission.check(admin, contestNotStartedGuestsPub))));
    it("Admin 不可以在比赛开始前提交其他的私有比赛的题目", async () =>
      assert(!(await permission.check(admin, contestNotStartedGuestsPrv))));

    it("User 不可以在比赛开始前提交担任 mod 的公开比赛的题目", async () =>
      assert(!(await permission.check(user, contestNotStartedModsPub))));
    it("User 不可以在比赛开始前提交担任 mod 的私有比赛的题目", async () =>
      assert(!(await permission.check(user, contestNotStartedModsPrv))));
    it("User 不可以在比赛开始前提交担任 jury 的公开比赛的题目", async () =>
      assert(!(await permission.check(user, contestNotStartedJuriesPub))));
    it("User 不可以在比赛开始前提交担任 jury 的私有比赛的题目", async () =>
      assert(!(await permission.check(user, contestNotStartedJuriesPrv))));
    it("User 不可以在比赛开始前提交担任 attendee 的公开比赛的题目", async () =>
      assert(!(await permission.check(user, contestNotStartedAttendeesPub))));
    it("User 不可以在比赛开始前提交担任 attendee 的私有比赛的题目", async () =>
      assert(!(await permission.check(user, contestNotStartedAttendeesPrv))));
    it("User 不可以在比赛开始前提交其他的公开比赛的题目", async () =>
      assert(!(await permission.check(user, contestNotStartedGuestsPub))));
    it("User 不可以在比赛开始前提交其他的私有比赛的题目", async () =>
      assert(!(await permission.check(user, contestNotStartedGuestsPrv))));

    it("Banned 不可以在比赛开始前提交担任 mod 的公开比赛的题目", async () =>
      assert(!(await permission.check(banned, contestNotStartedModsPub))));
    it("Banned 不可以在比赛开始前提交担任 mod 的私有比赛的题目", async () =>
      assert(!(await permission.check(banned, contestNotStartedModsPrv))));
    it("Banned 不可以在比赛开始前提交担任 jury 的公开比赛的题目", async () =>
      assert(!(await permission.check(banned, contestNotStartedJuriesPub))));
    it("Banned 不可以在比赛开始前提交担任 jury 的私有比赛的题目", async () =>
      assert(!(await permission.check(banned, contestNotStartedJuriesPrv))));
    it("Banned 不可以在比赛开始前提交担任 attendee 的公开比赛的题目", async () =>
      assert(!(await permission.check(banned, contestNotStartedAttendeesPub))));
    it("Banned 不可以在比赛开始前提交担任 attendee 的私有比赛的题目", async () =>
      assert(!(await permission.check(banned, contestNotStartedAttendeesPrv))));
    it("Banned 不可以在比赛开始前提交其他的公开比赛的题目", async () =>
      assert(!(await permission.check(banned, contestNotStartedGuestsPub))));
    it("Banned 不可以在比赛开始前提交其他的私有比赛的题目", async () =>
      assert(!(await permission.check(banned, contestNotStartedGuestsPrv))));

    it("Guest 不可以在比赛开始前提交其他的公开比赛的题目", async () =>
      assert(!(await permission.check(guest, contestNotStartedGuestsPub))));
    it("Guest 不可以在比赛开始前提交其他的私有比赛的题目", async () =>
      assert(!(await permission.check(guest, contestNotStartedGuestsPrv))));
  });

  describe("Ended", () => {
    it("Root 不可以在比赛结束后提交担任 mod 的公开比赛的题目", async () =>
      assert(!(await permission.check(root, contestEndedModsPub))));
    it("Root 不可以在比赛结束后提交担任 mod 的私有比赛的题目", async () =>
      assert(!(await permission.check(root, contestEndedModsPrv))));
    it("Root 不可以在比赛结束后提交担任 jury 的公开比赛的题目", async () =>
      assert(!(await permission.check(root, contestEndedJuriesPub))));
    it("Root 不可以在比赛结束后提交担任 jury 的私有比赛的题目", async () =>
      assert(!(await permission.check(root, contestEndedJuriesPrv))));
    it("Root 不可以在比赛结束后提交担任 attendee 的公开比赛的题目", async () =>
      assert(!(await permission.check(root, contestEndedAttendeesPub))));
    it("Root 不可以在比赛结束后提交担任 attendee 的私有比赛的题目", async () =>
      assert(!(await permission.check(root, contestEndedAttendeesPrv))));
    it("Root 不可以在比赛结束后提交其他的公开比赛的题目", async () =>
      assert(!(await permission.check(root, contestEndedGuestsPub))));
    it("Root 不可以在比赛结束后提交其他的私有比赛的题目", async () =>
      assert(!(await permission.check(root, contestEndedGuestsPrv))));

    it("Admin 不可以在比赛结束后提交担任 mod 的公开比赛的题目", async () =>
      assert(!(await permission.check(admin, contestEndedModsPub))));
    it("Admin 不可以在比赛结束后提交担任 mod 的私有比赛的题目", async () =>
      assert(!(await permission.check(admin, contestEndedModsPrv))));
    it("Admin 不可以在比赛结束后提交担任 jury 的公开比赛的题目", async () =>
      assert(!(await permission.check(admin, contestEndedJuriesPub))));
    it("Admin 不可以在比赛结束后提交担任 jury 的私有比赛的题目", async () =>
      assert(!(await permission.check(admin, contestEndedJuriesPrv))));
    it("Admin 不可以在比赛结束后提交担任 attendee 的公开比赛的题目", async () =>
      assert(!(await permission.check(admin, contestEndedAttendeesPub))));
    it("Admin 不可以在比赛结束后提交担任 attendee 的私有比赛的题目", async () =>
      assert(!(await permission.check(admin, contestEndedAttendeesPrv))));
    it("Admin 不可以在比赛结束后提交其他的公开比赛的题目", async () =>
      assert(!(await permission.check(admin, contestEndedGuestsPub))));
    it("Admin 不可以在比赛结束后提交其他的私有比赛的题目", async () =>
      assert(!(await permission.check(admin, contestEndedGuestsPrv))));

    it("User 不可以在比赛结束后提交担任 mod 的公开比赛的题目", async () =>
      assert(!(await permission.check(user, contestEndedModsPub))));
    it("User 不可以在比赛结束后提交担任 mod 的私有比赛的题目", async () =>
      assert(!(await permission.check(user, contestEndedModsPrv))));
    it("User 不可以在比赛结束后提交担任 jury 的公开比赛的题目", async () =>
      assert(!(await permission.check(user, contestEndedJuriesPub))));
    it("User 不可以在比赛结束后提交担任 jury 的私有比赛的题目", async () =>
      assert(!(await permission.check(user, contestEndedJuriesPrv))));
    it("User 不可以在比赛结束后提交担任 attendee 的公开比赛的题目", async () =>
      assert(!(await permission.check(user, contestEndedAttendeesPub))));
    it("User 不可以在比赛结束后提交担任 attendee 的私有比赛的题目", async () =>
      assert(!(await permission.check(user, contestEndedAttendeesPrv))));
    it("User 不可以在比赛结束后提交其他的公开比赛的题目", async () =>
      assert(!(await permission.check(user, contestEndedGuestsPub))));
    it("User 不可以在比赛结束后提交其他的私有比赛的题目", async () =>
      assert(!(await permission.check(user, contestEndedGuestsPrv))));

    it("Banned 不可以在比赛结束后提交担任 mod 的公开比赛的题目", async () =>
      assert(!(await permission.check(banned, contestEndedModsPub))));
    it("Banned 不可以在比赛结束后提交担任 mod 的私有比赛的题目", async () =>
      assert(!(await permission.check(banned, contestEndedModsPrv))));
    it("Banned 不可以在比赛结束后提交担任 jury 的公开比赛的题目", async () =>
      assert(!(await permission.check(banned, contestEndedJuriesPub))));
    it("Banned 不可以在比赛结束后提交担任 jury 的私有比赛的题目", async () =>
      assert(!(await permission.check(banned, contestEndedJuriesPrv))));
    it("Banned 不可以在比赛结束后提交担任 attendee 的公开比赛的题目", async () =>
      assert(!(await permission.check(banned, contestEndedAttendeesPub))));
    it("Banned 不可以在比赛结束后提交担任 attendee 的私有比赛的题目", async () =>
      assert(!(await permission.check(banned, contestEndedAttendeesPrv))));
    it("Banned 不可以在比赛结束后提交其他的公开比赛的题目", async () =>
      assert(!(await permission.check(banned, contestEndedGuestsPub))));
    it("Banned 不可以在比赛结束后提交其他的私有比赛的题目", async () =>
      assert(!(await permission.check(banned, contestEndedGuestsPrv))));

    it("Guest 不可以在比赛结束后提交其他的公开比赛的题目", async () =>
      assert(!(await permission.check(guest, contestEndedGuestsPub))));
    it("Guest 不可以在比赛结束后提交其他的私有比赛的题目", async () =>
      assert(!(await permission.check(guest, contestEndedGuestsPrv))));
  });
});
