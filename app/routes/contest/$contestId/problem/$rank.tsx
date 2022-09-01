import {
  Alert,
  Button,
  Drawer,
  Grid,
  List,
  Message,
  ResizeBox,
  Select,
  Space,
  Spin,
  Typography,
  Link as ArcoLink,
} from "@arco-design/web-react";
import Editor, { loader as monacoLoader } from "@monaco-editor/react";
import type { ActionArgs, LinksFunction, LoaderArgs } from "@remix-run/node";
import { json } from "@remix-run/node";
import {
  Form,
  Link,
  useActionData,
  useLoaderData,
  useParams,
  useTransition,
} from "@remix-run/react";
import { Markdown } from "~/src/Markdown";
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
import { s3 } from "~/utils/server/s3.server";
import { useContext, useEffect, useState } from "react";
import { RecordStatus } from "~/src/record/RecordStatus";
import { RecordTimeMemory } from "~/src/record/RecordTimeMemory";
import { ThemeContext } from "~/utils/context/theme";
import type { MessageType } from "../events";
import { findRequestUser } from "~/utils/permission";
import {
  findContestProblemIdByRank,
  findContestStatus,
  findContestTeam,
} from "~/utils/db/contest";
import { Permissions } from "~/utils/permission/permission";
import { Privileges } from "~/utils/permission/privilege";
import { filter } from "rxjs";
import { fromEventSource } from "~/utils/eventSource";
import { judge } from "~/utils/server/judge/manager.server";

// 加载特殊页面样式
export const links: LinksFunction = () => [
  { rel: "stylesheet", href: contestStyle },
];

