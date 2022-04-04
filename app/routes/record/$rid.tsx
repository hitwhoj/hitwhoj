import { Record } from "@prisma/client";
import { json, LoaderFunction, MetaFunction, useLoaderData } from "remix";
import { db } from "~/utils/db.server";
import { s3 } from "~/utils/s3.server";
import { invariant } from "~/utils/invariant";
import { idScheme } from "~/utils/scheme";
import Highlighter from "~/src/Highlighter";

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

export default function RecordView() {
  const { record, code } = useLoaderData<LoaderData>();
  return (
    <>
      <h1>{record.status}</h1>
      <p>Score: {record.score}</p>
      <p>Time: {record.time} ms</p>
      <p>Memory: {record.memory} byte</p>
      {record.message && (
        <>
          <h2>Compiler Message</h2>
          <Highlighter language="text" children={record.message} />
        </>
      )}
      <h2>Result</h2>
      <Highlighter
        language="text"
        children={JSON.stringify(JSON.parse(record.subtasks), null, 2)}
      />
      <h2>Source Code</h2>
      <Highlighter language={record.language} children={code} />
    </>
  );
}

export { ErrorBoundary } from "~/src/ErrorBoundary";
export { CatchBoundary } from "~/src/CatchBoundary";
