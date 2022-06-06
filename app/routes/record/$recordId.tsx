import type { Record } from "@prisma/client";
import type { LoaderFunction, MetaFunction } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { db } from "~/utils/server/db.server";
import { s3 } from "~/utils/server/s3.server";
import { invariant } from "~/utils/invariant";
import { idScheme } from "~/utils/scheme";
import Highlighter from "~/src/Highlighter";
import { Collapse, List, Space } from "@arco-design/web-react";
import type { SubtaskResult } from "~/utils/server/judge.types";
import { RecordStatus } from "~/src/record/RecordStatus";
import { RecordTimeMemory } from "~/src/record/RecordTimeMemory";

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
  >;
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

export default function RecordView() {
  const { record, code } = useLoaderData<LoaderData>();
  const subtasks: SubtaskResult[] = Array.isArray(record.subtasks)
    ? (record.subtasks as SubtaskResult[])
    : [];

  return (
    <>
      <h1>{record.status}</h1>
      <RecordTimeMemory time={record.time} memory={record.memory} />
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
                    <RecordStatus status={item.status} />
                    <ResultMessage message={item.message} />
                  </Space>
                }
                extra={
                  <RecordTimeMemory time={item.time} memory={item.memory} />
                }
              >
                <List size="small">
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
        </>
      )}
      <h2>Source Code</h2>
      <Highlighter language={record.language} children={code} />
    </>
  );
}

export { ErrorBoundary } from "~/src/ErrorBoundary";
export { CatchBoundary } from "~/src/CatchBoundary";
