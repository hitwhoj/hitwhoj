import { ActionFunction, Form, LoaderFunction, redirect } from "remix";
import { db } from "~/utils/db.server";
import { s3 } from "~/utils/s3.server";
import { invariant } from "~/utils/invariant";
import { codeScheme, idScheme } from "~/utils/scheme";
import { findSessionUid } from "~/utils/sessions";
import { judge } from "~/utils/judge.server";
import { Button, Input, Space, Select } from "@arco-design/web-react";
import { useState } from "react";
const TextArea = Input.TextArea;

export const loader: LoaderFunction = async ({ request }) => {
  const self = await findSessionUid(request);

  if (!self) {
    return redirect(`/login?redirect=${new URL(request.url).pathname}`);
  }

  return null;
};

export const action: ActionFunction = async ({ params, request }) => {
  const uid = await findSessionUid(request);

  if (!uid) {
    return redirect(`/login?redirect=${new URL(request.url).pathname}`);
  }

  const pid = invariant(idScheme.safeParse(params.pid), { status: 404 });

  const form = await request.formData();
  const code = invariant(codeScheme.safeParse(form.get("code")));
  // const language = invariant(codeScheme.safeParse(form.get("language")));

  const { rid } = await db.record.create({
    data: { pid, uid },
    select: { rid: true },
  });

  await s3.writeFile(`/record/${rid}`, Buffer.from(code));
  judge.push({ rid });

  return redirect(`/record/${rid}`);
};

export default function ProblemSubmit() {
  const [language, setLanguage] = useState("");
  return (
    <>
      <Form method="post">
        <Space
          direction="vertical"
          size="small"
          style={{ display: "flex", marginTop: "10px" }}
        >
          <Space
            direction="horizontal"
            size="medium"
            style={{ display: "flex" }}
          >
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
    </>
  );
}
