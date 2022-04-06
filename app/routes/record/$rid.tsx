import { Record } from "@prisma/client";
import { json, LoaderFunction, MetaFunction, useLoaderData } from "remix";
import { db } from "~/utils/db.server";
import { s3 } from "~/utils/s3.server";
import { invariant } from "~/utils/invariant";
import { idScheme } from "~/utils/scheme";
import Highlighter from "~/src/Highlighter";
import { Collapse, List, Space, Tag } from "@arco-design/web-react";
import { IconClockCircle, IconStorage } from "@arco-design/web-react/icon";
import {
  JudgeStatus,
  SubtaskResult,
  SubtaskStatus,
  TaskStatus,
} from "~/utils/types";

type LoaderData = {
  record: Pick<
    Record,
    | "rid"
    | "status"
    | "message"
    | "language"
    | "score"
    | "time"
    | "memory"
    | "subtasks"
  >;
  code: string;
};

export const loader: LoaderFunction = async ({ params }) => {
  const rid = invariant(idScheme.safeParse(params.rid), { status: 404 });

  const record = await db.record.findUnique({
    where: { rid },
    select: {
      rid: true,
      status: true,
      message: true,
      language: true,
      score: true,
      time: true,
      memory: true,
      subtasks: true,
    },
  });

  if (!record) {
    throw new Response("Record not found", { status: 404 });
  }

  const code = (await s3.readFileAsBuffer(`/record/${record.rid}`)).toString();

  return json({
    record,
    code,
  });
};

export const meta: MetaFunction = ({ data }: { data?: LoaderData }) => ({
  title: `提交记录: ${data?.record.status} - HITwh OJ`,
});

function ResultMessage({ message }: { message: string }) {
  return (
    <span style={{ color: "rgb(var(--gray-6))" }} title={message}>
      {message}
    </span>
  );
}

function Status({
  status,
}: {
  status: JudgeStatus | SubtaskStatus | TaskStatus;
}) {
  let color: string;
  switch (status) {
    case "Accepted": {
      color = "green";
      break;
    }

    case "Compile Error":
    case "Memory Limit Exceeded":
    case "Output Limit Exceeded":
    case "Runtime Error":
    case "System Error":
    case "Time Limit Exceeded":
    case "Unknown Error":
    case "Wrong Answer": {
      color = "red";
      break;
    }

    case "Compiling":
    case "Judging":
    case "Running": {
      color = "yellow";
      break;
    }

    case "Pending":
    case "Skipped": {
      color = "gray";
      break;
    }

    default: {
      color = "blue";
      break;
    }
  }

  return <b style={{ color: `rgb(var(--${color}-6))` }}>{status}</b>;
}

function TimeTag({ time }: { time: number }) {
  return <Tag icon={<IconClockCircle />}>{time < 0 ? "N/A" : `${time}ms`}</Tag>;
}

function MemoryTag({ memory }: { memory: number }) {
  return (
    <Tag icon={<IconStorage />}>
      {memory < 0
        ? "N/A"
        : memory < 1024
        ? `${memory}B`
        : memory < 1024 * 1024
        ? `${(memory / 1024).toFixed(2)}KB`
        : memory < 1024 * 1024 * 1024
        ? `${(memory / 1024 / 1024).toFixed(2)}MB`
        : `${(memory / 1024 / 1024 / 1024).toFixed(2)}GB`}
    </Tag>
  );
}

function TimeMemory({ time, memory }: { time: number; memory: number }) {
  return (
    <Space>
      <TimeTag time={time} />
      <MemoryTag memory={memory} />
    </Space>
  );
}

export default function RecordView() {
  const { record, code } = useLoaderData<LoaderData>();
  const subtasks: SubtaskResult[] = JSON.parse(record.subtasks);

  return (
    <>
      <h1>{record.status}</h1>
      <TimeMemory time={record.time} memory={record.memory} />
      {record.message && (
        <>
          <h2>Message</h2>
          <Highlighter language="text" children={record.message} />
        </>
      )}
      {subtasks.length > 0 && (
        <>
          <h2>Result</h2>
          <Collapse
            style={{ whiteSpace: "nowrap" }}
            defaultActiveKey={subtasks
              .map((subtask, i) => [subtask.status, i.toString()])
              .filter(
                ([status, _]) => status !== "Accepted" && status !== "Pending"
              )
              .map(([_, name]) => name)}
          >
            {subtasks.map((item, index) => (
              <Collapse.Item
                key={index}
                name={index.toString()}
                header={
                  <Space>
                    <span>Subtask #{index + 1}</span>
                    <Status status={item.status} />
                    <ResultMessage message={item.message} />
                  </Space>
                }
                extra={<TimeMemory time={item.time} memory={item.memory} />}
              >
                <List size="small">
                  {item.tasks.map((task, index) => (
                    <List.Item
                      key={index}
                      children={
                        <Space>
                          <span>Task #{index + 1}</span>
                          <Status status={task.status} />
                          <ResultMessage message={task.message} />
                        </Space>
                      }
                      extra={
                        <TimeMemory time={task.time} memory={task.memory} />
                      }
                    />
                  ))}
                </List>
              </Collapse.Item>
            ))}
          </Collapse>
        </>
      )}
      <h2>Source Code</h2>
      <Highlighter language={record.language} children={code} />
    </>
  );
}

export { ErrorBoundary } from "~/src/ErrorBoundary";
export { CatchBoundary } from "~/src/CatchBoundary";
