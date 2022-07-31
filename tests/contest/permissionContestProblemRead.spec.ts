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
import { permissionContestProblemRead as permission } from "~/utils/permission/contest";
import test from "node:test";
import assert from "node:assert";
import { checkPermission } from "~/utils/permission";

test("permissionContestProblemRead", async (t) => {
  const root = await createRequest(1);
  const admin = await createRequest(2);
  const user = await createRequest(3);
  const banned = await createRequest(4);
  const guest = new Request("http://localhost:8080/");

  await t.test("Running", async () => {
    assert(await checkPermission(permission, root, contestRunningModsPub), "Root 可以在比赛中查看担任 mod 的公开比赛的题目");
    assert(await checkPermission(permission, root, contestRunningModsPrv), "Root 可以在比赛中查看担任 mod 的私有比赛的题目");
    assert(await checkPermission(permission, root, contestRunningJuriesPub), "Root 可以在比赛中查看担任 jury 的公开比赛的题目");
    assert(await checkPermission(permission, root, contestRunningJuriesPrv), "Root 可以在比赛中查看担任 jury 的私有比赛的题目");
    assert(await checkPermission(permission, root, contestRunningAttendeesPub), "Root 可以在比赛中查看担任 attendee 的公开比赛的题目");
    assert(await checkPermission(permission, root, contestRunningAttendeesPrv), "Root 可以在比赛中查看担任 attendee 的私有比赛的题目");
    assert(await checkPermission(permission, root, contestRunningGuestsPub), "Root 可以在比赛中查看其他的公开比赛的题目");
    assert(await checkPermission(permission, root, contestRunningGuestsPrv), "Root 可以在比赛中查看其他的私有比赛的题目");

    assert(await checkPermission(permission, admin, contestRunningModsPub), "Admin 可以在比赛中查看担任 mod 的公开比赛的题目");
    assert(await checkPermission(permission, admin, contestRunningModsPrv), "Admin 可以在比赛中查看担任 mod 的私有比赛的题目");
    assert(await checkPermission(permission, admin, contestRunningJuriesPub), "Admin 可以在比赛中查看担任 jury 的公开比赛的题目");
    assert(await checkPermission(permission, admin, contestRunningJuriesPrv), "Admin 可以在比赛中查看担任 jury 的私有比赛的题目");
    assert(await checkPermission(permission, admin, contestRunningAttendeesPub), "Admin 可以在比赛中查看担任 attendee 的公开比赛的题目");
    assert(await checkPermission(permission, admin, contestRunningAttendeesPrv), "Admin 可以在比赛中查看担任 attendee 的私有比赛的题目");
    assert(await checkPermission(permission, admin, contestRunningGuestsPub), "Admin 可以在比赛中查看其他的公开比赛的题目");
    assert(await checkPermission(permission, admin, contestRunningGuestsPrv), "Admin 可以在比赛中查看其他的私有比赛的题目");

    assert(await checkPermission(permission, user, contestRunningModsPub), "User 可以在比赛中查看担任 mod 的公开比赛的题目");
    assert(await checkPermission(permission, user, contestRunningModsPrv), "User 可以在比赛中查看担任 mod 的私有比赛的题目");
    assert(await checkPermission(permission, user, contestRunningJuriesPub), "User 可以在比赛中查看担任 jury 的公开比赛的题目");
    assert(await checkPermission(permission, user, contestRunningJuriesPrv), "User 可以在比赛中查看担任 jury 的私有比赛的题目");
    assert(await checkPermission(permission, user, contestRunningAttendeesPub), "User 可以在比赛中查看担任 attendee 的公开比赛的题目");
    assert(await checkPermission(permission, user, contestRunningAttendeesPrv), "User 可以在比赛中查看担任 attendee 的私有比赛的题目");
    assert(!(await checkPermission(permission, user, contestRunningGuestsPub)), "User 不可以在比赛中查看其他的公开比赛的题目");
    assert(!(await checkPermission(permission, user, contestRunningGuestsPrv)), "User 不可以在比赛中查看其他的私有比赛的题目");

    assert(await checkPermission(permission, banned, contestRunningModsPub), "Banned 可以在比赛中查看担任 mod 的公开比赛的题目");
    assert(await checkPermission(permission, banned, contestRunningModsPrv), "Banned 可以在比赛中查看担任 mod 的私有比赛的题目");
    assert(await checkPermission(permission, banned, contestRunningJuriesPub), "Banned 可以在比赛中查看担任 jury 的公开比赛的题目");
    assert(await checkPermission(permission, banned, contestRunningJuriesPrv), "Banned 可以在比赛中查看担任 jury 的私有比赛的题目");
    assert(await checkPermission(permission, banned, contestRunningAttendeesPub), "Banned 可以在比赛中查看担任 attendee 的公开比赛的题目");
    assert(await checkPermission(permission, banned, contestRunningAttendeesPrv), "Banned 可以在比赛中查看担任 attendee 的私有比赛的题目");
    assert(!(await checkPermission(permission, banned, contestRunningGuestsPub)), "Banned 不可以在比赛中查看其他的公开比赛的题目");
    assert(!(await checkPermission(permission, banned, contestRunningGuestsPrv)), "Banned 不可以在比赛中查看其他的私有比赛的题目");

    assert(!(await checkPermission(permission, guest, contestRunningGuestsPub)), "Guest 不可以在比赛中查看其他的公开比赛的题目");
    assert(!(await checkPermission(permission, guest, contestRunningGuestsPrv)), "Guest 不可以在比赛中查看其他的私有比赛的题目");
  });

  await t.test("Not Started", async () => {
    assert(await checkPermission(permission, root, contestNotStartedModsPub), "Root 可以在比赛开始前查看担任 mod 的公开比赛的题目");
    assert(await checkPermission(permission, root, contestNotStartedModsPrv), "Root 可以在比赛开始前查看担任 mod 的私有比赛的题目");
    assert(await checkPermission(permission, root, contestNotStartedJuriesPub), "Root 可以在比赛开始前查看担任 jury 的公开比赛的题目");
    assert(await checkPermission(permission, root, contestNotStartedJuriesPrv), "Root 可以在比赛开始前查看担任 jury 的私有比赛的题目");
    assert(await checkPermission(permission, root, contestNotStartedAttendeesPub), "Root 可以在比赛开始前查看担任 attendee 的公开比赛的题目");
    assert(await checkPermission(permission, root, contestNotStartedAttendeesPrv), "Root 可以在比赛开始前查看担任 attendee 的私有比赛的题目");
    assert(await checkPermission(permission, root, contestNotStartedGuestsPub), "Root 可以在比赛开始前查看其他的公开比赛的题目");
    assert(await checkPermission(permission, root, contestNotStartedGuestsPrv), "Root 可以在比赛开始前查看其他的私有比赛的题目");

    assert(await checkPermission(permission, admin, contestNotStartedModsPub), "Admin 可以在比赛开始前查看担任 mod 的公开比赛的题目");
    assert(await checkPermission(permission, admin, contestNotStartedModsPrv), "Admin 可以在比赛开始前查看担任 mod 的私有比赛的题目");
    assert(await checkPermission(permission, admin, contestNotStartedJuriesPub), "Admin 可以在比赛开始前查看担任 jury 的公开比赛的题目");
    assert(await checkPermission(permission, admin, contestNotStartedJuriesPrv), "Admin 可以在比赛开始前查看担任 jury 的私有比赛的题目");
    assert(await checkPermission(permission, admin, contestNotStartedAttendeesPub), "Admin 可以在比赛开始前查看担任 attendee 的公开比赛的题目");
    assert(await checkPermission(permission, admin, contestNotStartedAttendeesPrv), "Admin 可以在比赛开始前查看担任 attendee 的私有比赛的题目");
    assert(await checkPermission(permission, admin, contestNotStartedGuestsPub), "Admin 可以在比赛开始前查看其他的公开比赛的题目");
    assert(await checkPermission(permission, admin, contestNotStartedGuestsPrv), "Admin 可以在比赛开始前查看其他的私有比赛的题目");

    assert(await checkPermission(permission, user, contestNotStartedModsPub), "User 可以在比赛开始前查看担任 mod 的公开比赛的题目");
    assert(await checkPermission(permission, user, contestNotStartedModsPrv), "User 可以在比赛开始前查看担任 mod 的私有比赛的题目");
    assert(await checkPermission(permission, user, contestNotStartedJuriesPub), "User 可以在比赛开始前查看担任 jury 的公开比赛的题目");
    assert(await checkPermission(permission, user, contestNotStartedJuriesPrv), "User 可以在比赛开始前查看担任 jury 的私有比赛的题目");
    assert(!(await checkPermission(permission, user, contestNotStartedAttendeesPub)), "User 不可以在比赛开始前查看担任 attendee 的公开比赛的题目");
    assert(!(await checkPermission(permission, user, contestNotStartedAttendeesPrv)), "User 不可以在比赛开始前查看担任 attendee 的私有比赛的题目");
    assert(!(await checkPermission(permission, user, contestNotStartedGuestsPub)), "User 不可以在比赛开始前查看其他的公开比赛的题目");
    assert(!(await checkPermission(permission, user, contestNotStartedGuestsPrv)), "User 不可以在比赛开始前查看其他的私有比赛的题目");

    assert(await checkPermission(permission, banned, contestNotStartedModsPub), "Banned 可以在比赛开始前查看担任 mod 的公开比赛的题目");
    assert(await checkPermission(permission, banned, contestNotStartedModsPrv), "Banned 可以在比赛开始前查看担任 mod 的私有比赛的题目");
    assert(await checkPermission(permission, banned, contestNotStartedJuriesPub), "Banned 可以在比赛开始前查看担任 jury 的公开比赛的题目");
    assert(await checkPermission(permission, banned, contestNotStartedJuriesPrv), "Banned 可以在比赛开始前查看担任 jury 的私有比赛的题目");
    assert(!(await checkPermission(permission, banned, contestNotStartedAttendeesPub)), "Banned 不可以在比赛开始前查看担任 attendee 的公开比赛的题目");
    assert(!(await checkPermission(permission, banned, contestNotStartedAttendeesPrv)), "Banned 不可以在比赛开始前查看担任 attendee 的私有比赛的题目");
    assert(!(await checkPermission(permission, banned, contestNotStartedGuestsPub)), "Banned 不可以在比赛开始前查看其他的公开比赛的题目");
    assert(!(await checkPermission(permission, banned, contestNotStartedGuestsPrv)), "Banned 不可以在比赛开始前查看其他的私有比赛的题目");

    assert(!(await checkPermission(permission, guest, contestNotStartedGuestsPub)), "Guest 不可以在比赛开始前查看其他的公开比赛的题目");
    assert(!(await checkPermission(permission, guest, contestNotStartedGuestsPrv)), "Guest 不可以在比赛开始前查看其他的私有比赛的题目");
  });

  await t.test("Ended", async () => {
    assert(await checkPermission(permission, root, contestEndedModsPub), "Root 可以在比赛结束后查看担任 mod 的公开比赛的题目");
    assert(await checkPermission(permission, root, contestEndedModsPrv), "Root 可以在比赛结束后查看担任 mod 的私有比赛的题目");
    assert(await checkPermission(permission, root, contestEndedJuriesPub), "Root 可以在比赛结束后查看担任 jury 的公开比赛的题目");
    assert(await checkPermission(permission, root, contestEndedJuriesPrv), "Root 可以在比赛结束后查看担任 jury 的私有比赛的题目");
    assert(await checkPermission(permission, root, contestEndedAttendeesPub), "Root 可以在比赛结束后查看担任 attendee 的公开比赛的题目");
    assert(await checkPermission(permission, root, contestEndedAttendeesPrv), "Root 可以在比赛结束后查看担任 attendee 的私有比赛的题目");
    assert(await checkPermission(permission, root, contestEndedGuestsPub), "Root 可以在比赛结束后查看其他的公开比赛的题目");
    assert(await checkPermission(permission, root, contestEndedGuestsPrv), "Root 可以在比赛结束后查看其他的私有比赛的题目");

    assert(await checkPermission(permission, admin, contestEndedModsPub), "Admin 可以在比赛结束后查看担任 mod 的公开比赛的题目");
    assert(await checkPermission(permission, admin, contestEndedModsPrv), "Admin 可以在比赛结束后查看担任 mod 的私有比赛的题目");
    assert(await checkPermission(permission, admin, contestEndedJuriesPub), "Admin 可以在比赛结束后查看担任 jury 的公开比赛的题目");
    assert(await checkPermission(permission, admin, contestEndedJuriesPrv), "Admin 可以在比赛结束后查看担任 jury 的私有比赛的题目");
    assert(await checkPermission(permission, admin, contestEndedAttendeesPub), "Admin 可以在比赛结束后查看担任 attendee 的公开比赛的题目");
    assert(await checkPermission(permission, admin, contestEndedAttendeesPrv), "Admin 可以在比赛结束后查看担任 attendee 的私有比赛的题目");
    assert(await checkPermission(permission, admin, contestEndedGuestsPub), "Admin 可以在比赛结束后查看其他的公开比赛的题目");
    assert(await checkPermission(permission, admin, contestEndedGuestsPrv), "Admin 可以在比赛结束后查看其他的私有比赛的题目");

    assert(await checkPermission(permission, user, contestEndedModsPub), "User 可以在比赛结束后查看担任 mod 的公开比赛的题目");
    assert(await checkPermission(permission, user, contestEndedModsPrv), "User 可以在比赛结束后查看担任 mod 的私有比赛的题目");
    assert(await checkPermission(permission, user, contestEndedJuriesPub), "User 可以在比赛结束后查看担任 jury 的公开比赛的题目");
    assert(await checkPermission(permission, user, contestEndedJuriesPrv), "User 可以在比赛结束后查看担任 jury 的私有比赛的题目");
    assert(await checkPermission(permission, user, contestEndedAttendeesPub), "User 可以在比赛结束后查看担任 attendee 的公开比赛的题目");
    assert(await checkPermission(permission, user, contestEndedAttendeesPrv), "User 可以在比赛结束后查看担任 attendee 的私有比赛的题目");
    assert(await checkPermission(permission, user, contestEndedGuestsPub), "User 可以在比赛结束后查看其他的公开比赛的题目");
    assert(!(await checkPermission(permission, user, contestEndedGuestsPrv)), "User 不可以在比赛结束后查看其他的私有比赛的题目");

    assert(await checkPermission(permission, banned, contestEndedModsPub), "Banned 可以在比赛结束后查看担任 mod 的公开比赛的题目");
    assert(await checkPermission(permission, banned, contestEndedModsPrv), "Banned 可以在比赛结束后查看担任 mod 的私有比赛的题目");
    assert(await checkPermission(permission, banned, contestEndedJuriesPub), "Banned 可以在比赛结束后查看担任 jury 的公开比赛的题目");
    assert(await checkPermission(permission, banned, contestEndedJuriesPrv), "Banned 可以在比赛结束后查看担任 jury 的私有比赛的题目");
    assert(await checkPermission(permission, banned, contestEndedAttendeesPub), "Banned 可以在比赛结束后查看担任 attendee 的公开比赛的题目");
    assert(await checkPermission(permission, banned, contestEndedAttendeesPrv), "Banned 可以在比赛结束后查看担任 attendee 的私有比赛的题目");
    assert(await checkPermission(permission, banned, contestEndedGuestsPub), "Banned 可以在比赛结束后查看其他的公开比赛的题目");
    assert(!(await checkPermission(permission, banned, contestEndedGuestsPrv)), "Banned 不可以在比赛结束后查看其他的私有比赛的题目");

    assert(await checkPermission(permission, guest, contestEndedGuestsPub), "Guest 可以在比赛结束后查看其他的公开比赛的题目");
    assert(!(await checkPermission(permission, guest, contestEndedGuestsPrv)), "Guest 不可以在比赛结束后查看其他的私有比赛的题目");
  });
});
