import {
  Button,
  Drawer,
  List,
  Message,
  Select,
  Space,
  Spin,
  Typography,
} from "@arco-design/web-react";
import Editor, { loader as monacoLoader } from "@monaco-editor/react";
import type { Problem, Record } from "@prisma/client";
import type {
  ActionFunction,
  LinksFunction,
  LoaderFunction,
} from "@remix-run/node";
import {
  Form,
  Link,
  useActionData,
  useLoaderData,
  useParams,
  useTransition,
} from "@remix-run/react";
import { Markdown } from "~/src/Markdown";
import { ProblemMemoryLimitTag } from "~/src/problem/ProblemMemoryLimitTag";
import { ProblemTimeLimitTag } from "~/src/problem/ProblemTimeLimitTag";
import { invariant } from "~/utils/invariant";
import {
  codeScheme,
  problemRankScheme,
  idScheme,
  languageScheme,
} from "~/utils/scheme";
import { db } from "~/utils/server/db.server";
import contestStyle from "~/styles/contest.css";
import { IconHistory, IconSend } from "@arco-design/web-react/icon";
import { findSessionUid, findSessionUserOptional } from "~/utils/sessions";
import { s3 } from "~/utils/server/s3.server";
import { judge } from "~/utils/server/judge.server";
import { useContext, useEffect, useState } from "react";
import { RecordStatus } from "~/src/record/RecordStatus";
import { RecordTimeMemory } from "~/src/record/RecordTimeMemory";
import { ThemeContext } from "~/utils/context/theme";

export const links: LinksFunction = () => [
  { rel: "stylesheet", href: contestStyle },
];

type LoaderData = {
  problem: Pick<Problem, "title" | "description" | "timeLimit" | "memoryLimit">;
  records: Pick<Record, "id" | "score" | "status" | "time" | "memory">[];
};

export const loader: LoaderFunction<LoaderData> = async ({
  request,
  params,
}) => {
  const contestId = invariant(idScheme, params.contestId, { status: 404 });
  const rank =
    invariant(problemRankScheme, params.rank, { status: 404 }).charCodeAt(0) -
    0x40;
  const self = await findSessionUserOptional(request);

  const problem = await db.contestProblem.findUnique({
    where: {
      contestId_rank: {
        contestId,
        rank,
      },
    },
    select: {
      problemId: true,
      problem: {
        select: {
          title: true,
          description: true,
          timeLimit: true,
          memoryLimit: true,
        },
      },
    },
  });

  if (!problem) {
    throw new Response("Problem not found", { status: 404 });
  }

  const records = self
    ? await db.record.findMany({
        where: {
          contestId,
          problemId: problem.problemId,
          submitterId: self.id,
        },
        orderBy: {
          submittedAt: "desc",
        },
        select: {
          id: true,
          score: true,
          status: true,
          time: true,
          memory: true,
        },
      })
    : [];

  return {
    problem: problem.problem,
    records,
  };
};

type ActionData = {
  recordId: number;
};

export const action: ActionFunction<ActionData> = async ({
  request,
  params,
}) => {
  const contestId = invariant(idScheme, params.contestId, { status: 404 });
  const rank =
    invariant(problemRankScheme, params.rank, { status: 404 }).charCodeAt(0) -
    0x40;

  const problem = await db.contestProblem.findUnique({
    where: { contestId_rank: { contestId, rank } },
    select: { problemId: true },
  });

  if (!problem) {
    throw new Response("Problem not found", { status: 404 });
  }

  const self = await findSessionUid(request);

  const form = await request.formData();
  const code = invariant(codeScheme, form.get("code"));
  const language = invariant(languageScheme, form.get("language"));

  const { id: recordId } = await db.record.create({
    data: {
      language,
      submitter: { connect: { id: self } },
      problem: { connect: { id: problem.problemId } },
      contest: { connect: { id: contestId } },
    },
    select: { id: true },
  });

  await s3.writeFile(`/record/${recordId}`, Buffer.from(code));
  await judge.push(recordId);

  return { recordId };
};

