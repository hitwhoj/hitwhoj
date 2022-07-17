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
import { checkContestAttendPermission as check } from "~/utils/permission/contest";

describe("checkContestAttendPermission", () => {
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
    it("Root 不可以在比赛中报名担任 mod 的公开比赛", () =>
      rejects(check(root, contestRunningModsPub)));
    it("Root 不可以在比赛中报名担任 mod 的私有比赛", () =>
      rejects(check(root, contestRunningModsPrv)));
    it("Root 不可以在比赛中报名担任 jury 的公开比赛", () =>
      rejects(check(root, contestRunningJuriesPub)));
    it("Root 不可以在比赛中报名担任 jury 的私有比赛", () =>
      rejects(check(root, contestRunningJuriesPrv)));
    it("Root 不可以在比赛中报名担任 attendee 的公开比赛", () =>
      rejects(check(root, contestRunningAttendeesPub)));
    it("Root 不可以在比赛中报名担任 attendee 的私有比赛", () =>
      rejects(check(root, contestRunningAttendeesPrv)));
    it("Root 不可以在比赛中报名其他的公开比赛", () =>
      rejects(check(root, contestRunningGuestsPub)));
    it("Root 不可以在比赛中报名其他的私有比赛", () =>
      rejects(check(root, contestRunningGuestsPrv)));

    it("Admin 不可以在比赛中报名担任 mod 的公开比赛", () =>
      rejects(check(admin, contestRunningModsPub)));
    it("Admin 不可以在比赛中报名担任 mod 的私有比赛", () =>
      rejects(check(admin, contestRunningModsPrv)));
    it("Admin 不可以在比赛中报名担任 jury 的公开比赛", () =>
      rejects(check(admin, contestRunningJuriesPub)));
    it("Admin 不可以在比赛中报名担任 jury 的私有比赛", () =>
      rejects(check(admin, contestRunningJuriesPrv)));
    it("Admin 不可以在比赛中报名担任 attendee 的公开比赛", () =>
      rejects(check(admin, contestRunningAttendeesPub)));
    it("Admin 不可以在比赛中报名担任 attendee 的私有比赛", () =>
      rejects(check(admin, contestRunningAttendeesPrv)));
    it("Admin 不可以在比赛中报名其他的公开比赛", () =>
      rejects(check(admin, contestRunningGuestsPub)));
    it("Admin 不可以在比赛中报名其他的私有比赛", () =>
      rejects(check(admin, contestRunningGuestsPrv)));

    it("User 不可以在比赛中报名担任 mod 的公开比赛", () =>
      rejects(check(user, contestRunningModsPub)));
    it("User 不可以在比赛中报名担任 mod 的私有比赛", () =>
      rejects(check(user, contestRunningModsPrv)));
    it("User 不可以在比赛中报名担任 jury 的公开比赛", () =>
      rejects(check(user, contestRunningJuriesPub)));
    it("User 不可以在比赛中报名担任 jury 的私有比赛", () =>
      rejects(check(user, contestRunningJuriesPrv)));
    it("User 不可以在比赛中报名担任 attendee 的公开比赛", () =>
      rejects(check(user, contestRunningAttendeesPub)));
    it("User 不可以在比赛中报名担任 attendee 的私有比赛", () =>
      rejects(check(user, contestRunningAttendeesPrv)));
    it("User 不可以在比赛中报名其他的公开比赛", () =>
      rejects(check(user, contestRunningGuestsPub)));
    it("User 不可以在比赛中报名其他的私有比赛", () =>
      rejects(check(user, contestRunningGuestsPrv)));

    it("Banned 不可以在比赛中报名担任 mod 的公开比赛", () =>
      rejects(check(banned, contestRunningModsPub)));
    it("Banned 不可以在比赛中报名担任 mod 的私有比赛", () =>
      rejects(check(banned, contestRunningModsPrv)));
    it("Banned 不可以在比赛中报名担任 jury 的公开比赛", () =>
      rejects(check(banned, contestRunningJuriesPub)));
    it("Banned 不可以在比赛中报名担任 jury 的私有比赛", () =>
      rejects(check(banned, contestRunningJuriesPrv)));
    it("Banned 不可以在比赛中报名担任 attendee 的公开比赛", () =>
      rejects(check(banned, contestRunningAttendeesPub)));
    it("Banned 不可以在比赛中报名担任 attendee 的私有比赛", () =>
      rejects(check(banned, contestRunningAttendeesPrv)));
    it("Banned 不可以在比赛中报名其他的公开比赛", () =>
      rejects(check(banned, contestRunningGuestsPub)));
    it("Banned 不可以在比赛中报名其他的私有比赛", () =>
      rejects(check(banned, contestRunningGuestsPrv)));

    it("Guest 不可以在比赛中报名其他的公开比赛", () =>
      rejects(check(guest, contestRunningGuestsPub)));
    it("Guest 不可以在比赛中报名其他的私有比赛", () =>
      rejects(check(guest, contestRunningGuestsPrv)));
  });

  describe("Not Started", () => {
    it("Root 不可以在比赛开始前报名担任 mod 的公开比赛", () =>
      rejects(check(root, contestNotStartedModsPub)));
    it("Root 不可以在比赛开始前报名担任 mod 的私有比赛", () =>
      rejects(check(root, contestNotStartedModsPrv)));
    it("Root 不可以在比赛开始前报名担任 jury 的公开比赛", () =>
      rejects(check(root, contestNotStartedJuriesPub)));
    it("Root 不可以在比赛开始前报名担任 jury 的私有比赛", () =>
      rejects(check(root, contestNotStartedJuriesPrv)));
    it("Root 不可以在比赛开始前报名担任 attendee 的公开比赛", () =>
      rejects(check(root, contestNotStartedAttendeesPub)));
    it("Root 不可以在比赛开始前报名担任 attendee 的私有比赛", () =>
      rejects(check(root, contestNotStartedAttendeesPrv)));
    it("Root 可以在比赛开始前报名其他的公开比赛", () =>
      resolves(check(root, contestNotStartedGuestsPub)));
    it("Root 可以在比赛开始前报名其他的私有比赛", () =>
      resolves(check(root, contestNotStartedGuestsPrv)));

    it("Admin 不可以在比赛开始前报名担任 mod 的公开比赛", () =>
      rejects(check(admin, contestNotStartedModsPub)));
    it("Admin 不可以在比赛开始前报名担任 mod 的私有比赛", () =>
      rejects(check(admin, contestNotStartedModsPrv)));
    it("Admin 不可以在比赛开始前报名担任 jury 的公开比赛", () =>
      rejects(check(admin, contestNotStartedJuriesPub)));
    it("Admin 不可以在比赛开始前报名担任 jury 的私有比赛", () =>
      rejects(check(admin, contestNotStartedJuriesPrv)));
    it("Admin 不可以在比赛开始前报名担任 attendee 的公开比赛", () =>
      rejects(check(admin, contestNotStartedAttendeesPub)));
    it("Admin 不可以在比赛开始前报名担任 attendee 的私有比赛", () =>
      rejects(check(admin, contestNotStartedAttendeesPrv)));
    it("Admin 可以在比赛开始前报名其他的公开比赛", () =>
      resolves(check(admin, contestNotStartedGuestsPub)));
    it("Admin 可以在比赛开始前报名其他的私有比赛", () =>
      resolves(check(admin, contestNotStartedGuestsPrv)));

    it("User 不可以在比赛开始前报名担任 mod 的公开比赛", () =>
      rejects(check(user, contestNotStartedModsPub)));
    it("User 不可以在比赛开始前报名担任 mod 的私有比赛", () =>
      rejects(check(user, contestNotStartedModsPrv)));
    it("User 不可以在比赛开始前报名担任 jury 的公开比赛", () =>
      rejects(check(user, contestNotStartedJuriesPub)));
    it("User 不可以在比赛开始前报名担任 jury 的私有比赛", () =>
      rejects(check(user, contestNotStartedJuriesPrv)));
    it("User 不可以在比赛开始前报名担任 attendee 的公开比赛", () =>
      rejects(check(user, contestNotStartedAttendeesPub)));
    it("User 不可以在比赛开始前报名担任 attendee 的私有比赛", () =>
      rejects(check(user, contestNotStartedAttendeesPrv)));
    it("User 可以在比赛开始前报名其他的公开比赛", () =>
      resolves(check(user, contestNotStartedGuestsPub)));
    it("User 可以在比赛开始前报名其他的私有比赛", () =>
      resolves(check(user, contestNotStartedGuestsPrv)));

    it("Banned 不可以在比赛开始前报名担任 mod 的公开比赛", () =>
      rejects(check(banned, contestNotStartedModsPub)));
    it("Banned 不可以在比赛开始前报名担任 mod 的私有比赛", () =>
      rejects(check(banned, contestNotStartedModsPrv)));
    it("Banned 不可以在比赛开始前报名担任 jury 的公开比赛", () =>
      rejects(check(banned, contestNotStartedJuriesPub)));
    it("Banned 不可以在比赛开始前报名担任 jury 的私有比赛", () =>
      rejects(check(banned, contestNotStartedJuriesPrv)));
    it("Banned 不可以在比赛开始前报名担任 attendee 的公开比赛", () =>
      rejects(check(banned, contestNotStartedAttendeesPub)));
    it("Banned 不可以在比赛开始前报名担任 attendee 的私有比赛", () =>
      rejects(check(banned, contestNotStartedAttendeesPrv)));
    it("Banned 不可以在比赛开始前报名其他的公开比赛", () =>
      rejects(check(banned, contestNotStartedGuestsPub)));
    it("Banned 不可以在比赛开始前报名其他的私有比赛", () =>
      rejects(check(banned, contestNotStartedGuestsPrv)));

    it("Guest 不可以在比赛开始前报名其他的公开比赛", () =>
      rejects(check(guest, contestNotStartedGuestsPub)));
    it("Guest 不可以在比赛开始前报名其他的私有比赛", () =>
      rejects(check(guest, contestNotStartedGuestsPrv)));
  });

  describe("Ended", () => {
    it("Root 不可以在比赛结束后报名担任 mod 的公开比赛", () =>
      rejects(check(root, contestEndedModsPub)));
    it("Root 不可以在比赛结束后报名担任 mod 的私有比赛", () =>
      rejects(check(root, contestEndedModsPrv)));
    it("Root 不可以在比赛结束后报名担任 jury 的公开比赛", () =>
      rejects(check(root, contestEndedJuriesPub)));
    it("Root 不可以在比赛结束后报名担任 jury 的私有比赛", () =>
      rejects(check(root, contestEndedJuriesPrv)));
    it("Root 不可以在比赛结束后报名担任 attendee 的公开比赛", () =>
      rejects(check(root, contestEndedAttendeesPub)));
    it("Root 不可以在比赛结束后报名担任 attendee 的私有比赛", () =>
      rejects(check(root, contestEndedAttendeesPrv)));
    it("Root 不可以在比赛结束后报名其他的公开比赛", () =>
      rejects(check(root, contestEndedGuestsPub)));
    it("Root 不可以在比赛结束后报名其他的私有比赛", () =>
      rejects(check(root, contestEndedGuestsPrv)));

    it("Admin 不可以在比赛结束后报名担任 mod 的公开比赛", () =>
      rejects(check(admin, contestEndedModsPub)));
    it("Admin 不可以在比赛结束后报名担任 mod 的私有比赛", () =>
      rejects(check(admin, contestEndedModsPrv)));
    it("Admin 不可以在比赛结束后报名担任 jury 的公开比赛", () =>
      rejects(check(admin, contestEndedJuriesPub)));
    it("Admin 不可以在比赛结束后报名担任 jury 的私有比赛", () =>
      rejects(check(admin, contestEndedJuriesPrv)));
    it("Admin 不可以在比赛结束后报名担任 attendee 的公开比赛", () =>
      rejects(check(admin, contestEndedAttendeesPub)));
    it("Admin 不可以在比赛结束后报名担任 attendee 的私有比赛", () =>
      rejects(check(admin, contestEndedAttendeesPrv)));
    it("Admin 不可以在比赛结束后报名其他的公开比赛", () =>
      rejects(check(admin, contestEndedGuestsPub)));
    it("Admin 不可以在比赛结束后报名其他的私有比赛", () =>
      rejects(check(admin, contestEndedGuestsPrv)));

    it("User 不可以在比赛结束后报名担任 mod 的公开比赛", () =>
      rejects(check(user, contestEndedModsPub)));
    it("User 不可以在比赛结束后报名担任 mod 的私有比赛", () =>
      rejects(check(user, contestEndedModsPrv)));
    it("User 不可以在比赛结束后报名担任 jury 的公开比赛", () =>
      rejects(check(user, contestEndedJuriesPub)));
    it("User 不可以在比赛结束后报名担任 jury 的私有比赛", () =>
      rejects(check(user, contestEndedJuriesPrv)));
    it("User 不可以在比赛结束后报名担任 attendee 的公开比赛", () =>
      rejects(check(user, contestEndedAttendeesPub)));
    it("User 不可以在比赛结束后报名担任 attendee 的私有比赛", () =>
      rejects(check(user, contestEndedAttendeesPrv)));
    it("User 不可以在比赛结束后报名其他的公开比赛", () =>
      rejects(check(user, contestEndedGuestsPub)));
    it("User 不可以在比赛结束后报名其他的私有比赛", () =>
      rejects(check(user, contestEndedGuestsPrv)));

    it("Banned 不可以在比赛结束后报名担任 mod 的公开比赛", () =>
      rejects(check(banned, contestEndedModsPub)));
    it("Banned 不可以在比赛结束后报名担任 mod 的私有比赛", () =>
      rejects(check(banned, contestEndedModsPrv)));
    it("Banned 不可以在比赛结束后报名担任 jury 的公开比赛", () =>
      rejects(check(banned, contestEndedJuriesPub)));
    it("Banned 不可以在比赛结束后报名担任 jury 的私有比赛", () =>
      rejects(check(banned, contestEndedJuriesPrv)));
    it("Banned 不可以在比赛结束后报名担任 attendee 的公开比赛", () =>
      rejects(check(banned, contestEndedAttendeesPub)));
    it("Banned 不可以在比赛结束后报名担任 attendee 的私有比赛", () =>
      rejects(check(banned, contestEndedAttendeesPrv)));
    it("Banned 不可以在比赛结束后报名其他的公开比赛", () =>
      rejects(check(banned, contestEndedGuestsPub)));
    it("Banned 不可以在比赛结束后报名其他的私有比赛", () =>
      rejects(check(banned, contestEndedGuestsPrv)));

    it("Guest 不可以在比赛结束后报名其他的公开比赛", () =>
      rejects(check(guest, contestEndedGuestsPub)));
    it("Guest 不可以在比赛结束后报名其他的私有比赛", () =>
      rejects(check(guest, contestEndedGuestsPrv)));
  });
});
