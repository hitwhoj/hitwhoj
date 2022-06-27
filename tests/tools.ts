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

export const contestRunningACMModsPub = 1;
export const contestRunningACMModsPrv = 2;
export const contestRunningACMJuriesPub = 3;
export const contestRunningACMJuriesPrv = 4;
export const contestRunningACMAttendeesPub = 5;
export const contestRunningACMAttendeesPrv = 6;
export const contestRunningACMGuestsPub = 7;
export const contestRunningACMGuestsPrv = 8;

export const contestNotStartedACMModsPub = 9;
export const contestNotStartedACMModsPrv = 10;
export const contestNotStartedACMJuriesPub = 11;
export const contestNotStartedACMJuriesPrv = 12;
export const contestNotStartedACMAttendeesPub = 13;
export const contestNotStartedACMAttendeesPrv = 14;
export const contestNotStartedACMGuestsPub = 15;
export const contestNotStartedACMGuestsPrv = 16;

export const contestEndedACMModsPub = 17;
export const contestEndedACMModsPrv = 18;
export const contestEndedACMJuriesPub = 19;
export const contestEndedACMJuriesPrv = 20;
export const contestEndedACMAttendeesPub = 21;
export const contestEndedACMAttendeesPrv = 22;
export const contestEndedACMGuestsPub = 23;
export const contestEndedACMGuestsPrv = 24;

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
