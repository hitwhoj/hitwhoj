import { Form, ActionFunction, redirect } from "remix";
import { User, TeamMember } from "@prisma/client";
import { db } from "~/utils/db.server";

enum ActionType {
  AddMember = "addMember",
  DeleteMember = "deleteMember",
}
type userId = Pick<User, "uid">[];

type memberId = Pick<TeamMember, "memberId" | "teamId">[];

export const action: ActionFunction = async ({ params, request }) => {
  const teamId = params.teamId ? params.teamId : "";
  const form = await request.formData();
  const Members = form.get("Members")?.toString().split(",");
  const _action = form.get("_action");
  var userIds = Members?.map(Number);
  if (!userIds) {
    return new Response("userId is missing", { status: 400 });
  }

  switch (_action) {
    case ActionType.AddMember: {
      var users: userId = [];
      for (let i = 0; i < userIds.length; i++) {
        users.push({ uid: userIds[i] });
        console.log(users[i]);
      }

      for (let i = 0; i < users.length; i++) {
        await db.team.update({
          data: {
            members: {
              create: [
                {
                  member: { connect: users[i] },
                },
              ],
            },
          },
          where: {
            tid: Number(teamId),
          },
        });
      }
      break;
    }

    case ActionType.DeleteMember: {
      var members: memberId = [];
      for (let i = 0; i < userIds.length; i++) {
        members.push({ memberId: userIds[i], teamId: Number(teamId) });
      }
      for (let i = 0; i < members.length; i++)
        await db.team.update({
          data: {
            members: {
              deleteMany: members,
            },
          },
          where: {
            tid: Number(teamId),
          },
        });
      break;
    }
  }

  return redirect(`/team/${teamId}/members`);
};

export default function MemberEdit() {
  return (
    <>
      <p>编辑成员</p>
      <Form method="post" style={{ display: "flex", flexDirection: "column" }}>
        <input
          type="text"
          name="Members"
          placeholder="memberId(join with',')"
          required
        />

        <button type="submit" name="_action" value={ActionType.AddMember}>
          New
        </button>
        <button type="submit" name="_action" value={ActionType.DeleteMember}>
          Del
        </button>
      </Form>
    </>
  );
}
