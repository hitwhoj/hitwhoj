import { ActionFunction, Form, LoaderFunction, redirect } from "remix";
import { db } from "~/utils/db.server";
import { s3 } from "~/utils/s3.server";
import { invariant } from "~/utils/invariant";
import { codeScheme, idScheme } from "~/utils/scheme";
import { judge } from "~/utils/judge.server";
import { guaranteePermission, Permissions } from "~/utils/permission";

export const loader: LoaderFunction = async ({ request, params }) => {
  const pid = invariant(idScheme.safeParse(params.pid), { status: 404 });

  await guaranteePermission(request, Permissions.Problem.Submit, { pid });

  return null;
};

export const action: ActionFunction = async ({ request, params }) => {
  const pid = invariant(idScheme.safeParse(params.pid), { status: 404 });

  // 检查提交权限，用户必定已经登录
  const uid = (await guaranteePermission(request, Permissions.Problem.Submit, {
    pid,
  }))!;

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
