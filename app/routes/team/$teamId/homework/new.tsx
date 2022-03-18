import { Response } from "node-fetch";
import { Form, ActionFunction, redirect } from "remix";
import { db } from "~/utils/db.server";
import { findSessionUid } from "~/utils/sessions";
type ProblemSetData = {
  sid: number;
}[];

export const action: ActionFunction = async ({ params, request }) => {
  const teamId = params.teamId ? params.teamId : "";
  const form = await request.formData();
  let tmp = form.get("name")?.toString();
  const name: string = tmp ? tmp : "";
  const description = form.get("description")?.toString();
  const ddl: Date = new Date(form.get("ddl")?.toString() as string);
  const problemsetsIdstr = form.get("problemsets")?.toString().split(",");
  var problemsetsId = problemsetsIdstr?.map(Number);
  if (!problemsetsId) {
    return new Response("problemsets is missing", { status: 400 });
  }

  var problems: ProblemSetData = [];
  for (let i = 0; i < problemsetsId.length; i++) {
    problems.push({ sid: problemsetsId[i] });
  }
  const uid = await findSessionUid(request);
  if (!uid) {
    throw new Response("not log in", { status: 400 });
  }
  await db.team
    .update({
      data: {
        homeworks: {
          create: {
            ddl: ddl,
            name: name,
            description: description,
            createdAt: new Date(Date.now()),
            updatedAt: new Date(Date.now()),
            creator: {
              connect: { uid: uid },
            },
            problemsets: {
              connect: problems,
            },
          },
        },
      },
      where: {
        tid: teamId,
      },
    })
    .catch(() => {
      throw new Response("add homework fail", { status: 500 });
    })
    .then(() => {
      redirect(`/team/${teamId}/homework`);
    });

  return redirect(`/team/${teamId}/homework`);
};

export default function newHomework() {
  return (
    <>
      <h3>New Homework</h3>
      <div>你真的要这样做吗？</div>
      <Form method="post" style={{ display: "flex", flexDirection: "column" }}>
        <input type="text" name="name" placeholder="name" required />
        <textarea
          name="description"
          id="description"
          cols={30}
          rows={10}
        ></textarea>
        <input type="datetime-local" name="ddl" />
        <input
          type="text"
          name="problemsets"
          placeholder="problemsetsId(join with',')"
          required
        />

        <button type="submit">New</button>
      </Form>
    </>
  );
}
