import type { ActionFunction } from "@remix-run/node";
import { redirect } from "@remix-run/node";
import { Form } from "@remix-run/react";
import { db } from "~/utils/server/db.server";
import { findSessionUid } from "~/utils/sessions";
import { invariant } from "~/utils/invariant";
import { idScheme } from "~/utils/scheme";
import { TeamMemberRole } from "@prisma/client";

export const action: ActionFunction<Response> = async ({ params, request }) => {
  const teamId = invariant(idScheme, params.teamId);
  const self = await findSessionUid(request);
  if (!self) {
    throw redirect(`/login?redirect=${new URL(request.url).pathname}`);
  }

  if (!teamId) {
    throw new Response("team Id is missing", { status: 400 });
  }

  const teamMember = await db.teamMember.findUnique({
    where: { userId_teamId: { teamId, userId: self } },
    select: { role: true },
  });

  if (!teamMember) {
    throw new Response("You are not in this team", { status: 403 });
  }

  if (teamMember.role !== TeamMemberRole.Owner) {
    throw new Response("Permisson denied: only owner can dissolve team", {
      status: 403,
    });
  }

  await db.teamMember.deleteMany({
    where: { teamId },
  });
  await db.team.delete({
    where: { id: teamId },
  });

  return redirect(`/team`);
};

export default function DissolveTeam() {
  return (
    <>
      <h2>Dissolve Team</h2>
      <div>你最好知道你在做什么</div>
      <Form method="post" style={{ display: "flex", flexDirection: "column" }}>
        <button type="submit" name="submit" value="dissolve">
          开弓没有回头箭
        </button>
      </Form>
    </>
  );
}
