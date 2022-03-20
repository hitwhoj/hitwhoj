import { Form, redirect, ActionFunction } from "remix";
import { db } from "~/utils/db.server";
import { findSessionUid } from "~/utils/sessions";

export const action: ActionFunction = async ({ params, request }) => {
  const userId = await findSessionUid(request);
  const form = await request.formData();
  const teamId = params.teamId;
  const actionType = form.get("submit")?.toString();
  if (!actionType) {
    throw new Response("submit fail", { status: 500 });
  }
  if (!teamId) {
    throw new Response("team Id is missing", { status: 500 });
  }
  if (actionType == "dissolve") {
    const creator = await db.team
      .findUnique({
        where: {
          tid: teamId,
        },
        select: {
          creatorId: true,
        },
      })
      .catch(() => {
        throw new Response("team search fail", { status: 500 });
      });
    if (!creator) {
      throw new Response("team search fail", { status: 500 });
    }
    if (creator.creatorId != userId) {
      throw new Response(
        "permisson denied:only team creator can dissolve team",
        { status: 500 }
      );
    }

    await db.team
      .delete({
        where: {
          tid: teamId,
        },
      })
      .catch((error) => {
        console.log(error);
        throw new Response("permisson fail:database fail", { status: 500 });
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
