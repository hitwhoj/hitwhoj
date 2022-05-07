import type {
  ActionFunction,
  LoaderFunction,
  MetaFunction,
} from "@remix-run/node";
import { json, redirect } from "@remix-run/node";
import { Form } from "@remix-run/react";
import { db } from "~/utils/db.server";
import { s3 } from "~/utils/s3.server";
import { invariant } from "~/utils/invariant";
import { codeScheme, idScheme, languageScheme } from "~/utils/scheme";
import { judge } from "~/utils/judge.server";
import { Button, Input, Space, Select } from "@arco-design/web-react";
import { useState } from "react";
import { guaranteePermission, Permissions } from "~/utils/permission";
import type { Problem } from "@prisma/client";
const TextArea = Input.TextArea;

type LoaderData = {
  problem: Pick<Problem, "title">;
};

export const loader: LoaderFunction = async ({ request, params }) => {
  const pid = invariant(idScheme.safeParse(params.pid), { status: 404 });

  await guaranteePermission(request, Permissions.Problem.Submit, { pid });

  const problem = await db.problem.findUnique({
    where: { pid },
    select: { title: true },
  });

  if (!problem) {
    throw new Response("Problem not found", { status: 404 });
  }

  return json({ problem });
};

export const meta: MetaFunction = ({ data }: { data?: LoaderData }) => ({
  title: `提交题目: ${data?.problem.title} - HITwh OJ`,
});

export const action: ActionFunction = async ({ request, params }) => {
  const pid = invariant(idScheme.safeParse(params.pid), { status: 404 });

  // 检查提交权限，用户必定已经登录
  const uid = (await guaranteePermission(request, Permissions.Problem.Submit, {
    pid,
  }))!;

  const form = await request.formData();
  const code = invariant(codeScheme.safeParse(form.get("code")));
  const language = invariant(languageScheme.safeParse(form.get("language")));

  const { rid } = await db.record.create({
    data: {
      problemId: pid,
      submitterId: uid,
      language,
    },
    select: { rid: true },
  });

  await s3.writeFile(`/record/${rid}`, Buffer.from(code));
  judge.push(rid);

  return redirect(`/record/${rid}`);
};

export default function ProblemSubmit() {
  const [language, setLanguage] = useState("");
  return (
    <Form method="post">
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
