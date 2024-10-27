import type { ActionArgs, LoaderArgs, MetaFunction } from "@remix-run/node";
import { json } from "@remix-run/node";
import { redirect } from "@remix-run/node";
import { Form, Link } from "@remix-run/react";
import { db } from "~/utils/server/db.server";
import { s3 } from "~/utils/server/s3.server";
import { invariant } from "~/utils/invariant";
import { codeScheme, idScheme, languageScheme } from "~/utils/scheme";
import { findRequestUser } from "~/utils/permission";
import { Privileges } from "~/utils/permission/privilege";
import { Permissions } from "~/utils/permission/permission";
import { findProblemPrivacy, findProblemTeam } from "~/utils/db/problem";
import { judge } from "~/utils/server/judge/manager.server";
import Fullscreen from "~/src/Fullscreen";
import { Markdown } from "~/src/Markdown";
import { useSignalLoaderData } from "~/utils/hooks";
import { useComputed, useSignal } from "@preact/signals-react";
import { VscodeEditor } from "~/src/VscodeEditor";
import type { ChangeEvent } from "react";

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
    select: {
      id: true,
      title: true,
      allowSubmit: true,
      description: true,
      private: true,
      files: { orderBy: { filename: "asc" } },
    },
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
  // 添加一些延迟，防止前端渲染爆炸
  setTimeout(() => judge.push(recordId), 1000);

  return redirect(`/record/${recordId}`);
}

export default function ProblemSubmit() {
  const loaderData = useSignalLoaderData<typeof loader>();
  const problem = useComputed(() => loaderData.value.problem);

  const code = useSignal("");
  const language = useSignal("cpp");

  function changeSelect(e: ChangeEvent<HTMLSelectElement>) {
    language.value = e.currentTarget.value;
    if (language.value === "java") {
      code.value = "public class Main {\n\n}";
    } else {
      code.value = "";
    }
  }

  return (
    <Fullscreen visible={true} className="grid grid-cols-2 bg-base-100">
      <div className="overflow-auto p-4">
        <h1 className="flex justify-between">
          <span>{problem.value.title}</span>
          <button className="btn btn-ghost" onClick={() => history.go(-1)}>
            返回
          </button>
        </h1>

        <Markdown>{problem.value.description}</Markdown>

        {problem.value.files.length > 0 && (
          <>
            <h2>相关文件</h2>

            <ul>
              {problem.value.files.map((file) => (
                <li key={file.id}>
                  <Link
                    className="link"
                    to={`/file/${file.id}`}
                    target="_blank"
                  >
                    {file.filename}
                  </Link>
                </li>
              ))}
            </ul>
          </>
        )}
      </div>

      <div className="flex flex-col">
        <div className="flex-1">
          <VscodeEditor code={code} language={language.value} />
        </div>
        <div className="p-2">
          <Form method="post" className="flex justify-between">
            <select
              className="select select-bordered"
              name="language"
              onChange={(e) => changeSelect(e)}
              value={language.value}
              required
            >
              <option value="c">C</option>
              <option value="cpp">C++</option>
              <option value="py">Python3</option>
              <option value="java">Java</option>
            </select>
            <textarea
              className="textarea textarea-bordered"
              name="code"
              required
              value={code.value}
              hidden
              readOnly
            />
            <button className="btn btn-primary" type="submit">
              提交
            </button>
          </Form>
        </div>
      </div>
    </Fullscreen>
  );
}

export { ErrorBoundary } from "~/src/ErrorBoundary";
export { CatchBoundary } from "~/src/CatchBoundary";
