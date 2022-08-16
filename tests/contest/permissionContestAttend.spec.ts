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
} from "../tools";
import { permissionContestAttend as permission } from "~/utils/permission/contest";
import test from "node:test";
import assert from "assert";

test("permissionContestAttend", async (t) => {
  const root = await createRequest(1);
  const admin = await createRequest(2);
  const user = await createRequest(3);
  const banned = await createRequest(4);
  const guest = new Request("http://localhost:8080/");

  await t.test("Running", async () => {
    assert(!(await permission.check(root, contestRunningModsPub)), "Root 不可以在比赛中报名担任 mod 的公开比赛");
    assert(!(await permission.check(root, contestRunningModsPrv)), "Root 不可以在比赛中报名担任 mod 的私有比赛");
    assert(!(await permission.check(root, contestRunningJuriesPub)), "Root 不可以在比赛中报名担任 jury 的公开比赛");
    assert(!(await permission.check(root, contestRunningJuriesPrv)), "Root 不可以在比赛中报名担任 jury 的私有比赛");
    assert(!(await permission.check(root, contestRunningAttendeesPub)), "Root 不可以在比赛中报名担任 attendee 的公开比赛");
    assert(!(await permission.check(root, contestRunningAttendeesPrv)), "Root 不可以在比赛中报名担任 attendee 的私有比赛");
    assert(await permission.check(root, contestRunningGuestsPub), "Root 可以在比赛中报名其他的公开比赛");
    assert(!(await permission.check(root, contestRunningGuestsPrv)), "Root 不可以在比赛中报名其他的私有比赛");

    assert(!(await permission.check(admin, contestRunningModsPub)), "Admin 不可以在比赛中报名担任 mod 的公开比赛");
    assert(!(await permission.check(admin, contestRunningModsPrv)), "Admin 不可以在比赛中报名担任 mod 的私有比赛");
    assert(!(await permission.check(admin, contestRunningJuriesPub)), "Admin 不可以在比赛中报名担任 jury 的公开比赛");
    assert(!(await permission.check(admin, contestRunningJuriesPrv)), "Admin 不可以在比赛中报名担任 jury 的私有比赛");
    assert(!(await permission.check(admin, contestRunningAttendeesPub)), "Admin 不可以在比赛中报名担任 attendee 的公开比赛");
    assert(!(await permission.check(admin, contestRunningAttendeesPrv)), "Admin 不可以在比赛中报名担任 attendee 的私有比赛");
    assert(await permission.check(admin, contestRunningGuestsPub), "Admin 可以在比赛中报名其他的公开比赛");
    assert(!(await permission.check(admin, contestRunningGuestsPrv)), "Admin 不可以在比赛中报名其他的私有比赛");

    assert(!(await permission.check(user, contestRunningModsPub)), "User 不可以在比赛中报名担任 mod 的公开比赛");
    assert(!(await permission.check(user, contestRunningModsPrv)), "User 不可以在比赛中报名担任 mod 的私有比赛");
    assert(!(await permission.check(user, contestRunningJuriesPub)), "User 不可以在比赛中报名担任 jury 的公开比赛");
    assert(!(await permission.check(user, contestRunningJuriesPrv)), "User 不可以在比赛中报名担任 jury 的私有比赛");
    assert(!(await permission.check(user, contestRunningAttendeesPub)), "User 不可以在比赛中报名担任 attendee 的公开比赛");
    assert(!(await permission.check(user, contestRunningAttendeesPrv)), "User 不可以在比赛中报名担任 attendee 的私有比赛");
    assert(await permission.check(user, contestRunningGuestsPub), "User 可以在比赛中报名其他的公开比赛");
    assert(!(await permission.check(user, contestRunningGuestsPrv)), "User 不可以在比赛中报名其他的私有比赛");

    assert(!(await permission.check(banned, contestRunningModsPub)), "Banned 不可以在比赛中报名担任 mod 的公开比赛");
    assert(!(await permission.check(banned, contestRunningModsPrv)), "Banned 不可以在比赛中报名担任 mod 的私有比赛");
    assert(!(await permission.check(banned, contestRunningJuriesPub)), "Banned 不可以在比赛中报名担任 jury 的公开比赛");
    assert(!(await permission.check(banned, contestRunningJuriesPrv)), "Banned 不可以在比赛中报名担任 jury 的私有比赛");
    assert(!(await permission.check(banned, contestRunningAttendeesPub)), "Banned 不可以在比赛中报名担任 attendee 的公开比赛");
    assert(!(await permission.check(banned, contestRunningAttendeesPrv)), "Banned 不可以在比赛中报名担任 attendee 的私有比赛");
    assert(!(await permission.check(banned, contestRunningGuestsPub)), "Banned 不可以在比赛中报名其他的公开比赛");
    assert(!(await permission.check(banned, contestRunningGuestsPrv)), "Banned 不可以在比赛中报名其他的私有比赛");

    assert(!(await permission.check(guest, contestRunningGuestsPub)), "Guest 不可以在比赛中报名其他的公开比赛");
    assert(!(await permission.check(guest, contestRunningGuestsPrv)), "Guest 不可以在比赛中报名其他的私有比赛");
  });

  await t.test("Not Started", async () => {
    assert(!(await permission.check(root, contestNotStartedModsPub)), "Root 不可以在比赛开始前报名担任 mod 的公开比赛");
    assert(!(await permission.check(root, contestNotStartedModsPrv)), "Root 不可以在比赛开始前报名担任 mod 的私有比赛");
    assert(!(await permission.check(root, contestNotStartedJuriesPub)), "Root 不可以在比赛开始前报名担任 jury 的公开比赛");
    assert(!(await permission.check(root, contestNotStartedJuriesPrv)), "Root 不可以在比赛开始前报名担任 jury 的私有比赛");
    assert(!(await permission.check(root, contestNotStartedAttendeesPub)), "Root 不可以在比赛开始前报名担任 attendee 的公开比赛");
    assert(!(await permission.check(root, contestNotStartedAttendeesPrv)), "Root 不可以在比赛开始前报名担任 attendee 的私有比赛");
    assert(await permission.check(root, contestNotStartedGuestsPub), "Root 可以在比赛开始前报名其他的公开比赛");
    assert(!(await permission.check(root, contestNotStartedGuestsPrv)), "Root 不可以在比赛开始前报名其他的私有比赛");

    assert(!(await permission.check(admin, contestNotStartedModsPub)), "Admin 不可以在比赛开始前报名担任 mod 的公开比赛");
    assert(!(await permission.check(admin, contestNotStartedModsPrv)), "Admin 不可以在比赛开始前报名担任 mod 的私有比赛");
    assert(!(await permission.check(admin, contestNotStartedJuriesPub)), "Admin 不可以在比赛开始前报名担任 jury 的公开比赛");
    assert(!(await permission.check(admin, contestNotStartedJuriesPrv)), "Admin 不可以在比赛开始前报名担任 jury 的私有比赛");
    assert(!(await permission.check(admin, contestNotStartedAttendeesPub)), "Admin 不可以在比赛开始前报名担任 attendee 的公开比赛");
    assert(!(await permission.check(admin, contestNotStartedAttendeesPrv)), "Admin 不可以在比赛开始前报名担任 attendee 的私有比赛");
    assert(await permission.check(admin, contestNotStartedGuestsPub), "Admin 可以在比赛开始前报名其他的公开比赛");
    assert(!(await permission.check(admin, contestNotStartedGuestsPrv)), "Admin 不可以在比赛开始前报名其他的私有比赛");

    assert(!(await permission.check(user, contestNotStartedModsPub)), "User 不可以在比赛开始前报名担任 mod 的公开比赛");
    assert(!(await permission.check(user, contestNotStartedModsPrv)), "User 不可以在比赛开始前报名担任 mod 的私有比赛");
    assert(!(await permission.check(user, contestNotStartedJuriesPub)), "User 不可以在比赛开始前报名担任 jury 的公开比赛");
    assert(!(await permission.check(user, contestNotStartedJuriesPrv)), "User 不可以在比赛开始前报名担任 jury 的私有比赛");
    assert(!(await permission.check(user, contestNotStartedAttendeesPub)), "User 不可以在比赛开始前报名担任 attendee 的公开比赛");
    assert(!(await permission.check(user, contestNotStartedAttendeesPrv)), "User 不可以在比赛开始前报名担任 attendee 的私有比赛");
    assert(await permission.check(user, contestNotStartedGuestsPub), "User 可以在比赛开始前报名其他的公开比赛");
    assert(!(await permission.check(user, contestNotStartedGuestsPrv)), "User 不可以在比赛开始前报名其他的私有比赛");

    assert(!(await permission.check(banned, contestNotStartedModsPub)), "Banned 不可以在比赛开始前报名担任 mod 的公开比赛");
    assert(!(await permission.check(banned, contestNotStartedModsPrv)), "Banned 不可以在比赛开始前报名担任 mod 的私有比赛");
    assert(!(await permission.check(banned, contestNotStartedJuriesPub)), "Banned 不可以在比赛开始前报名担任 jury 的公开比赛");
    assert(!(await permission.check(banned, contestNotStartedJuriesPrv)), "Banned 不可以在比赛开始前报名担任 jury 的私有比赛");
    assert(!(await permission.check(banned, contestNotStartedAttendeesPub)), "Banned 不可以在比赛开始前报名担任 attendee 的公开比赛");
    assert(!(await permission.check(banned, contestNotStartedAttendeesPrv)), "Banned 不可以在比赛开始前报名担任 attendee 的私有比赛");
    assert(!(await permission.check(banned, contestNotStartedGuestsPub)), "Banned 不可以在比赛开始前报名其他的公开比赛");
    assert(!(await permission.check(banned, contestNotStartedGuestsPrv)), "Banned 不可以在比赛开始前报名其他的私有比赛");

    assert(!(await permission.check(guest, contestNotStartedGuestsPub)), "Guest 不可以在比赛开始前报名其他的公开比赛");
    assert(!(await permission.check(guest, contestNotStartedGuestsPrv)), "Guest 不可以在比赛开始前报名其他的私有比赛");
  });

  await t.test("Ended", async () => {
    assert(!(await permission.check(root, contestEndedModsPub)), "Root 不可以在比赛结束后报名担任 mod 的公开比赛");
    assert(!(await permission.check(root, contestEndedModsPrv)), "Root 不可以在比赛结束后报名担任 mod 的私有比赛");
    assert(!(await permission.check(root, contestEndedJuriesPub)), "Root 不可以在比赛结束后报名担任 jury 的公开比赛");
    assert(!(await permission.check(root, contestEndedJuriesPrv)), "Root 不可以在比赛结束后报名担任 jury 的私有比赛");
    assert(!(await permission.check(root, contestEndedAttendeesPub)), "Root 不可以在比赛结束后报名担任 attendee 的公开比赛");
    assert(!(await permission.check(root, contestEndedAttendeesPrv)), "Root 不可以在比赛结束后报名担任 attendee 的私有比赛");
    assert(!(await permission.check(root, contestEndedGuestsPub)), "Root 不可以在比赛结束后报名其他的公开比赛");
    assert(!(await permission.check(root, contestEndedGuestsPrv)), "Root 不可以在比赛结束后报名其他的私有比赛");

    assert(!(await permission.check(admin, contestEndedModsPub)), "Admin 不可以在比赛结束后报名担任 mod 的公开比赛");
    assert(!(await permission.check(admin, contestEndedModsPrv)), "Admin 不可以在比赛结束后报名担任 mod 的私有比赛");
    assert(!(await permission.check(admin, contestEndedJuriesPub)), "Admin 不可以在比赛结束后报名担任 jury 的公开比赛");
    assert(!(await permission.check(admin, contestEndedJuriesPrv)), "Admin 不可以在比赛结束后报名担任 jury 的私有比赛");
    assert(!(await permission.check(admin, contestEndedAttendeesPub)), "Admin 不可以在比赛结束后报名担任 attendee 的公开比赛");
    assert(!(await permission.check(admin, contestEndedAttendeesPrv)), "Admin 不可以在比赛结束后报名担任 attendee 的私有比赛");
    assert(!(await permission.check(admin, contestEndedGuestsPub)), "Admin 不可以在比赛结束后报名其他的公开比赛");
    assert(!(await permission.check(admin, contestEndedGuestsPrv)), "Admin 不可以在比赛结束后报名其他的私有比赛");

    assert(!(await permission.check(user, contestEndedModsPub)), "User 不可以在比赛结束后报名担任 mod 的公开比赛");
    assert(!(await permission.check(user, contestEndedModsPrv)), "User 不可以在比赛结束后报名担任 mod 的私有比赛");
    assert(!(await permission.check(user, contestEndedJuriesPub)), "User 不可以在比赛结束后报名担任 jury 的公开比赛");
    assert(!(await permission.check(user, contestEndedJuriesPrv)), "User 不可以在比赛结束后报名担任 jury 的私有比赛");
    assert(!(await permission.check(user, contestEndedAttendeesPub)), "User 不可以在比赛结束后报名担任 attendee 的公开比赛");
    assert(!(await permission.check(user, contestEndedAttendeesPrv)), "User 不可以在比赛结束后报名担任 attendee 的私有比赛");
    assert(!(await permission.check(user, contestEndedGuestsPub)), "User 不可以在比赛结束后报名其他的公开比赛");
    assert(!(await permission.check(user, contestEndedGuestsPrv)), "User 不可以在比赛结束后报名其他的私有比赛");

    assert(!(await permission.check(banned, contestEndedModsPub)), "Banned 不可以在比赛结束后报名担任 mod 的公开比赛");
    assert(!(await permission.check(banned, contestEndedModsPrv)), "Banned 不可以在比赛结束后报名担任 mod 的私有比赛");
    assert(!(await permission.check(banned, contestEndedJuriesPub)), "Banned 不可以在比赛结束后报名担任 jury 的公开比赛");
    assert(!(await permission.check(banned, contestEndedJuriesPrv)), "Banned 不可以在比赛结束后报名担任 jury 的私有比赛");
    assert(!(await permission.check(banned, contestEndedAttendeesPub)), "Banned 不可以在比赛结束后报名担任 attendee 的公开比赛");
    assert(!(await permission.check(banned, contestEndedAttendeesPrv)), "Banned 不可以在比赛结束后报名担任 attendee 的私有比赛");
    assert(!(await permission.check(banned, contestEndedGuestsPub)), "Banned 不可以在比赛结束后报名其他的公开比赛");
    assert(!(await permission.check(banned, contestEndedGuestsPrv)), "Banned 不可以在比赛结束后报名其他的私有比赛");

    assert(!(await permission.check(guest, contestEndedGuestsPub)), "Guest 不可以在比赛结束后报名其他的公开比赛");
    assert(!(await permission.check(guest, contestEndedGuestsPrv)), "Guest 不可以在比赛结束后报名其他的私有比赛");
  });
});
