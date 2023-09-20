import type { ActionArgs, LoaderArgs, MetaFunction } from "@remix-run/node";
import { json } from "@remix-run/node";
import { redirect } from "@remix-run/node";
import { Form } from "@remix-run/react";
import { db } from "~/utils/server/db.server";
import { s3 } from "~/utils/server/s3.server";
import { invariant } from "~/utils/invariant";
import { codeScheme, idScheme, languageScheme } from "~/utils/scheme";
import { findRequestUser } from "~/utils/permission";
import { Privileges } from "~/utils/permission/privilege";
import { Permissions } from "~/utils/permission/permission";
import { findProblemPrivacy, findProblemTeam } from "~/utils/db/problem";
import { judge } from "~/utils/server/judge/manager.server";

export async function loader({ request, params }: LoaderArgs) {
  const problemId = invariant(idScheme, params.problemId, { status: 404 });
  const self = await findRequestUser(request);
  await self.checkPrivilege(Privileges.PRIV_OPERATE);
  await self
    .team(await findProblemTeam(problemId))
    .checkPermission(
      (await findProblemPrivacy(problemId))
        ? Permissions.PERM_VIEW_PROBLEM
        : Permissions.PERM_VIEW_PROBLEM_PUBLIC
    );

  const problem = await db.problem.findUnique({
    where: { id: problemId },
    select: { title: true, allowSubmit: true },
  });

  if (!problem) {
    throw new Response("Problem not found", { status: 404 });
  }

  if (!problem.allowSubmit) {
    throw new Response("Problem not allow submit", { status: 403 });
  }

  return json({ problem });
}

export const meta: MetaFunction<typeof loader> = ({ data }) => ({
  title: `提交题目: ${data?.problem.title} - HITwh OJ`,
});

export async function action({ request, params }: ActionArgs) {
  const problemId = invariant(idScheme, params.problemId, { status: 404 });
  const self = await findRequestUser(request);
  await self.checkPrivilege(Privileges.PRIV_OPERATE);
  await self
    .team(await findProblemTeam(problemId))
    .checkPermission(
      (await findProblemPrivacy(problemId))
        ? Permissions.PERM_VIEW_PROBLEM
        : Permissions.PERM_VIEW_PROBLEM_PUBLIC
    );

  const problem = await db.problem.findUnique({
    where: { id: problemId },
    select: { allowSubmit: true },
  });

  if (!problem) {
    throw new Response("Problem not found", { status: 404 });
  }

  if (!problem.allowSubmit) {
    throw new Response("Problem not allow submit", { status: 403 });
  }

  const form = await request.formData();
  const code = invariant(codeScheme, form.get("code"));
  const language = invariant(languageScheme, form.get("language"));

  const { id: recordId } = await db.record.create({
    data: {
      language,
      problemId,
      submitterId: self.userId!,
    },
    select: { id: true },
  });

  await s3.writeFile(`/record/${recordId}`, Buffer.from(code));
  judge.push(recordId);

  return redirect(`/record/${recordId}`);
}

export default function ProblemSubmit() {
  return (
    <Form method="post" className="form-control gap-4">
      <div className="form-control w-full max-w-xs">
        <label className="label">
          <span className="label-text">语言</span>
        </label>
        <select
          className="select select-bordered"
          name="language"
          defaultValue=""
          required
        >
          <option value="" disabled>
            选择代码语言
          </option>
          <option value="c">C</option>
          <option value="cpp">C++</option>
          <option value="py">Python3</option>
        </select>
      </div>

      <div className="form-control">
        <label className="label">
          <span className="label-text">代码</span>
        </label>
        <textarea
          className="textarea textarea-bordered"
          name="code"
          placeholder="Paste your code here desu~"
          required
        />
      </div>

      <div className="form-control w-full max-w-xs">
        <button className="btn btn-primary" type="submit">
          提交
        </button>
      </div>
    </Form>
  );
}

export { ErrorBoundary } from "~/src/ErrorBoundary";
export { CatchBoundary } from "~/src/CatchBoundary";
