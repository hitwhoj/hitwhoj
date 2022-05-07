import type { ActionFunction, LoaderFunction } from "@remix-run/node";
import { redirect } from "@remix-run/node";
import { Form } from "@remix-run/react";
import { db } from "~/utils/db.server";
import { findSessionUid } from "~/utils/sessions";
import { invariant } from "~/utils/invariant";
import { teamNameScheme, descriptionScheme } from "~/utils/scheme";

export const loader: LoaderFunction = async ({ request }) => {
  const userId = await findSessionUid(request);
  if (!userId) {
    return redirect("/login");
  }
  return null;
};

export const action: ActionFunction = async ({ request }) => {
  const form = await request.formData();
  const name = invariant(teamNameScheme.safeParse(form.get("name")));
  const description = invariant(
    descriptionScheme.safeParse(form.get("description"))
  );

  if (!name) {
    return new Response("team name is missing", { status: 400 });
  }
  const userId = await findSessionUid(request);
  if (!userId) {
    return redirect("/login");
  }
  const { tid } = await db.team.create({
    data: {
      name: name,
      description: description,
      createdAt: new Date(Date.now()),
      creatorId: userId,
      members: {
        create: [{ memberId: userId }],
      },
    },
  });

  return redirect(`/team/${tid}`);
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
