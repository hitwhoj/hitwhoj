import { Form, ActionFunction, redirect } from "remix";
import { db } from "~/utils/db.server";

type userId = {
  memberId: number;
  teamId: string;
}[];

export const action: ActionFunction = async ({ params, request }) => {
  const teamId = params.teamId ? params.teamId : "";
  const form = await request.formData();
  const delMembers = form.get("delMembers")?.toString().split(",");

  var userIds = delMembers?.map(Number);
  if (!userIds) {
    return new Response("userId is missing", { status: 400 });
  }

  var users: userId = [];
  for (let i = 0; i < userIds.length; i++) {
    users.push({ memberId: userIds[i], teamId: teamId });
  }
  const creatorId = await db.team
    .findUnique({
      where: {
        tid: teamId,
      },
      select: {
        creatorId: true,
      },
    })
    .catch(() => {
      throw new Response("del member fail", { status: 500 });
    });
  if (!creatorId?.creatorId) {
    throw new Response("del member fail", { status: 500 });
  }

  for (let i = 0; i < users.length; i++) {
    if (users[i].memberId == creatorId.creatorId)
      throw new Response("del member fail:can not del team creator", {
        status: 500,
      });
  }

  for (let i = 0; i < users.length; i++)
    await db.team
      .update({
        data: {
          members: {
            deleteMany: users,
          },
        },
        where: {
          tid: teamId,
        },
      })
      .catch((error) => {
        console.log(error);
        throw new Response("del member fail", { status: 500 });
      });

  return redirect(`/team/${teamId}/members`);
};

export default function DelMember() {
  return (
    <>
      <h3>Del Member</h3>
      <Form method="post" style={{ display: "flex", flexDirection: "column" }}>
        <input
          type="text"
          name="delMembers"
          placeholder="memberId(join with',')"
          required
        />

        <button type="submit">Delete</button>
      </Form>
    </>
  );
}
