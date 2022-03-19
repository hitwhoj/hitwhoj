import { Form, ActionFunction, redirect } from "remix";
import { db } from "~/utils/db.server";

type userId = {
  uid: number;
}[];

export const action: ActionFunction = async ({ params, request }) => {
  const teamId = params.teamId ? params.teamId : "";
  const form = await request.formData();
  const newMembers = form.get("newMembers")?.toString().split(",");

  var userIds = newMembers?.map(Number);
  if (!userIds) {
    return new Response("userId is missing", { status: 400 });
  }

  var users: userId = [];
  for (let i = 0; i < userIds.length; i++) {
    users.push({ uid: userIds[i] });
  }

  console.log(users);
  for (let i = 0; i < users.length; i++)
    await db.team
      .update({
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
          tid: teamId,
        },
      })
      .catch((error) => {
        console.log(error);
        throw new Response("new member fail", { status: 500 });
      });

  return redirect(`/team/${teamId}/members`);
};

export default function NewMember() {
  return (
    <>
      <div>New Member</div>
      <Form method="post" style={{ display: "flex", flexDirection: "column" }}>
        <input
          type="text"
          name="newMembers"
          placeholder="memberId(join with',')"
          required
        />

        <button type="submit">New</button>
      </Form>
    </>
  );
}
