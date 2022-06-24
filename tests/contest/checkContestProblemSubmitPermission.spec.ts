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
import { checkContestProblemSubmitPermission as check } from "~/utils/permission/contest";

describe("checkContestProblemSubmitPermission", () => {
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
      it("Root 不可以在比赛中提交担任 mod 的公开比赛的题目", () =>
        rejects(check(root, contestRunningACMModsPub)));
      it("Root 不可以在比赛中提交担任 mod 的私有比赛的题目", () =>
        rejects(check(root, contestRunningACMModsPrv)));
      it("Root 不可以在比赛中提交担任 jury 的公开比赛的题目", () =>
        rejects(check(root, contestRunningACMJuriesPub)));
      it("Root 不可以在比赛中提交担任 jury 的私有比赛的题目", () =>
        rejects(check(root, contestRunningACMJuriesPrv)));
      it("Root 可以在比赛中提交担任 attendee 的公开比赛的题目", () =>
        resolves(check(root, contestRunningACMAttendeesPub)));
      it("Root 可以在比赛中提交担任 attendee 的私有比赛的题目", () =>
        resolves(check(root, contestRunningACMAttendeesPrv)));
      it("Root 不可以在比赛中提交其他的公开比赛的题目", () =>
        rejects(check(root, contestRunningACMGuestsPub)));
      it("Root 不可以在比赛中提交其他的私有比赛的题目", () =>
        rejects(check(root, contestRunningACMGuestsPrv)));

      it("Admin 不可以在比赛中提交担任 mod 的公开比赛的题目", () =>
        rejects(check(admin, contestRunningACMModsPub)));
      it("Admin 不可以在比赛中提交担任 mod 的私有比赛的题目", () =>
        rejects(check(admin, contestRunningACMModsPrv)));
      it("Admin 不可以在比赛中提交担任 jury 的公开比赛的题目", () =>
        rejects(check(admin, contestRunningACMJuriesPub)));
      it("Admin 不可以在比赛中提交担任 jury 的私有比赛的题目", () =>
        rejects(check(admin, contestRunningACMJuriesPrv)));
      it("Admin 可以在比赛中提交担任 attendee 的公开比赛的题目", () =>
        resolves(check(admin, contestRunningACMAttendeesPub)));
      it("Admin 可以在比赛中提交担任 attendee 的私有比赛的题目", () =>
        resolves(check(admin, contestRunningACMAttendeesPrv)));
      it("Admin 不可以在比赛中提交其他的公开比赛的题目", () =>
        rejects(check(admin, contestRunningACMGuestsPub)));
      it("Admin 不可以在比赛中提交其他的私有比赛的题目", () =>
        rejects(check(admin, contestRunningACMGuestsPrv)));

      it("User 不可以在比赛中提交担任 mod 的公开比赛的题目", () =>
        rejects(check(user, contestRunningACMModsPub)));
      it("User 不可以在比赛中提交担任 mod 的私有比赛的题目", () =>
        rejects(check(user, contestRunningACMModsPrv)));
      it("User 不可以在比赛中提交担任 jury 的公开比赛的题目", () =>
        rejects(check(user, contestRunningACMJuriesPub)));
      it("User 不可以在比赛中提交担任 jury 的私有比赛的题目", () =>
        rejects(check(user, contestRunningACMJuriesPrv)));
      it("User 可以在比赛中提交担任 attendee 的公开比赛的题目", () =>
        resolves(check(user, contestRunningACMAttendeesPub)));
      it("User 可以在比赛中提交担任 attendee 的私有比赛的题目", () =>
        resolves(check(user, contestRunningACMAttendeesPrv)));
      it("User 不可以在比赛中提交其他的公开比赛的题目", () =>
        rejects(check(user, contestRunningACMGuestsPub)));
      it("User 不可以在比赛中提交其他的私有比赛的题目", () =>
        rejects(check(user, contestRunningACMGuestsPrv)));

      it("Banned 不可以在比赛中提交担任 mod 的公开比赛的题目", () =>
        rejects(check(banned, contestRunningACMModsPub)));
      it("Banned 不可以在比赛中提交担任 mod 的私有比赛的题目", () =>
        rejects(check(banned, contestRunningACMModsPrv)));
      it("Banned 不可以在比赛中提交担任 jury 的公开比赛的题目", () =>
        rejects(check(banned, contestRunningACMJuriesPub)));
      it("Banned 不可以在比赛中提交担任 jury 的私有比赛的题目", () =>
        rejects(check(banned, contestRunningACMJuriesPrv)));
      it("Banned 不可以在比赛中提交担任 attendee 的公开比赛的题目", () =>
        rejects(check(banned, contestRunningACMAttendeesPub)));
      it("Banned 不可以在比赛中提交担任 attendee 的私有比赛的题目", () =>
        rejects(check(banned, contestRunningACMAttendeesPrv)));
      it("Banned 不可以在比赛中提交其他的公开比赛的题目", () =>
        rejects(check(banned, contestRunningACMGuestsPub)));
      it("Banned 不可以在比赛中提交其他的私有比赛的题目", () =>
        rejects(check(banned, contestRunningACMGuestsPrv)));

      it("Guest 不可以在比赛中提交其他的公开比赛的题目", () =>
        rejects(check(guest, contestRunningACMGuestsPub)));
      it("Guest 不可以在比赛中提交其他的私有比赛的题目", () =>
        rejects(check(guest, contestRunningACMGuestsPrv)));
    });

    describe("Not Started", () => {
      it("Root 不可以在比赛开始前提交担任 mod 的公开比赛的题目", () =>
        rejects(check(root, contestNotStartedACMModsPub)));
      it("Root 不可以在比赛开始前提交担任 mod 的私有比赛的题目", () =>
        rejects(check(root, contestNotStartedACMModsPrv)));
      it("Root 不可以在比赛开始前提交担任 jury 的公开比赛的题目", () =>
        rejects(check(root, contestNotStartedACMJuriesPub)));
      it("Root 不可以在比赛开始前提交担任 jury 的私有比赛的题目", () =>
        rejects(check(root, contestNotStartedACMJuriesPrv)));
      it("Root 不可以在比赛开始前提交担任 attendee 的公开比赛的题目", () =>
        rejects(check(root, contestNotStartedACMAttendeesPub)));
      it("Root 不可以在比赛开始前提交担任 attendee 的私有比赛的题目", () =>
        rejects(check(root, contestNotStartedACMAttendeesPrv)));
      it("Root 不可以在比赛开始前提交其他的公开比赛的题目", () =>
        rejects(check(root, contestNotStartedACMGuestsPub)));
      it("Root 不可以在比赛开始前提交其他的私有比赛的题目", () =>
        rejects(check(root, contestNotStartedACMGuestsPrv)));

      it("Admin 不可以在比赛开始前提交担任 mod 的公开比赛的题目", () =>
        rejects(check(admin, contestNotStartedACMModsPub)));
      it("Admin 不可以在比赛开始前提交担任 mod 的私有比赛的题目", () =>
        rejects(check(admin, contestNotStartedACMModsPrv)));
      it("Admin 不可以在比赛开始前提交担任 jury 的公开比赛的题目", () =>
        rejects(check(admin, contestNotStartedACMJuriesPub)));
      it("Admin 不可以在比赛开始前提交担任 jury 的私有比赛的题目", () =>
        rejects(check(admin, contestNotStartedACMJuriesPrv)));
      it("Admin 不可以在比赛开始前提交担任 attendee 的公开比赛的题目", () =>
        rejects(check(admin, contestNotStartedACMAttendeesPub)));
      it("Admin 不可以在比赛开始前提交担任 attendee 的私有比赛的题目", () =>
        rejects(check(admin, contestNotStartedACMAttendeesPrv)));
      it("Admin 不可以在比赛开始前提交其他的公开比赛的题目", () =>
        rejects(check(admin, contestNotStartedACMGuestsPub)));
      it("Admin 不可以在比赛开始前提交其他的私有比赛的题目", () =>
        rejects(check(admin, contestNotStartedACMGuestsPrv)));

      it("User 不可以在比赛开始前提交担任 mod 的公开比赛的题目", () =>
        rejects(check(user, contestNotStartedACMModsPub)));
      it("User 不可以在比赛开始前提交担任 mod 的私有比赛的题目", () =>
        rejects(check(user, contestNotStartedACMModsPrv)));
      it("User 不可以在比赛开始前提交担任 jury 的公开比赛的题目", () =>
        rejects(check(user, contestNotStartedACMJuriesPub)));
      it("User 不可以在比赛开始前提交担任 jury 的私有比赛的题目", () =>
        rejects(check(user, contestNotStartedACMJuriesPrv)));
      it("User 不可以在比赛开始前提交担任 attendee 的公开比赛的题目", () =>
        rejects(check(user, contestNotStartedACMAttendeesPub)));
      it("User 不可以在比赛开始前提交担任 attendee 的私有比赛的题目", () =>
        rejects(check(user, contestNotStartedACMAttendeesPrv)));
      it("User 不可以在比赛开始前提交其他的公开比赛的题目", () =>
        rejects(check(user, contestNotStartedACMGuestsPub)));
      it("User 不可以在比赛开始前提交其他的私有比赛的题目", () =>
        rejects(check(user, contestNotStartedACMGuestsPrv)));

      it("Banned 不可以在比赛开始前提交担任 mod 的公开比赛的题目", () =>
        rejects(check(banned, contestNotStartedACMModsPub)));
      it("Banned 不可以在比赛开始前提交担任 mod 的私有比赛的题目", () =>
        rejects(check(banned, contestNotStartedACMModsPrv)));
      it("Banned 不可以在比赛开始前提交担任 jury 的公开比赛的题目", () =>
        rejects(check(banned, contestNotStartedACMJuriesPub)));
      it("Banned 不可以在比赛开始前提交担任 jury 的私有比赛的题目", () =>
        rejects(check(banned, contestNotStartedACMJuriesPrv)));
      it("Banned 不可以在比赛开始前提交担任 attendee 的公开比赛的题目", () =>
        rejects(check(banned, contestNotStartedACMAttendeesPub)));
      it("Banned 不可以在比赛开始前提交担任 attendee 的私有比赛的题目", () =>
        rejects(check(banned, contestNotStartedACMAttendeesPrv)));
      it("Banned 不可以在比赛开始前提交其他的公开比赛的题目", () =>
        rejects(check(banned, contestNotStartedACMGuestsPub)));
      it("Banned 不可以在比赛开始前提交其他的私有比赛的题目", () =>
        rejects(check(banned, contestNotStartedACMGuestsPrv)));

      it("Guest 不可以在比赛开始前提交其他的公开比赛的题目", () =>
        rejects(check(guest, contestNotStartedACMGuestsPub)));
      it("Guest 不可以在比赛开始前提交其他的私有比赛的题目", () =>
        rejects(check(guest, contestNotStartedACMGuestsPrv)));
    });

    describe("Ended", () => {
      it("Root 不可以在比赛结束后提交担任 mod 的公开比赛的题目", () =>
        rejects(check(root, contestEndedACMModsPub)));
      it("Root 不可以在比赛结束后提交担任 mod 的私有比赛的题目", () =>
        rejects(check(root, contestEndedACMModsPrv)));
      it("Root 不可以在比赛结束后提交担任 jury 的公开比赛的题目", () =>
        rejects(check(root, contestEndedACMJuriesPub)));
      it("Root 不可以在比赛结束后提交担任 jury 的私有比赛的题目", () =>
        rejects(check(root, contestEndedACMJuriesPrv)));
      it("Root 不可以在比赛结束后提交担任 attendee 的公开比赛的题目", () =>
        rejects(check(root, contestEndedACMAttendeesPub)));
      it("Root 不可以在比赛结束后提交担任 attendee 的私有比赛的题目", () =>
        rejects(check(root, contestEndedACMAttendeesPrv)));
      it("Root 不可以在比赛结束后提交其他的公开比赛的题目", () =>
        rejects(check(root, contestEndedACMGuestsPub)));
      it("Root 不可以在比赛结束后提交其他的私有比赛的题目", () =>
        rejects(check(root, contestEndedACMGuestsPrv)));

      it("Admin 不可以在比赛结束后提交担任 mod 的公开比赛的题目", () =>
        rejects(check(admin, contestEndedACMModsPub)));
      it("Admin 不可以在比赛结束后提交担任 mod 的私有比赛的题目", () =>
        rejects(check(admin, contestEndedACMModsPrv)));
      it("Admin 不可以在比赛结束后提交担任 jury 的公开比赛的题目", () =>
        rejects(check(admin, contestEndedACMJuriesPub)));
      it("Admin 不可以在比赛结束后提交担任 jury 的私有比赛的题目", () =>
        rejects(check(admin, contestEndedACMJuriesPrv)));
      it("Admin 不可以在比赛结束后提交担任 attendee 的公开比赛的题目", () =>
        rejects(check(admin, contestEndedACMAttendeesPub)));
      it("Admin 不可以在比赛结束后提交担任 attendee 的私有比赛的题目", () =>
        rejects(check(admin, contestEndedACMAttendeesPrv)));
      it("Admin 不可以在比赛结束后提交其他的公开比赛的题目", () =>
        rejects(check(admin, contestEndedACMGuestsPub)));
      it("Admin 不可以在比赛结束后提交其他的私有比赛的题目", () =>
        rejects(check(admin, contestEndedACMGuestsPrv)));

      it("User 不可以在比赛结束后提交担任 mod 的公开比赛的题目", () =>
        rejects(check(user, contestEndedACMModsPub)));
      it("User 不可以在比赛结束后提交担任 mod 的私有比赛的题目", () =>
        rejects(check(user, contestEndedACMModsPrv)));
      it("User 不可以在比赛结束后提交担任 jury 的公开比赛的题目", () =>
        rejects(check(user, contestEndedACMJuriesPub)));
      it("User 不可以在比赛结束后提交担任 jury 的私有比赛的题目", () =>
        rejects(check(user, contestEndedACMJuriesPrv)));
      it("User 不可以在比赛结束后提交担任 attendee 的公开比赛的题目", () =>
        rejects(check(user, contestEndedACMAttendeesPub)));
      it("User 不可以在比赛结束后提交担任 attendee 的私有比赛的题目", () =>
        rejects(check(user, contestEndedACMAttendeesPrv)));
      it("User 不可以在比赛结束后提交其他的公开比赛的题目", () =>
        rejects(check(user, contestEndedACMGuestsPub)));
      it("User 不可以在比赛结束后提交其他的私有比赛的题目", () =>
        rejects(check(user, contestEndedACMGuestsPrv)));

      it("Banned 不可以在比赛结束后提交担任 mod 的公开比赛的题目", () =>
        rejects(check(banned, contestEndedACMModsPub)));
      it("Banned 不可以在比赛结束后提交担任 mod 的私有比赛的题目", () =>
        rejects(check(banned, contestEndedACMModsPrv)));
      it("Banned 不可以在比赛结束后提交担任 jury 的公开比赛的题目", () =>
        rejects(check(banned, contestEndedACMJuriesPub)));
      it("Banned 不可以在比赛结束后提交担任 jury 的私有比赛的题目", () =>
        rejects(check(banned, contestEndedACMJuriesPrv)));
      it("Banned 不可以在比赛结束后提交担任 attendee 的公开比赛的题目", () =>
        rejects(check(banned, contestEndedACMAttendeesPub)));
      it("Banned 不可以在比赛结束后提交担任 attendee 的私有比赛的题目", () =>
        rejects(check(banned, contestEndedACMAttendeesPrv)));
      it("Banned 不可以在比赛结束后提交其他的公开比赛的题目", () =>
        rejects(check(banned, contestEndedACMGuestsPub)));
      it("Banned 不可以在比赛结束后提交其他的私有比赛的题目", () =>
        rejects(check(banned, contestEndedACMGuestsPrv)));

      it("Guest 不可以在比赛结束后提交其他的公开比赛的题目", () =>
        rejects(check(guest, contestEndedACMGuestsPub)));
      it("Guest 不可以在比赛结束后提交其他的私有比赛的题目", () =>
        rejects(check(guest, contestEndedACMGuestsPrv)));
    });
  });

  describe("IOI", () => {});
  describe("OI", () => {});
  describe("Homework", () => {});
});
