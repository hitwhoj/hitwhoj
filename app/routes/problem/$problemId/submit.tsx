import type {
  ActionFunction,
  LoaderFunction,
  MetaFunction,
} from "@remix-run/node";
import { redirect } from "@remix-run/node";
import { Form } from "@remix-run/react";
import { db } from "~/utils/server/db.server";
import { s3 } from "~/utils/server/s3.server";
import { invariant } from "~/utils/invariant";
import { codeScheme, idScheme, languageScheme } from "~/utils/scheme";
import { Button, Input, Space, Select } from "@arco-design/web-react";
import { useState } from "react";
import type { Problem } from "@prisma/client";
import { findSessionUid } from "~/utils/sessions";
import { permissionProblemSubmit } from "~/utils/permission/problem";
import { judge } from "~/utils/server/judge.server";
import { assertPermission } from "~/utils/permission";
const TextArea = Input.TextArea;

type LoaderData = {
  problem: Pick<Problem, "title">;
};

export const loader: LoaderFunction<LoaderData> = async ({
  params,
  request,
}) => {
  const problemId = invariant(idScheme, params.problemId, { status: 404 });
  await assertPermission(permissionProblemSubmit, request, problemId);

  const problem = await db.problem.findUnique({
    where: { id: problemId },
    select: { title: true },
  });

  if (!problem) {
    throw new Response("Problem not found", { status: 404 });
  }

  return { problem };
};

export const meta: MetaFunction<LoaderData> = ({ data }) => ({
  title: `提交题目: ${data?.problem.title} - HITwh OJ`,
});

export const action: ActionFunction<Response> = async ({ request, params }) => {
  const problemId = invariant(idScheme, params.problemId, { status: 404 });
  await assertPermission(permissionProblemSubmit, request, problemId);

  const self = await findSessionUid(request);

  const form = await request.formData();
  const code = invariant(codeScheme, form.get("code"));
  const language = invariant(languageScheme, form.get("language"));

  const { id: recordId } = await db.record.create({
    data: {
      language,
      submitter: { connect: { id: self } },
      problem: { connect: { id: problemId } },
    },
    select: { id: true },
  });

  await s3.writeFile(`/record/${recordId}`, Buffer.from(code));
  judge.push(recordId);

  return redirect(`/record/${recordId}`);
};

export default function ProblemSubmit() {
  const [language, setLanguage] = useState("");
  return (
    <Form method="post" style={{ marginTop: "25px" }}>
      <Space
        direction="vertical"
        size="medium"
        style={{ display: "flex", marginTop: "10px" }}
      >
        <Space direction="horizontal" size="medium" style={{ display: "flex" }}>
          <Select
            placeholder="Select a language"
            style={{ width: "10rem" }}
            options={[
              { value: "c", label: "C" },
              { value: "cpp", label: "C++" },
              { value: "java", label: "Java" },
            ]}
            onChange={(value) => setLanguage(value)}
          />
          <Button type="primary" htmlType="submit">
            提交捏
          </Button>
          <input type="hidden" name="language" value={language} />
        </Space>
        <TextArea
          name="code"
          placeholder="Paste your code here desu~"
          required
          autoSize={{
            minRows: 10,
            maxRows: 20,
          }}
        />
      </Space>
    </Form>
  );
}

export { ErrorBoundary } from "~/src/ErrorBoundary";
export { CatchBoundary } from "~/src/CatchBoundary";