export async function loader({ request, params }: LoaderArgs) {
  const contestId = invariant(idScheme, params.contestId, { status: 404 });
  const rank =
    invariant(problemRankScheme, params.rank, { status: 404 }).charCodeAt(0) -
    0x40;
  const self = await findRequestUser(request);
  const status = await findContestStatus(contestId);
  await self
    .team(await findContestTeam(contestId))
    .contest(contestId)
    .checkPermission(
      status === "Pending"
        ? Permissions.PERM_VIEW_CONTEST_PROBLEMS_BEFORE
        : status === "Running"
        ? Permissions.PERM_VIEW_CONTEST_PROBLEMS_DURING
        : Permissions.PERM_VIEW_CONTEST_PROBLEMS_AFTER
    );

  const problem = await db.contestProblem.findUnique({
    where: {
      contestId_rank: {
        contestId,
        rank,
      },
    },
    select: {
      problem: {
        select: {
          id: true,
          title: true,
          description: true,
          timeLimit: true,
          memoryLimit: true,
          files: {
            select: {
              id: true,
              filename: true,
            },
          },
        },
      },
      contest: {
        select: {
          id: true,
          beginTime: true,
          endTime: true,
        },
      },
    },
  });

  if (!problem) {
    throw new Response("Problem not found", { status: 404 });
  }

  const records = self.userId
    ? await db.record.findMany({
        where: {
          contestId,
          problemId: problem.problem.id,
          submitterId: self.userId,
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

  return json({
    records,
    problem: problem.problem,
    contest: problem.contest,
  });
}

export async function action({ request, params }: ActionArgs) {
  const contestId = invariant(idScheme, params.contestId, { status: 404 });
  const rank =
    invariant(problemRankScheme, params.rank, { status: 404 }).charCodeAt(0) -
    0x40;
  const self = await findRequestUser(request);
  await self.checkPrivilege(Privileges.PRIV_OPERATE);
  const status = await findContestStatus(contestId);
  await self
    .team(await findContestTeam(contestId))
    .contest(contestId)
    .checkPermission(
      status === "Pending"
        ? Permissions.PERM_VIEW_CONTEST_PROBLEMS_BEFORE
        : status === "Running"
        ? Permissions.PERM_VIEW_CONTEST_PROBLEMS_DURING
        : Permissions.PERM_VIEW_CONTEST_PROBLEMS_AFTER
    );

  const problemId = await findContestProblemIdByRank(contestId, rank);

  const form = await request.formData();
  const code = invariant(codeScheme, form.get("code"));
  const language = invariant(languageScheme, form.get("language"));

  const { id: recordId } = await db.record.create({
    data: {
      language,
      problemId,
      contestId,
      submitterId: self.userId!,
    },
    select: { id: true },
  });

  await s3.writeFile(`/record/${recordId}`, Buffer.from(code));
  judge.push(recordId);

  return json({ recordId });
}

// override monaco loader
monacoLoader.config({ paths: { vs: "/build/_assets/vs" } });

export default function ContestProblemView() {
  const {
    problem,
    records: _records,
    contest,
  } = useLoaderData<typeof loader>();
  const actionData = useActionData<typeof action>();
  const { theme } = useContext(ThemeContext);
  const { contestId, rank } = useParams();

  const { state } = useTransition();
  const isSubmitting = state === "submitting";

  useEffect(() => {
    if (actionData?.recordId) {
      Message.success("提交成功");
      setVisible(true);
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

  const now = new Date();
  const isNotStarted = now < new Date(contest.beginTime);
  const isEnded = now > new Date(contest.endTime);

  const [records, setRecords] = useState(_records);

  useEffect(() => {
    const subscription = fromEventSource<MessageType>(
      `/contest/${contestId}/events`
    )
      .pipe(filter((message) => message.problemId === problem.id))
      .subscribe((message) => {
        setRecords((records) => {
          const found = records.find((record) => record.id === message.id);
          if (found) {
            // 如果 record id 已经存在，则更新现有的记录
            found.time = message.time;
            found.score = message.score;
            found.memory = message.memory;
            found.status = message.status;
            return records;
          } else {
            // 否则添加新的记录
            return [
              {
                id: message.id,
                time: message.time,
                score: message.score,
                memory: message.memory,
                status: message.status,
              },
              ...records,
            ];
          }
        });
      });

    return () => subscription.unsubscribe();
  }, []);

  return (
    <>
      <ResizeBox.Split
        style={{ height: "100%" }}
        panes={[
          <Typography key={1} style={{ padding: "0 5%" }}>
            <Typography.Title heading={3}>
              {rank}. {problem.title}
            </Typography.Title>

            <Typography.Paragraph>
              <RecordTimeMemory
                time={problem.timeLimit}
                memory={problem.memoryLimit}
              />
            </Typography.Paragraph>

            {isNotStarted && (
              <Typography.Paragraph>
                <Alert type="warning" content="比赛还没有开始" />
              </Typography.Paragraph>
            )}

            {isEnded && (
              <Typography.Paragraph>
                <Alert
                  type="warning"
                  content="比赛已经结束，当前页面仅供查看"
                />
              </Typography.Paragraph>
            )}

            <Markdown>{problem.description}</Markdown>

            {problem.files.length > 0 && (
              <>
                <Typography.Title heading={4}>附件</Typography.Title>
                <Typography.Paragraph>
                  <ul>
                    {problem.files.map((file) => (
                      <li key={file.id}>
                        <ArcoLink>
                          <Link to={`/file/${file.id}`} target="_blank">
                            {file.filename}
                          </Link>
                        </ArcoLink>
                      </li>
                    ))}
                  </ul>
                </Typography.Paragraph>
              </>
            )}
          </Typography>,

          <Form
            key={2}
            method="post"
            style={{ display: "flex", flexDirection: "column", height: "100%" }}
          >
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
            <Grid.Row justify="space-between" style={{ padding: 10 }}>
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
                {isNotStarted || isEnded ? (
                  <Link to={`/problem/${problem.id}`}>
                    <Button type="primary" icon={<IconSend />}>
                      跳转到题目页面
                    </Button>
                  </Link>
                ) : (
                  <Button
                    type="primary"
                    htmlType="submit"
                    icon={<IconSend />}
                    loading={isSubmitting}
                  >
                    提交
                  </Button>
                )}
              </Space>
            </Grid.Row>
          </Form>,
        ]}
      />

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
              <Grid.Row justify="space-between">
                <Link to={`/record/${record.id}`} target="_blank">
                  <RecordStatus status={record.status} />
                </Link>
                <RecordTimeMemory time={record.time} memory={record.memory} />
              </Grid.Row>
            </List.Item>
          )}
        />
      </Drawer>
    </>
  );
}

export { ErrorBoundary } from "~/src/ErrorBoundary";
export { CatchBoundary } from "~/src/CatchBoundary";
