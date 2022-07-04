import {
  contestRunningACMAttendeesPrv,
  contestRunningACMAttendeesPub,
  contestRunningACMGuestsPrv,
  contestRunningACMGuestsPub,
  contestRunningACMJuriesPrv,
  contestRunningACMJuriesPub,
  contestRunningACMModsPrv,
  contestRunningACMModsPub,
  contestNotStartedACMAttendeesPrv,
  contestNotStartedACMAttendeesPub,
  contestNotStartedACMGuestsPrv,
  contestNotStartedACMGuestsPub,
  contestNotStartedACMJuriesPrv,
  contestNotStartedACMJuriesPub,
  contestNotStartedACMModsPrv,
  contestNotStartedACMModsPub,
  contestEndedACMAttendeesPrv,
  contestEndedACMAttendeesPub,
  contestEndedACMGuestsPrv,
  contestEndedACMGuestsPub,
  contestEndedACMJuriesPrv,
  contestEndedACMJuriesPub,
  contestEndedACMModsPrv,
  contestEndedACMModsPub,
  createRequest,
  rejects,
  resolves,
} from "tests/tools";
import { Request } from "@remix-run/node";
import { checkContestProblemReadPermission as check } from "~/utils/permission/contest";

describe("checkContestProblemReadPermission", () => {
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

  describe("ACM", () => {
    describe("Running", () => {
      it("Root 可以在比赛中查看担任 mod 的公开比赛的题目", () =>
        resolves(check(root, contestRunningACMModsPub)));
      it("Root 可以在比赛中查看担任 mod 的私有比赛的题目", () =>
        resolves(check(root, contestRunningACMModsPrv)));
      it("Root 可以在比赛中查看担任 jury 的公开比赛的题目", () =>
        resolves(check(root, contestRunningACMJuriesPub)));
      it("Root 可以在比赛中查看担任 jury 的私有比赛的题目", () =>
        resolves(check(root, contestRunningACMJuriesPrv)));
      it("Root 可以在比赛中查看担任 attendee 的公开比赛的题目", () =>
        resolves(check(root, contestRunningACMAttendeesPub)));
      it("Root 可以在比赛中查看担任 attendee 的私有比赛的题目", () =>
        resolves(check(root, contestRunningACMAttendeesPrv)));
      it("Root 可以在比赛中查看其他的公开比赛的题目", () =>
        resolves(check(root, contestRunningACMGuestsPub)));
      it("Root 可以在比赛中查看其他的私有比赛的题目", () =>
        resolves(check(root, contestRunningACMGuestsPrv)));

      it("Admin 可以在比赛中查看担任 mod 的公开比赛的题目", () =>
        resolves(check(admin, contestRunningACMModsPub)));
      it("Admin 可以在比赛中查看担任 mod 的私有比赛的题目", () =>
        resolves(check(admin, contestRunningACMModsPrv)));
      it("Admin 可以在比赛中查看担任 jury 的公开比赛的题目", () =>
        resolves(check(admin, contestRunningACMJuriesPub)));
      it("Admin 可以在比赛中查看担任 jury 的私有比赛的题目", () =>
        resolves(check(admin, contestRunningACMJuriesPrv)));
      it("Admin 可以在比赛中查看担任 attendee 的公开比赛的题目", () =>
        resolves(check(admin, contestRunningACMAttendeesPub)));
      it("Admin 可以在比赛中查看担任 attendee 的私有比赛的题目", () =>
        resolves(check(admin, contestRunningACMAttendeesPrv)));
      it("Admin 可以在比赛中查看其他的公开比赛的题目", () =>
        resolves(check(admin, contestRunningACMGuestsPub)));
      it("Admin 可以在比赛中查看其他的私有比赛的题目", () =>
        resolves(check(admin, contestRunningACMGuestsPrv)));

      it("User 可以在比赛中查看担任 mod 的公开比赛的题目", () =>
        resolves(check(user, contestRunningACMModsPub)));
      it("User 可以在比赛中查看担任 mod 的私有比赛的题目", () =>
        resolves(check(user, contestRunningACMModsPrv)));
      it("User 可以在比赛中查看担任 jury 的公开比赛的题目", () =>
        resolves(check(user, contestRunningACMJuriesPub)));
      it("User 可以在比赛中查看担任 jury 的私有比赛的题目", () =>
        resolves(check(user, contestRunningACMJuriesPrv)));
      it("User 可以在比赛中查看担任 attendee 的公开比赛的题目", () =>
        resolves(check(user, contestRunningACMAttendeesPub)));
      it("User 可以在比赛中查看担任 attendee 的私有比赛的题目", () =>
        resolves(check(user, contestRunningACMAttendeesPrv)));
      it("User 不可以在比赛中查看其他的公开比赛的题目", () =>
        rejects(check(user, contestRunningACMGuestsPub)));
      it("User 不可以在比赛中查看其他的私有比赛的题目", () =>
        rejects(check(user, contestRunningACMGuestsPrv)));

      it("Banned 可以在比赛中查看担任 mod 的公开比赛的题目", () =>
        resolves(check(banned, contestRunningACMModsPub)));
      it("Banned 可以在比赛中查看担任 mod 的私有比赛的题目", () =>
        resolves(check(banned, contestRunningACMModsPrv)));
      it("Banned 可以在比赛中查看担任 jury 的公开比赛的题目", () =>
        resolves(check(banned, contestRunningACMJuriesPub)));
      it("Banned 可以在比赛中查看担任 jury 的私有比赛的题目", () =>
        resolves(check(banned, contestRunningACMJuriesPrv)));
      it("Banned 可以在比赛中查看担任 attendee 的公开比赛的题目", () =>
        resolves(check(banned, contestRunningACMAttendeesPub)));
      it("Banned 可以在比赛中查看担任 attendee 的私有比赛的题目", () =>
        resolves(check(banned, contestRunningACMAttendeesPrv)));
      it("Banned 不可以在比赛中查看其他的公开比赛的题目", () =>
        rejects(check(banned, contestRunningACMGuestsPub)));
      it("Banned 不可以在比赛中查看其他的私有比赛的题目", () =>
        rejects(check(banned, contestRunningACMGuestsPrv)));

      it("Guest 不可以在比赛中查看其他的公开比赛的题目", () =>
        rejects(check(guest, contestRunningACMGuestsPub)));
      it("Guest 不可以在比赛中查看其他的私有比赛的题目", () =>
        rejects(check(guest, contestRunningACMGuestsPrv)));
    });

    describe("Not Started", () => {
      it("Root 可以在比赛开始前查看担任 mod 的公开比赛的题目", () =>
        resolves(check(root, contestNotStartedACMModsPub)));
      it("Root 可以在比赛开始前查看担任 mod 的私有比赛的题目", () =>
        resolves(check(root, contestNotStartedACMModsPrv)));
      it("Root 可以在比赛开始前查看担任 jury 的公开比赛的题目", () =>
        resolves(check(root, contestNotStartedACMJuriesPub)));
      it("Root 可以在比赛开始前查看担任 jury 的私有比赛的题目", () =>
        resolves(check(root, contestNotStartedACMJuriesPrv)));
      it("Root 可以在比赛开始前查看担任 attendee 的公开比赛的题目", () =>
        resolves(check(root, contestNotStartedACMAttendeesPub)));
      it("Root 可以在比赛开始前查看担任 attendee 的私有比赛的题目", () =>
        resolves(check(root, contestNotStartedACMAttendeesPrv)));
      it("Root 可以在比赛开始前查看其他的公开比赛的题目", () =>
        resolves(check(root, contestNotStartedACMGuestsPub)));
      it("Root 可以在比赛开始前查看其他的私有比赛的题目", () =>
        resolves(check(root, contestNotStartedACMGuestsPrv)));

      it("Admin 可以在比赛开始前查看担任 mod 的公开比赛的题目", () =>
        resolves(check(admin, contestNotStartedACMModsPub)));
      it("Admin 可以在比赛开始前查看担任 mod 的私有比赛的题目", () =>
        resolves(check(admin, contestNotStartedACMModsPrv)));
      it("Admin 可以在比赛开始前查看担任 jury 的公开比赛的题目", () =>
        resolves(check(admin, contestNotStartedACMJuriesPub)));
      it("Admin 可以在比赛开始前查看担任 jury 的私有比赛的题目", () =>
        resolves(check(admin, contestNotStartedACMJuriesPrv)));
      it("Admin 可以在比赛开始前查看担任 attendee 的公开比赛的题目", () =>
        resolves(check(admin, contestNotStartedACMAttendeesPub)));
      it("Admin 可以在比赛开始前查看担任 attendee 的私有比赛的题目", () =>
        resolves(check(admin, contestNotStartedACMAttendeesPrv)));
      it("Admin 可以在比赛开始前查看其他的公开比赛的题目", () =>
        resolves(check(admin, contestNotStartedACMGuestsPub)));
      it("Admin 可以在比赛开始前查看其他的私有比赛的题目", () =>
        resolves(check(admin, contestNotStartedACMGuestsPrv)));

      it("User 可以在比赛开始前查看担任 mod 的公开比赛的题目", () =>
        resolves(check(user, contestNotStartedACMModsPub)));
      it("User 可以在比赛开始前查看担任 mod 的私有比赛的题目", () =>
        resolves(check(user, contestNotStartedACMModsPrv)));
      it("User 可以在比赛开始前查看担任 jury 的公开比赛的题目", () =>
        resolves(check(user, contestNotStartedACMJuriesPub)));
      it("User 可以在比赛开始前查看担任 jury 的私有比赛的题目", () =>
        resolves(check(user, contestNotStartedACMJuriesPrv)));
      it("User 不可以在比赛开始前查看担任 attendee 的公开比赛的题目", () =>
        rejects(check(user, contestNotStartedACMAttendeesPub)));
      it("User 不可以在比赛开始前查看担任 attendee 的私有比赛的题目", () =>
        rejects(check(user, contestNotStartedACMAttendeesPrv)));
      it("User 不可以在比赛开始前查看其他的公开比赛的题目", () =>
        rejects(check(user, contestNotStartedACMGuestsPub)));
      it("User 不可以在比赛开始前查看其他的私有比赛的题目", () =>
        rejects(check(user, contestNotStartedACMGuestsPrv)));

      it("Banned 可以在比赛开始前查看担任 mod 的公开比赛的题目", () =>
        resolves(check(banned, contestNotStartedACMModsPub)));
      it("Banned 可以在比赛开始前查看担任 mod 的私有比赛的题目", () =>
        resolves(check(banned, contestNotStartedACMModsPrv)));
      it("Banned 可以在比赛开始前查看担任 jury 的公开比赛的题目", () =>
        resolves(check(banned, contestNotStartedACMJuriesPub)));
      it("Banned 可以在比赛开始前查看担任 jury 的私有比赛的题目", () =>
        resolves(check(banned, contestNotStartedACMJuriesPrv)));
      it("Banned 不可以在比赛开始前查看担任 attendee 的公开比赛的题目", () =>
        rejects(check(banned, contestNotStartedACMAttendeesPub)));
      it("Banned 不可以在比赛开始前查看担任 attendee 的私有比赛的题目", () =>
        rejects(check(banned, contestNotStartedACMAttendeesPrv)));
      it("Banned 不可以在比赛开始前查看其他的公开比赛的题目", () =>
        rejects(check(banned, contestNotStartedACMGuestsPub)));
      it("Banned 不可以在比赛开始前查看其他的私有比赛的题目", () =>
        rejects(check(banned, contestNotStartedACMGuestsPrv)));

      it("Guest 不可以在比赛开始前查看其他的公开比赛的题目", () =>
        rejects(check(guest, contestNotStartedACMGuestsPub)));
      it("Guest 不可以在比赛开始前查看其他的私有比赛的题目", () =>
        rejects(check(guest, contestNotStartedACMGuestsPrv)));
    });

    describe("Ended", () => {
      it("Root 可以在比赛结束后查看担任 mod 的公开比赛的题目", () =>
        resolves(check(root, contestEndedACMModsPub)));
      it("Root 可以在比赛结束后查看担任 mod 的私有比赛的题目", () =>
        resolves(check(root, contestEndedACMModsPrv)));
      it("Root 可以在比赛结束后查看担任 jury 的公开比赛的题目", () =>
        resolves(check(root, contestEndedACMJuriesPub)));
      it("Root 可以在比赛结束后查看担任 jury 的私有比赛的题目", () =>
        resolves(check(root, contestEndedACMJuriesPrv)));
      it("Root 可以在比赛结束后查看担任 attendee 的公开比赛的题目", () =>
        resolves(check(root, contestEndedACMAttendeesPub)));
      it("Root 可以在比赛结束后查看担任 attendee 的私有比赛的题目", () =>
        resolves(check(root, contestEndedACMAttendeesPrv)));
      it("Root 可以在比赛结束后查看其他的公开比赛的题目", () =>
        resolves(check(root, contestEndedACMGuestsPub)));
      it("Root 可以在比赛结束后查看其他的私有比赛的题目", () =>
        resolves(check(root, contestEndedACMGuestsPrv)));

      it("Admin 可以在比赛结束后查看担任 mod 的公开比赛的题目", () =>
        resolves(check(admin, contestEndedACMModsPub)));
      it("Admin 可以在比赛结束后查看担任 mod 的私有比赛的题目", () =>
        resolves(check(admin, contestEndedACMModsPrv)));
      it("Admin 可以在比赛结束后查看担任 jury 的公开比赛的题目", () =>
        resolves(check(admin, contestEndedACMJuriesPub)));
      it("Admin 可以在比赛结束后查看担任 jury 的私有比赛的题目", () =>
        resolves(check(admin, contestEndedACMJuriesPrv)));
      it("Admin 可以在比赛结束后查看担任 attendee 的公开比赛的题目", () =>
        resolves(check(admin, contestEndedACMAttendeesPub)));
      it("Admin 可以在比赛结束后查看担任 attendee 的私有比赛的题目", () =>
        resolves(check(admin, contestEndedACMAttendeesPrv)));
      it("Admin 可以在比赛结束后查看其他的公开比赛的题目", () =>
        resolves(check(admin, contestEndedACMGuestsPub)));
      it("Admin 可以在比赛结束后查看其他的私有比赛的题目", () =>
        resolves(check(admin, contestEndedACMGuestsPrv)));

      it("User 可以在比赛结束后查看担任 mod 的公开比赛的题目", () =>
        resolves(check(user, contestEndedACMModsPub)));
      it("User 可以在比赛结束后查看担任 mod 的私有比赛的题目", () =>
        resolves(check(user, contestEndedACMModsPrv)));
      it("User 可以在比赛结束后查看担任 jury 的公开比赛的题目", () =>
        resolves(check(user, contestEndedACMJuriesPub)));
      it("User 可以在比赛结束后查看担任 jury 的私有比赛的题目", () =>
        resolves(check(user, contestEndedACMJuriesPrv)));
      it("User 可以在比赛结束后查看担任 attendee 的公开比赛的题目", () =>
        resolves(check(user, contestEndedACMAttendeesPub)));
      it("User 可以在比赛结束后查看担任 attendee 的私有比赛的题目", () =>
        resolves(check(user, contestEndedACMAttendeesPrv)));
      it("User 可以在比赛结束后查看其他的公开比赛的题目", () =>
        resolves(check(user, contestEndedACMGuestsPub)));
      it("User 不可以在比赛结束后查看其他的私有比赛的题目", () =>
        rejects(check(user, contestEndedACMGuestsPrv)));

      it("Banned 可以在比赛结束后查看担任 mod 的公开比赛的题目", () =>
        resolves(check(banned, contestEndedACMModsPub)));
      it("Banned 可以在比赛结束后查看担任 mod 的私有比赛的题目", () =>
        resolves(check(banned, contestEndedACMModsPrv)));
      it("Banned 可以在比赛结束后查看担任 jury 的公开比赛的题目", () =>
        resolves(check(banned, contestEndedACMJuriesPub)));
      it("Banned 可以在比赛结束后查看担任 jury 的私有比赛的题目", () =>
        resolves(check(banned, contestEndedACMJuriesPrv)));
      it("Banned 可以在比赛结束后查看担任 attendee 的公开比赛的题目", () =>
        resolves(check(banned, contestEndedACMAttendeesPub)));
      it("Banned 可以在比赛结束后查看担任 attendee 的私有比赛的题目", () =>
        resolves(check(banned, contestEndedACMAttendeesPrv)));
      it("Banned 可以在比赛结束后查看其他的公开比赛的题目", () =>
        resolves(check(banned, contestEndedACMGuestsPub)));
      it("Banned 不可以在比赛结束后查看其他的私有比赛的题目", () =>
        rejects(check(banned, contestEndedACMGuestsPrv)));

      it("Guest 可以在比赛结束后查看其他的公开比赛的题目", () =>
        resolves(check(guest, contestEndedACMGuestsPub)));
      it("Guest 不可以在比赛结束后查看其他的私有比赛的题目", () =>
        rejects(check(guest, contestEndedACMGuestsPrv)));
    });
  });

  describe("IOI", () => {});
  describe("OI", () => {});
  describe("Homework", () => {});
});
