import type { ActionFunction, LoaderFunction } from "@remix-run/node";
import { redirect } from "@remix-run/node";
import { Form } from "@remix-run/react";
import { db } from "~/utils/server/db.server";
import { findSessionUid } from "~/utils/sessions";
import { invariant } from "~/utils/invariant";
import { teamNameScheme, descriptionScheme } from "~/utils/scheme";
import { TeamMemberRole } from "@prisma/client";

export const loader: LoaderFunction = async ({ request }) => {
  const userId = await findSessionUid(request);
  if (!userId) {
    throw redirect("/login");
  }
  return null;
};

export const action: ActionFunction<Response> = async ({ request }) => {
  const form = await request.formData();
  const name = invariant(teamNameScheme.safeParse(form.get("name")));
  const description = invariant(
    descriptionScheme.safeParse(form.get("description"))
  );

  if (!name) {
    throw new Response("team name is missing", { status: 400 });
  }
  const userId = await findSessionUid(request);
  if (!userId) {
    throw redirect("/login");
  }
  const { id: teamId } = await db.team.create({
    data: {
      name: name,
      description: description,
      createdAt: new Date(Date.now()),
      members: {
        create: [{ userId: userId, role: TeamMemberRole.Owner }],
      },
    },
  });

  return redirect(`/team/${teamId}`);
};

export default function NewTeam() {
  return (
    <>
      <h3>New Team</h3>

      <Form method="post" style={{ display: "flex", flexDirection: "column" }}>
        <input type="text" name="name" placeholder="Team name" required />
        <textarea
          name="description"
          id="description"
          cols={30}
          rows={10}
          placeholder="description(optional)"
        ></textarea>
        <button type="submit">Create</button>
      </Form>
    </>
  );
}
