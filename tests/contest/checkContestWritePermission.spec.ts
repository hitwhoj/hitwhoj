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

  describe("ACM", () => {
    describe("Running", () => {
      it("Root 可以在比赛中修改担任 mod 的公开比赛", () =>
        resolves(check(root, contestRunningACMModsPub)));
      it("Root 可以在比赛中修改担任 mod 的私有比赛", () =>
        resolves(check(root, contestRunningACMModsPrv)));
      it("Root 可以在比赛中修改担任 jury 的公开比赛", () =>
        resolves(check(root, contestRunningACMJuriesPub)));
      it("Root 可以在比赛中修改担任 jury 的私有比赛", () =>
        resolves(check(root, contestRunningACMJuriesPrv)));
      it("Root 可以在比赛中修改担任 attendee 的公开比赛", () =>
        resolves(check(root, contestRunningACMAttendeesPub)));
      it("Root 可以在比赛中修改担任 attendee 的私有比赛", () =>
        resolves(check(root, contestRunningACMAttendeesPrv)));
      it("Root 可以在比赛中修改其他的公开比赛", () =>
        resolves(check(root, contestRunningACMGuestsPub)));
      it("Root 可以在比赛中修改其他的私有比赛", () =>
        resolves(check(root, contestRunningACMGuestsPrv)));

      it("Admin 可以在比赛中修改担任 mod 的公开比赛", () =>
        resolves(check(admin, contestRunningACMModsPub)));
      it("Admin 可以在比赛中修改担任 mod 的私有比赛", () =>
        resolves(check(admin, contestRunningACMModsPrv)));
      it("Admin 可以在比赛中修改担任 jury 的公开比赛", () =>
        resolves(check(admin, contestRunningACMJuriesPub)));
      it("Admin 可以在比赛中修改担任 jury 的私有比赛", () =>
        resolves(check(admin, contestRunningACMJuriesPrv)));
      it("Admin 可以在比赛中修改担任 attendee 的公开比赛", () =>
        resolves(check(admin, contestRunningACMAttendeesPub)));
      it("Admin 可以在比赛中修改担任 attendee 的私有比赛", () =>
        resolves(check(admin, contestRunningACMAttendeesPrv)));
      it("Admin 可以在比赛中修改其他的公开比赛", () =>
        resolves(check(admin, contestRunningACMGuestsPub)));
      it("Admin 可以在比赛中修改其他的私有比赛", () =>
        resolves(check(admin, contestRunningACMGuestsPrv)));

      it("User 可以在比赛中修改担任 mod 的公开比赛", () =>
        resolves(check(user, contestRunningACMModsPub)));
      it("User 可以在比赛中修改担任 mod 的私有比赛", () =>
        resolves(check(user, contestRunningACMModsPrv)));
      it("User 不可以在比赛中修改担任 jury 的公开比赛", () =>
        rejects(check(user, contestRunningACMJuriesPub)));
      it("User 不可以在比赛中修改担任 jury 的私有比赛", () =>
        rejects(check(user, contestRunningACMJuriesPrv)));
      it("User 不可以在比赛中修改担任 attendee 的公开比赛", () =>
        rejects(check(user, contestRunningACMAttendeesPub)));
      it("User 不可以在比赛中修改担任 attendee 的私有比赛", () =>
        rejects(check(user, contestRunningACMAttendeesPrv)));
      it("User 不可以在比赛中修改其他的公开比赛", () =>
        rejects(check(user, contestRunningACMGuestsPub)));
      it("User 不可以在比赛中修改其他的私有比赛", () =>
        rejects(check(user, contestRunningACMGuestsPrv)));

      it("Banned 不可以在比赛中修改担任 mod 的公开比赛", () =>
        rejects(check(banned, contestRunningACMModsPub)));
      it("Banned 不可以在比赛中修改担任 mod 的私有比赛", () =>
        rejects(check(banned, contestRunningACMModsPrv)));
      it("Banned 不可以在比赛中修改担任 jury 的公开比赛", () =>
        rejects(check(banned, contestRunningACMJuriesPub)));
      it("Banned 不可以在比赛中修改担任 jury 的私有比赛", () =>
        rejects(check(banned, contestRunningACMJuriesPrv)));
      it("Banned 不可以在比赛中修改担任 attendee 的公开比赛", () =>
        rejects(check(banned, contestRunningACMAttendeesPub)));
      it("Banned 不可以在比赛中修改担任 attendee 的私有比赛", () =>
        rejects(check(banned, contestRunningACMAttendeesPrv)));
      it("Banned 不可以在比赛中修改其他的公开比赛", () =>
        rejects(check(banned, contestRunningACMGuestsPub)));
      it("Banned 不可以在比赛中修改其他的私有比赛", () =>
        rejects(check(banned, contestRunningACMGuestsPrv)));

      it("Guest 不可以在比赛中修改其他的公开比赛", () =>
        rejects(check(guest, contestRunningACMGuestsPub)));
      it("Guest 不可以在比赛中修改其他的私有比赛", () =>
        rejects(check(guest, contestRunningACMGuestsPrv)));
    });

    describe("Not Started", () => {
      it("Root 可以在比赛开始前修改担任 mod 的公开比赛", () =>
        resolves(check(root, contestNotStartedACMModsPub)));
      it("Root 可以在比赛开始前修改担任 mod 的私有比赛", () =>
        resolves(check(root, contestNotStartedACMModsPrv)));
      it("Root 可以在比赛开始前修改担任 jury 的公开比赛", () =>
        resolves(check(root, contestNotStartedACMJuriesPub)));
      it("Root 可以在比赛开始前修改担任 jury 的私有比赛", () =>
        resolves(check(root, contestNotStartedACMJuriesPrv)));
      it("Root 可以在比赛开始前修改担任 attendee 的公开比赛", () =>
        resolves(check(root, contestNotStartedACMAttendeesPub)));
      it("Root 可以在比赛开始前修改担任 attendee 的私有比赛", () =>
        resolves(check(root, contestNotStartedACMAttendeesPrv)));
      it("Root 可以在比赛开始前修改其他的公开比赛", () =>
        resolves(check(root, contestNotStartedACMGuestsPub)));
      it("Root 可以在比赛开始前修改其他的私有比赛", () =>
        resolves(check(root, contestNotStartedACMGuestsPrv)));

      it("Admin 可以在比赛开始前修改担任 mod 的公开比赛", () =>
        resolves(check(admin, contestNotStartedACMModsPub)));
      it("Admin 可以在比赛开始前修改担任 mod 的私有比赛", () =>
        resolves(check(admin, contestNotStartedACMModsPrv)));
      it("Admin 可以在比赛开始前修改担任 jury 的公开比赛", () =>
        resolves(check(admin, contestNotStartedACMJuriesPub)));
      it("Admin 可以在比赛开始前修改担任 jury 的私有比赛", () =>
        resolves(check(admin, contestNotStartedACMJuriesPrv)));
      it("Admin 可以在比赛开始前修改担任 attendee 的公开比赛", () =>
        resolves(check(admin, contestNotStartedACMAttendeesPub)));
      it("Admin 可以在比赛开始前修改担任 attendee 的私有比赛", () =>
        resolves(check(admin, contestNotStartedACMAttendeesPrv)));
      it("Admin 可以在比赛开始前修改其他的公开比赛", () =>
        resolves(check(admin, contestNotStartedACMGuestsPub)));
      it("Admin 可以在比赛开始前修改其他的私有比赛", () =>
        resolves(check(admin, contestNotStartedACMGuestsPrv)));

      it("User 可以在比赛开始前修改担任 mod 的公开比赛", () =>
        resolves(check(user, contestNotStartedACMModsPub)));
      it("User 可以在比赛开始前修改担任 mod 的私有比赛", () =>
        resolves(check(user, contestNotStartedACMModsPrv)));
      it("User 不可以在比赛开始前修改担任 jury 的公开比赛", () =>
        rejects(check(user, contestNotStartedACMJuriesPub)));
      it("User 不可以在比赛开始前修改担任 jury 的私有比赛", () =>
        rejects(check(user, contestNotStartedACMJuriesPrv)));
      it("User 不可以在比赛开始前修改担任 attendee 的公开比赛", () =>
        rejects(check(user, contestNotStartedACMAttendeesPub)));
      it("User 不可以在比赛开始前修改担任 attendee 的私有比赛", () =>
        rejects(check(user, contestNotStartedACMAttendeesPrv)));
      it("User 不可以在比赛开始前修改其他的公开比赛", () =>
        rejects(check(user, contestNotStartedACMGuestsPub)));
      it("User 不可以在比赛开始前修改其他的私有比赛", () =>
        rejects(check(user, contestNotStartedACMGuestsPrv)));

      it("Banned 不可以在比赛开始前修改担任 mod 的公开比赛", () =>
        rejects(check(banned, contestNotStartedACMModsPub)));
      it("Banned 不可以在比赛开始前修改担任 mod 的私有比赛", () =>
        rejects(check(banned, contestNotStartedACMModsPrv)));
      it("Banned 不可以在比赛开始前修改担任 jury 的公开比赛", () =>
        rejects(check(banned, contestNotStartedACMJuriesPub)));
      it("Banned 不可以在比赛开始前修改担任 jury 的私有比赛", () =>
        rejects(check(banned, contestNotStartedACMJuriesPrv)));
      it("Banned 不可以在比赛开始前修改担任 attendee 的公开比赛", () =>
        rejects(check(banned, contestNotStartedACMAttendeesPub)));
      it("Banned 不可以在比赛开始前修改担任 attendee 的私有比赛", () =>
        rejects(check(banned, contestNotStartedACMAttendeesPrv)));
      it("Banned 不可以在比赛开始前修改其他的公开比赛", () =>
        rejects(check(banned, contestNotStartedACMGuestsPub)));
      it("Banned 不可以在比赛开始前修改其他的私有比赛", () =>
        rejects(check(banned, contestNotStartedACMGuestsPrv)));

      it("Guest 不可以在比赛开始前修改其他的公开比赛", () =>
        rejects(check(guest, contestNotStartedACMGuestsPub)));
      it("Guest 不可以在比赛开始前修改其他的私有比赛", () =>
        rejects(check(guest, contestNotStartedACMGuestsPrv)));
    });

    describe("Ended", () => {
      it("Root 可以在比赛结束后修改担任 mod 的公开比赛", () =>
        resolves(check(root, contestEndedACMModsPub)));
      it("Root 可以在比赛结束后修改担任 mod 的私有比赛", () =>
        resolves(check(root, contestEndedACMModsPrv)));
      it("Root 可以在比赛结束后修改担任 jury 的公开比赛", () =>
        resolves(check(root, contestEndedACMJuriesPub)));
      it("Root 可以在比赛结束后修改担任 jury 的私有比赛", () =>
        resolves(check(root, contestEndedACMJuriesPrv)));
      it("Root 可以在比赛结束后修改担任 attendee 的公开比赛", () =>
        resolves(check(root, contestEndedACMAttendeesPub)));
      it("Root 可以在比赛结束后修改担任 attendee 的私有比赛", () =>
        resolves(check(root, contestEndedACMAttendeesPrv)));
      it("Root 可以在比赛结束后修改其他的公开比赛", () =>
        resolves(check(root, contestEndedACMGuestsPub)));
      it("Root 可以在比赛结束后修改其他的私有比赛", () =>
        resolves(check(root, contestEndedACMGuestsPrv)));

      it("Admin 可以在比赛结束后修改担任 mod 的公开比赛", () =>
        resolves(check(admin, contestEndedACMModsPub)));
      it("Admin 可以在比赛结束后修改担任 mod 的私有比赛", () =>
        resolves(check(admin, contestEndedACMModsPrv)));
      it("Admin 可以在比赛结束后修改担任 jury 的公开比赛", () =>
        resolves(check(admin, contestEndedACMJuriesPub)));
      it("Admin 可以在比赛结束后修改担任 jury 的私有比赛", () =>
        resolves(check(admin, contestEndedACMJuriesPrv)));
      it("Admin 可以在比赛结束后修改担任 attendee 的公开比赛", () =>
        resolves(check(admin, contestEndedACMAttendeesPub)));
      it("Admin 可以在比赛结束后修改担任 attendee 的私有比赛", () =>
        resolves(check(admin, contestEndedACMAttendeesPrv)));
      it("Admin 可以在比赛结束后修改其他的公开比赛", () =>
        resolves(check(admin, contestEndedACMGuestsPub)));
      it("Admin 可以在比赛结束后修改其他的私有比赛", () =>
        resolves(check(admin, contestEndedACMGuestsPrv)));

      it("User 可以在比赛结束后修改担任 mod 的公开比赛", () =>
        resolves(check(user, contestEndedACMModsPub)));
      it("User 可以在比赛结束后修改担任 mod 的私有比赛", () =>
        resolves(check(user, contestEndedACMModsPrv)));
      it("User 不可以在比赛结束后修改担任 jury 的公开比赛", () =>
        rejects(check(user, contestEndedACMJuriesPub)));
      it("User 不可以在比赛结束后修改担任 jury 的私有比赛", () =>
        rejects(check(user, contestEndedACMJuriesPrv)));
      it("User 不可以在比赛结束后修改担任 attendee 的公开比赛", () =>
        rejects(check(user, contestEndedACMAttendeesPub)));
      it("User 不可以在比赛结束后修改担任 attendee 的私有比赛", () =>
        rejects(check(user, contestEndedACMAttendeesPrv)));
      it("User 不可以在比赛结束后修改其他的公开比赛", () =>
        rejects(check(user, contestEndedACMGuestsPub)));
      it("User 不可以在比赛结束后修改其他的私有比赛", () =>
        rejects(check(user, contestEndedACMGuestsPrv)));

      it("Banned 不可以在比赛结束后修改担任 mod 的公开比赛", () =>
        rejects(check(banned, contestEndedACMModsPub)));
      it("Banned 不可以在比赛结束后修改担任 mod 的私有比赛", () =>
        rejects(check(banned, contestEndedACMModsPrv)));
      it("Banned 不可以在比赛结束后修改担任 jury 的公开比赛", () =>
        rejects(check(banned, contestEndedACMJuriesPub)));
      it("Banned 不可以在比赛结束后修改担任 jury 的私有比赛", () =>
        rejects(check(banned, contestEndedACMJuriesPrv)));
      it("Banned 不可以在比赛结束后修改担任 attendee 的公开比赛", () =>
        rejects(check(banned, contestEndedACMAttendeesPub)));
      it("Banned 不可以在比赛结束后修改担任 attendee 的私有比赛", () =>
        rejects(check(banned, contestEndedACMAttendeesPrv)));
      it("Banned 不可以在比赛结束后修改其他的公开比赛", () =>
        rejects(check(banned, contestEndedACMGuestsPub)));
      it("Banned 不可以在比赛结束后修改其他的私有比赛", () =>
        rejects(check(banned, contestEndedACMGuestsPrv)));

      it("Guest 不可以在比赛结束后修改其他的公开比赛", () =>
        rejects(check(guest, contestEndedACMGuestsPub)));
      it("Guest 不可以在比赛结束后修改其他的私有比赛", () =>
        rejects(check(guest, contestEndedACMGuestsPrv)));
    });
  });

  describe("IOI", () => {});
  describe("OI", () => {});
  describe("Homework", () => {});
});
