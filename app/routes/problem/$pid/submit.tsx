import { ActionFunction, Form, LoaderFunction, redirect } from "remix";
import { db } from "~/utils/db.server";
import { s3 } from "~/utils/s3.server";
import { invariant } from "~/utils/invariant";
import { codeScheme, idScheme } from "~/utils/scheme";
import { findSessionUid } from "~/utils/sessions";
import { judge } from "~/utils/judge.server";

export const loader: LoaderFunction = async ({ request }) => {
  const self = await findSessionUid(request);

  if (!self) {
    return redirect("/login");
  }

  return null;
};

export const action: ActionFunction = async ({ params, request }) => {
  const uid = await findSessionUid(request);

  if (!uid) {
    return redirect("/login");
  }

  const pid = invariant(idScheme.safeParse(params.pid), { status: 404 });

  const form = await request.formData();
  const code = invariant(codeScheme.safeParse(form.get("code")));

  const { rid } = await db.record.create({
    data: { pid, uid },
    select: { rid: true },
  });

  await s3.writeFile(`/record/${rid}`, Buffer.from(code));
  judge.push({ rid });

  return redirect(`/record/${rid}`);
};

export default function ProblemSubmit() {
  return (
    <>
      <Form method="post">
        <textarea name="code" placeholder="#include <...>" required />
        <button>提交捏</button>
      </Form>
    </>
  );
}
