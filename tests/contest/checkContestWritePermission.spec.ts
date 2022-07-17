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
  rejects,
  resolves,
} from "tests/tools";
import { Request } from "@remix-run/node";
import { checkContestWritePermission as check } from "~/utils/permission/contest";

describe("checkContestWritePermission", () => {
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
    it("Root 可以在比赛中修改担任 mod 的公开比赛", () =>
      resolves(check(root, contestRunningModsPub)));
    it("Root 可以在比赛中修改担任 mod 的私有比赛", () =>
      resolves(check(root, contestRunningModsPrv)));
    it("Root 可以在比赛中修改担任 jury 的公开比赛", () =>
      resolves(check(root, contestRunningJuriesPub)));
    it("Root 可以在比赛中修改担任 jury 的私有比赛", () =>
      resolves(check(root, contestRunningJuriesPrv)));
    it("Root 可以在比赛中修改担任 attendee 的公开比赛", () =>
      resolves(check(root, contestRunningAttendeesPub)));
    it("Root 可以在比赛中修改担任 attendee 的私有比赛", () =>
      resolves(check(root, contestRunningAttendeesPrv)));
    it("Root 可以在比赛中修改其他的公开比赛", () =>
      resolves(check(root, contestRunningGuestsPub)));
    it("Root 可以在比赛中修改其他的私有比赛", () =>
      resolves(check(root, contestRunningGuestsPrv)));

    it("Admin 可以在比赛中修改担任 mod 的公开比赛", () =>
      resolves(check(admin, contestRunningModsPub)));
    it("Admin 可以在比赛中修改担任 mod 的私有比赛", () =>
      resolves(check(admin, contestRunningModsPrv)));
    it("Admin 可以在比赛中修改担任 jury 的公开比赛", () =>
      resolves(check(admin, contestRunningJuriesPub)));
    it("Admin 可以在比赛中修改担任 jury 的私有比赛", () =>
      resolves(check(admin, contestRunningJuriesPrv)));
    it("Admin 可以在比赛中修改担任 attendee 的公开比赛", () =>
      resolves(check(admin, contestRunningAttendeesPub)));
    it("Admin 可以在比赛中修改担任 attendee 的私有比赛", () =>
      resolves(check(admin, contestRunningAttendeesPrv)));
    it("Admin 可以在比赛中修改其他的公开比赛", () =>
      resolves(check(admin, contestRunningGuestsPub)));
    it("Admin 可以在比赛中修改其他的私有比赛", () =>
      resolves(check(admin, contestRunningGuestsPrv)));

    it("User 可以在比赛中修改担任 mod 的公开比赛", () =>
      resolves(check(user, contestRunningModsPub)));
    it("User 可以在比赛中修改担任 mod 的私有比赛", () =>
      resolves(check(user, contestRunningModsPrv)));
    it("User 不可以在比赛中修改担任 jury 的公开比赛", () =>
      rejects(check(user, contestRunningJuriesPub)));
    it("User 不可以在比赛中修改担任 jury 的私有比赛", () =>
      rejects(check(user, contestRunningJuriesPrv)));
    it("User 不可以在比赛中修改担任 attendee 的公开比赛", () =>
      rejects(check(user, contestRunningAttendeesPub)));
    it("User 不可以在比赛中修改担任 attendee 的私有比赛", () =>
      rejects(check(user, contestRunningAttendeesPrv)));
    it("User 不可以在比赛中修改其他的公开比赛", () =>
      rejects(check(user, contestRunningGuestsPub)));
    it("User 不可以在比赛中修改其他的私有比赛", () =>
      rejects(check(user, contestRunningGuestsPrv)));

    it("Banned 不可以在比赛中修改担任 mod 的公开比赛", () =>
      rejects(check(banned, contestRunningModsPub)));
    it("Banned 不可以在比赛中修改担任 mod 的私有比赛", () =>
      rejects(check(banned, contestRunningModsPrv)));
    it("Banned 不可以在比赛中修改担任 jury 的公开比赛", () =>
      rejects(check(banned, contestRunningJuriesPub)));
    it("Banned 不可以在比赛中修改担任 jury 的私有比赛", () =>
      rejects(check(banned, contestRunningJuriesPrv)));
    it("Banned 不可以在比赛中修改担任 attendee 的公开比赛", () =>
      rejects(check(banned, contestRunningAttendeesPub)));
    it("Banned 不可以在比赛中修改担任 attendee 的私有比赛", () =>
      rejects(check(banned, contestRunningAttendeesPrv)));
    it("Banned 不可以在比赛中修改其他的公开比赛", () =>
      rejects(check(banned, contestRunningGuestsPub)));
    it("Banned 不可以在比赛中修改其他的私有比赛", () =>
      rejects(check(banned, contestRunningGuestsPrv)));

    it("Guest 不可以在比赛中修改其他的公开比赛", () =>
      rejects(check(guest, contestRunningGuestsPub)));
    it("Guest 不可以在比赛中修改其他的私有比赛", () =>
      rejects(check(guest, contestRunningGuestsPrv)));
  });

  describe("Not Started", () => {
    it("Root 可以在比赛开始前修改担任 mod 的公开比赛", () =>
      resolves(check(root, contestNotStartedModsPub)));
    it("Root 可以在比赛开始前修改担任 mod 的私有比赛", () =>
      resolves(check(root, contestNotStartedModsPrv)));
    it("Root 可以在比赛开始前修改担任 jury 的公开比赛", () =>
      resolves(check(root, contestNotStartedJuriesPub)));
    it("Root 可以在比赛开始前修改担任 jury 的私有比赛", () =>
      resolves(check(root, contestNotStartedJuriesPrv)));
    it("Root 可以在比赛开始前修改担任 attendee 的公开比赛", () =>
      resolves(check(root, contestNotStartedAttendeesPub)));
    it("Root 可以在比赛开始前修改担任 attendee 的私有比赛", () =>
      resolves(check(root, contestNotStartedAttendeesPrv)));
    it("Root 可以在比赛开始前修改其他的公开比赛", () =>
      resolves(check(root, contestNotStartedGuestsPub)));
    it("Root 可以在比赛开始前修改其他的私有比赛", () =>
      resolves(check(root, contestNotStartedGuestsPrv)));

    it("Admin 可以在比赛开始前修改担任 mod 的公开比赛", () =>
      resolves(check(admin, contestNotStartedModsPub)));
    it("Admin 可以在比赛开始前修改担任 mod 的私有比赛", () =>
      resolves(check(admin, contestNotStartedModsPrv)));
    it("Admin 可以在比赛开始前修改担任 jury 的公开比赛", () =>
      resolves(check(admin, contestNotStartedJuriesPub)));
    it("Admin 可以在比赛开始前修改担任 jury 的私有比赛", () =>
      resolves(check(admin, contestNotStartedJuriesPrv)));
    it("Admin 可以在比赛开始前修改担任 attendee 的公开比赛", () =>
      resolves(check(admin, contestNotStartedAttendeesPub)));
    it("Admin 可以在比赛开始前修改担任 attendee 的私有比赛", () =>
      resolves(check(admin, contestNotStartedAttendeesPrv)));
    it("Admin 可以在比赛开始前修改其他的公开比赛", () =>
      resolves(check(admin, contestNotStartedGuestsPub)));
    it("Admin 可以在比赛开始前修改其他的私有比赛", () =>
      resolves(check(admin, contestNotStartedGuestsPrv)));

    it("User 可以在比赛开始前修改担任 mod 的公开比赛", () =>
      resolves(check(user, contestNotStartedModsPub)));
    it("User 可以在比赛开始前修改担任 mod 的私有比赛", () =>
      resolves(check(user, contestNotStartedModsPrv)));
    it("User 不可以在比赛开始前修改担任 jury 的公开比赛", () =>
      rejects(check(user, contestNotStartedJuriesPub)));
    it("User 不可以在比赛开始前修改担任 jury 的私有比赛", () =>
      rejects(check(user, contestNotStartedJuriesPrv)));
    it("User 不可以在比赛开始前修改担任 attendee 的公开比赛", () =>
      rejects(check(user, contestNotStartedAttendeesPub)));
    it("User 不可以在比赛开始前修改担任 attendee 的私有比赛", () =>
      rejects(check(user, contestNotStartedAttendeesPrv)));
    it("User 不可以在比赛开始前修改其他的公开比赛", () =>
      rejects(check(user, contestNotStartedGuestsPub)));
    it("User 不可以在比赛开始前修改其他的私有比赛", () =>
      rejects(check(user, contestNotStartedGuestsPrv)));

    it("Banned 不可以在比赛开始前修改担任 mod 的公开比赛", () =>
      rejects(check(banned, contestNotStartedModsPub)));
    it("Banned 不可以在比赛开始前修改担任 mod 的私有比赛", () =>
      rejects(check(banned, contestNotStartedModsPrv)));
    it("Banned 不可以在比赛开始前修改担任 jury 的公开比赛", () =>
      rejects(check(banned, contestNotStartedJuriesPub)));
    it("Banned 不可以在比赛开始前修改担任 jury 的私有比赛", () =>
      rejects(check(banned, contestNotStartedJuriesPrv)));
    it("Banned 不可以在比赛开始前修改担任 attendee 的公开比赛", () =>
      rejects(check(banned, contestNotStartedAttendeesPub)));
    it("Banned 不可以在比赛开始前修改担任 attendee 的私有比赛", () =>
      rejects(check(banned, contestNotStartedAttendeesPrv)));
    it("Banned 不可以在比赛开始前修改其他的公开比赛", () =>
      rejects(check(banned, contestNotStartedGuestsPub)));
    it("Banned 不可以在比赛开始前修改其他的私有比赛", () =>
      rejects(check(banned, contestNotStartedGuestsPrv)));

    it("Guest 不可以在比赛开始前修改其他的公开比赛", () =>
      rejects(check(guest, contestNotStartedGuestsPub)));
    it("Guest 不可以在比赛开始前修改其他的私有比赛", () =>
      rejects(check(guest, contestNotStartedGuestsPrv)));
  });

  describe("Ended", () => {
    it("Root 可以在比赛结束后修改担任 mod 的公开比赛", () =>
      resolves(check(root, contestEndedModsPub)));
    it("Root 可以在比赛结束后修改担任 mod 的私有比赛", () =>
      resolves(check(root, contestEndedModsPrv)));
    it("Root 可以在比赛结束后修改担任 jury 的公开比赛", () =>
      resolves(check(root, contestEndedJuriesPub)));
    it("Root 可以在比赛结束后修改担任 jury 的私有比赛", () =>
      resolves(check(root, contestEndedJuriesPrv)));
    it("Root 可以在比赛结束后修改担任 attendee 的公开比赛", () =>
      resolves(check(root, contestEndedAttendeesPub)));
    it("Root 可以在比赛结束后修改担任 attendee 的私有比赛", () =>
      resolves(check(root, contestEndedAttendeesPrv)));
    it("Root 可以在比赛结束后修改其他的公开比赛", () =>
      resolves(check(root, contestEndedGuestsPub)));
    it("Root 可以在比赛结束后修改其他的私有比赛", () =>
      resolves(check(root, contestEndedGuestsPrv)));

    it("Admin 可以在比赛结束后修改担任 mod 的公开比赛", () =>
      resolves(check(admin, contestEndedModsPub)));
    it("Admin 可以在比赛结束后修改担任 mod 的私有比赛", () =>
      resolves(check(admin, contestEndedModsPrv)));
    it("Admin 可以在比赛结束后修改担任 jury 的公开比赛", () =>
      resolves(check(admin, contestEndedJuriesPub)));
    it("Admin 可以在比赛结束后修改担任 jury 的私有比赛", () =>
      resolves(check(admin, contestEndedJuriesPrv)));
    it("Admin 可以在比赛结束后修改担任 attendee 的公开比赛", () =>
      resolves(check(admin, contestEndedAttendeesPub)));
    it("Admin 可以在比赛结束后修改担任 attendee 的私有比赛", () =>
      resolves(check(admin, contestEndedAttendeesPrv)));
    it("Admin 可以在比赛结束后修改其他的公开比赛", () =>
      resolves(check(admin, contestEndedGuestsPub)));
    it("Admin 可以在比赛结束后修改其他的私有比赛", () =>
      resolves(check(admin, contestEndedGuestsPrv)));

    it("User 可以在比赛结束后修改担任 mod 的公开比赛", () =>
      resolves(check(user, contestEndedModsPub)));
    it("User 可以在比赛结束后修改担任 mod 的私有比赛", () =>
      resolves(check(user, contestEndedModsPrv)));
    it("User 不可以在比赛结束后修改担任 jury 的公开比赛", () =>
      rejects(check(user, contestEndedJuriesPub)));
    it("User 不可以在比赛结束后修改担任 jury 的私有比赛", () =>
      rejects(check(user, contestEndedJuriesPrv)));
    it("User 不可以在比赛结束后修改担任 attendee 的公开比赛", () =>
      rejects(check(user, contestEndedAttendeesPub)));
    it("User 不可以在比赛结束后修改担任 attendee 的私有比赛", () =>
      rejects(check(user, contestEndedAttendeesPrv)));
    it("User 不可以在比赛结束后修改其他的公开比赛", () =>
      rejects(check(user, contestEndedGuestsPub)));
    it("User 不可以在比赛结束后修改其他的私有比赛", () =>
      rejects(check(user, contestEndedGuestsPrv)));

    it("Banned 不可以在比赛结束后修改担任 mod 的公开比赛", () =>
      rejects(check(banned, contestEndedModsPub)));
    it("Banned 不可以在比赛结束后修改担任 mod 的私有比赛", () =>
      rejects(check(banned, contestEndedModsPrv)));
    it("Banned 不可以在比赛结束后修改担任 jury 的公开比赛", () =>
      rejects(check(banned, contestEndedJuriesPub)));
    it("Banned 不可以在比赛结束后修改担任 jury 的私有比赛", () =>
      rejects(check(banned, contestEndedJuriesPrv)));
    it("Banned 不可以在比赛结束后修改担任 attendee 的公开比赛", () =>
      rejects(check(banned, contestEndedAttendeesPub)));
    it("Banned 不可以在比赛结束后修改担任 attendee 的私有比赛", () =>
      rejects(check(banned, contestEndedAttendeesPrv)));
    it("Banned 不可以在比赛结束后修改其他的公开比赛", () =>
      rejects(check(banned, contestEndedGuestsPub)));
    it("Banned 不可以在比赛结束后修改其他的私有比赛", () =>
      rejects(check(banned, contestEndedGuestsPrv)));

    it("Guest 不可以在比赛结束后修改其他的公开比赛", () =>
      rejects(check(guest, contestEndedGuestsPub)));
    it("Guest 不可以在比赛结束后修改其他的私有比赛", () =>
      rejects(check(guest, contestEndedGuestsPrv)));
  });
});
