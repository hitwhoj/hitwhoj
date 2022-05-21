import type { ActionFunction } from "@remix-run/node";
import { Form } from "@remix-run/react";
import { db } from "~/utils/server/db.server";
import { invariant } from "~/utils/invariant";
import { idScheme } from "~/utils/scheme";

enum ActionType {
  AddMember = "addMember",
  DeleteMember = "deleteMember",
}

export const action: ActionFunction = async ({ params, request }) => {
  const teamId = invariant(idScheme, params.teamId);
  const form = await request.formData();

  const member = invariant(idScheme, form.get("member"));
  const _action = form.get("_action");

  switch (_action) {
    case ActionType.AddMember: {
      await db.team.update({
        where: { id: teamId },
        data: {
          members: {
            connectOrCreate: {
              where: { userId_teamId: { userId: member, teamId } },
              create: { userId: member },
            },
          },
        },
      });

      return null;
    }

    case ActionType.DeleteMember: {
      await db.team.update({
        where: { id: teamId },
        data: {
          members: {
            disconnect: {
              userId_teamId: {
                userId: member,
                teamId,
              },
            },
          },
        },
      });

      return null;
    }
  }

  throw new Response("Invalid action", { status: 400 });
};

export default function MemberEdit() {
  return (
    <>
      <p>编辑成员</p>
      <Form method="post" style={{ display: "flex", flexDirection: "column" }}>
        <input type="text" name="member" placeholder="User ID" required />
        <button type="submit" name="_action" value={ActionType.AddMember}>
          Add
        </button>
        <button type="submit" name="_action" value={ActionType.DeleteMember}>
          Del
        </button>
      </Form>
    </>
  );
}
