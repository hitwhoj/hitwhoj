import { Form, redirect, ActionFunction } from "remix";
import { db } from "~/utils/db.server";
import { findSessionUid } from "~/utils/sessions";
import { invariant } from "~/utils/invariant";
import {idScheme} from "~/utils/scheme"


export const action: ActionFunction = async ({ params, request }) => {
  const userId = await findSessionUid(request);
  if (!userId) {
    return redirect("/login");
  }

  const form = await request.formData();
  const teamId = invariant(idScheme.safeParse(params.teamId))   ;
  const actionType = form.get("submit")?.toString();
  if (!actionType) {
    throw new Response("submit fail", { status: 400 });
  }
  if (!teamId) {
    throw new Response("team Id is missing", { status: 400 });
  }
  if (actionType == "dissolve") {
    const creator = await db.team.findUnique({
      where: {
        tid: Number(teamId),
      },
      select: {
        creatorId: true,
      },
    });

    if (!creator) {
      throw new Response("team search fail", { status: 400 });
    }
    if (creator.creatorId != userId) {
      throw new Response(
        "permisson denied:only team creator can dissolve team",
        { status: 400 }
      );
    }

    await db.team.delete({
      where: {
        tid: Number(teamId),
      },
    });
  }

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
