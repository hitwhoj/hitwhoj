import type { Contest, Problem, Record, User } from "@prisma/client";
import type { LoaderFunction, MetaFunction } from "@remix-run/node";
import { Link, useLoaderData } from "@remix-run/react";
import { db } from "~/utils/server/db.server";
import { s3 } from "~/utils/server/s3.server";
import { invariant } from "~/utils/invariant";
import { idScheme } from "~/utils/scheme";
import Highlighter from "~/src/Highlighter";
import {
  Button,
  Collapse,
  Descriptions,
  List,
  Message,
  Space,
  Typography,
} from "@arco-design/web-react";
import type { SubtaskResult } from "../../../server/judge.types";
import { RecordStatus } from "~/src/record/RecordStatus";
import { RecordTimeMemory } from "~/src/record/RecordTimeMemory";
import { useContext, useEffect, useState } from "react";
import { WsContext } from "~/utils/context/ws";
import { IconCopy, IconEyeInvisible } from "@arco-design/web-react/icon";
import { UserLink } from "~/src/user/UserLink";
import { ContestLink } from "~/src/contest/ContestLink";

type LoaderData = {
  record: Pick<
    Record,
    | "id"
    | "status"
    | "message"
    | "language"
    | "score"
    | "time"
    | "memory"
    | "subtasks"
  > & {
    submitter: Pick<User, "id" | "nickname" | "username">;
    problem: Pick<Problem, "id" | "title" | "private">;
    contest: Pick<
      Contest,
      "id" | "title" | "private" | "beginTime" | "endTime"
    > | null;
  };
  code: string;
};

export const loader: LoaderFunction<LoaderData> = async ({ params }) => {
  const recordId = invariant(idScheme, params.recordId, {
    status: 404,
  });

  const record = await db.record.findUnique({
    where: { id: recordId },
    select: {
      id: true,
      status: true,
      message: true,
      language: true,
      score: true,
      time: true,
      memory: true,
      subtasks: true,
      submitter: {
        select: {
          id: true,
          nickname: true,
          username: true,
        },
      },
      problem: {
        select: {
          id: true,
          title: true,
          private: true,
        },
      },
      contest: {
        select: {
          id: true,
          title: true,
          private: true,
          beginTime: true,
          endTime: true,
        },
      },
    },
  });

  if (!record) {
    throw new Response("Record not found", { status: 404 });
  }

  const code = (await s3.readFile(`/record/${record.id}`)).toString();

  return {
    record,
    code,
  };
};

export const meta: MetaFunction<LoaderData> = ({ data }) => ({
  title: `提交记录: ${data?.record.status} - HITwh OJ`,
});

function ResultMessage({ message }: { message: string }) {
  return (
    <span style={{ color: "rgb(var(--gray-6))" }} title={message}>
      {message}
    </span>
  );
}

function getExpandedKeys(subtasks: SubtaskResult[]) {
  return subtasks
    .map((subtask, i) => [subtask.status, i.toString()])
    .filter(([status, _]) => status !== "Accepted" && status !== "Pending")
    .map(([_, name]) => name);
}

export default function RecordView() {
  const { record, code } = useLoaderData<LoaderData>();
  const wsc = useContext(WsContext);

  const [time, setTime] = useState(record.time);
  const [memory, setMemory] = useState(record.memory);
  const [status, setStatus] = useState(record.status);
  const [subtasks, setSubtasks] = useState(record.subtasks as SubtaskResult[]);
  const [message, setMessage] = useState(record.message);
  const [keys, setKeys] = useState<string[]>(getExpandedKeys(subtasks));

  useEffect(() => {
    const subscription = wsc
      ?.subscribeRecordUpdate(record.id)
      .subscribe(({ message }) => {
        setTime(message.time);
        setMemory(message.memory);
        setStatus(message.status);
        setSubtasks(message.subtasks as SubtaskResult[]);
        setMessage(message.message);
        setKeys(getExpandedKeys(message.subtasks as SubtaskResult[]));
      });

    return () => subscription?.unsubscribe();
  }, [wsc]);

  return (
    <Typography>
      <Typography.Title heading={3}>
        <RecordStatus status={status} />
      </Typography.Title>

      <Typography.Paragraph>
        <RecordTimeMemory time={time} memory={memory} />
      </Typography.Paragraph>

      <Descriptions
        column={1}
        labelStyle={{ paddingRight: 36 }}
        data={[
          {
            label: "提交用户",
            value: <UserLink user={record.submitter} />,
          },
          {
            label: "题目",
            value: (
              <Link to={`/problem/${record.problem.id}`}>
                <Space>
                  {record.problem.title}
                  {record.problem.private && <IconEyeInvisible />}
                </Space>
              </Link>
            ),
          },
          ...(record.contest
            ? [
                {
                  label: "比赛",
                  value: <ContestLink contest={record.contest} />,
                },
              ]
            : []),
        ]}
      />

      {message && (
        <>
          <Typography.Title heading={4}>输出信息</Typography.Title>
          <Typography.Paragraph>
            <Highlighter language="text" children={message} />
          </Typography.Paragraph>
        </>
      )}

      {subtasks.length > 0 && (
        <>
          <Typography.Title heading={4}>测试点结果</Typography.Title>
          <Typography.Paragraph>
            <Collapse
              style={{ whiteSpace: "nowrap" }}
              bordered={false}
              activeKey={keys}
              onChange={(_, keys) => setKeys(keys)}
            >
              {subtasks.map((item, index) => (
                <Collapse.Item
                  key={index}
                  name={index.toString()}
                  header={
                    <Space>
                      <span>Subtask #{index + 1}</span>
                      <RecordStatus status={item.status} />
                      <ResultMessage message={item.message} />
                    </Space>
                  }
                  extra={
                    <RecordTimeMemory time={item.time} memory={item.memory} />
                  }
                >
                  <List size="small" bordered={false}>
                    {item.tasks.map((task, index) => (
                      <List.Item
                        key={index}
                        extra={
                          <RecordTimeMemory
                            time={task.time}
                            memory={task.memory}
                          />
                        }
                      >
                        <Space>
                          <span>Task #{index + 1}</span>
                          <RecordStatus status={task.status} />
                          <ResultMessage message={task.message} />
                        </Space>
                      </List.Item>
                    ))}
                  </List>
                </Collapse.Item>
              ))}
            </Collapse>
          </Typography.Paragraph>
        </>
      )}

      <Typography.Title heading={4}>
        <Space>
          源代码
          <Button
            icon={<IconCopy />}
            iconOnly
            type="text"
            onClick={() =>
              navigator.clipboard.writeText(code).then(
                () => Message.success("复制成功"),
                () => Message.error("权限不足")
              )
            }
          />
        </Space>
      </Typography.Title>
      <Typography.Paragraph>
        <Highlighter language={record.language} children={code} />
      </Typography.Paragraph>
    </Typography>
  );
}

export { ErrorBoundary } from "~/src/ErrorBoundary";
export { CatchBoundary } from "~/src/CatchBoundary";
