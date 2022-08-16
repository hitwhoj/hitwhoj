import assert from "assert";
import { commitSession } from "~/utils/sessions";
import { Request } from "@remix-run/node";

export async function rejects<T>(promise: Promise<T>) {
  try {
    await promise;
  } catch (e) {
    return;
  }
  assert.fail("should reject");
}

export async function resolves<T>(promise: Promise<T>) {
  try {
    await promise;
  } catch (e) {
    assert.fail("should resolve");
  }
}

export async function createRequest(userId: number) {
  return new Request("http://localhost:8080/", {
    headers: { Cookie: `${(await commitSession(userId)).split(";")[0]}` },
  });
}

export const rootUid = 1;
export const adminUid = 2;
export const userUid = 3;
export const bannedUid = 4;
export const rootUid2 = 5;
export const adminUid2 = 6;
export const userUid2 = 7;
export const bannedUid2 = 8;

export const teamA = 1;
export const teamB = 2;
export const teamC = 3;
export const teamD = 4;

export const problemPub = 1;
export const problemPrv = 2;

export const problemTeamAPub = 3;
export const problemTeamAPrv = 4;
export const problemTeamBPub = 5;
export const problemTeamBPrv = 6;
export const problemTeamCPub = 7;
export const problemTeamCPrv = 8;
export const problemTeamDPub = 9;
export const problemTeamDPrv = 10;

export const contestRunningModsPub = 1;
export const contestRunningModsPrv = 2;
export const contestRunningJuriesPub = 3;
export const contestRunningJuriesPrv = 4;
export const contestRunningAttendeesPub = 5;
export const contestRunningAttendeesPrv = 6;
export const contestRunningGuestsPub = 7;
export const contestRunningGuestsPrv = 8;

export const contestNotStartedModsPub = 9;
export const contestNotStartedModsPrv = 10;
export const contestNotStartedJuriesPub = 11;
export const contestNotStartedJuriesPrv = 12;
export const contestNotStartedAttendeesPub = 13;
export const contestNotStartedAttendeesPrv = 14;
export const contestNotStartedGuestsPub = 15;
export const contestNotStartedGuestsPrv = 16;

export const contestEndedModsPub = 17;
export const contestEndedModsPrv = 18;
export const contestEndedJuriesPub = 19;
export const contestEndedJuriesPrv = 20;
export const contestEndedAttendeesPub = 21;
export const contestEndedAttendeesPrv = 22;
export const contestEndedGuestsPub = 23;
export const contestEndedGuestsPrv = 24;

export const problemSetPub = 1;
export const problemSetPrv = 2;
export const problemSetTeamAPub = 3;
export const problemSetTeamAPrv = 4;
export const problemSetTeamBPub = 5;
export const problemSetTeamBPrv = 6;
export const problemSetTeamCPub = 7;
export const problemSetTeamCPrv = 8;
export const problemSetTeamDPub = 9;
export const problemSetTeamDPrv = 10;