export default function ContestProblemView() {
  const { problem, records } = useLoaderData<LoaderData>();
  const actionData = useActionData<ActionData>();
  const { theme } = useContext(ThemeContext);
  const { contestId, rank } = useParams();

  const { state } = useTransition();
  const isSubmitting = state === "submitting";

  useEffect(() => {
    if (actionData?.recordId) {
      Message.success("提交成功");
    }
  }, [actionData?.recordId]);

  const [language, setLanguage] = useState("cpp");
  const [code, setCode] = useState(
    "#include <bits/stdc++.h>\n" +
      "using namespace std;\n" +
      "\n" +
      "int main() {\n" +
      "  int a, b;\n" +
      "  cin >> a >> b;\n" +
      "  cout << a + b << endl;\n" +
      "  return 0;\n" +
      "}\n"
  );
  const [visible, setVisible] = useState(false);

  // override monaco loader
  monacoLoader.config({ paths: { vs: "/build/_assets/vs" } });

  // load code from local storage
  useEffect(() => {
    const storedLang = localStorage.getItem(`C${contestId}${rank}.language`);
    if (storedLang) setLanguage(storedLang);
    const storedCode = localStorage.getItem(`C${contestId}${rank}.code`);
    if (storedCode) setCode(storedCode);
  }, []);

  // save code to local storage
  useEffect(() => {
    localStorage.setItem(`C${contestId}${rank}.language`, language);
    localStorage.setItem(`C${contestId}${rank}.code`, code);
  }, [language, code]);

  return (
    <div className="contest-problem">
      <Typography className="left">
        <Typography.Title heading={3}>
          {`${rank}. ${problem.title}`}
        </Typography.Title>

        <Typography.Paragraph>
          <Space>
            <ProblemTimeLimitTag time={problem.timeLimit} />
            <ProblemMemoryLimitTag memory={problem.memoryLimit} />
          </Space>
        </Typography.Paragraph>

        <Typography.Paragraph>
          <Markdown>{problem.description}</Markdown>
        </Typography.Paragraph>
      </Typography>

      <Form method="post" className="right">
        <textarea hidden name="code" value={code} readOnly />
        <Editor
          loading={<Spin />}
          onChange={(code) => setCode(code ?? "")}
          value={code}
          language={language}
          theme={theme === "light" ? "light" : "vs-dark"}
          options={{
            cursorSmoothCaretAnimation: true,
            smoothScrolling: true,
            fontSize: 16,
          }}
        />
        <input type="hidden" name="language" value={language} />
        <Space
          style={{
            display: "flex",
            justifyContent: "space-between",
            padding: 10,
          }}
        >
          <Select
            value={language}
            onChange={(language) => setLanguage(language)}
            style={{ width: 150 }}
            disabled={isSubmitting}
          >
            <Select.Option value="c">C</Select.Option>
            <Select.Option value="cpp">C++</Select.Option>
            <Select.Option value="java">Java</Select.Option>
          </Select>
          <Space>
            <Button icon={<IconHistory />} onClick={() => setVisible(true)}>
              查看记录
            </Button>
            <Button
              type="primary"
              htmlType="submit"
              icon={<IconSend />}
              loading={isSubmitting}
            >
              提交
            </Button>
          </Space>
        </Space>
      </Form>

      <Drawer
        visible={visible}
        width={400}
        footer={null}
        onOk={() => setVisible(false)}
        onCancel={() => setVisible(false)}
        title="提交记录"
      >
        <List
          dataSource={records}
          bordered={false}
          render={(record) => (
            <List.Item key={record.id}>
              <Space
                style={{ display: "flex", justifyContent: "space-between" }}
              >
                <Link to={`/record/${record.id}`} target="_blank">
                  <RecordStatus status={record.status} />
                </Link>
                <RecordTimeMemory time={record.time} memory={record.memory} />
              </Space>
            </List.Item>
          )}
        />
      </Drawer>
    </div>
  );
}
