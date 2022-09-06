import type { LoaderArgs, MetaFunction } from "@remix-run/node";
import { json } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { db } from "~/utils/server/db.server";
import { s3 } from "~/utils/server/s3.server";
import { invariant } from "~/utils/invariant";
import { idScheme } from "~/utils/scheme";
import Highlighter from "~/src/Highlighter";
import { RecordStatus } from "~/src/record/RecordStatus";
import { RecordTimeMemory } from "~/src/record/RecordTimeMemory";
import { useContext, useEffect, useState } from "react";
import { UserLink } from "~/src/user/UserLink";
import { ContestLink } from "~/src/contest/ContestLink";
import { selectUserData } from "~/utils/db/user";
import type { MessageType } from "./events";
import type { SubtaskResult } from "~/utils/server/judge.types";
import { selectContestListData } from "~/utils/db/contest";
import { selectProblemListData } from "~/utils/db/problem";
import { ProblemLink } from "~/src/problem/ProblemLink";
import { findRequestUser } from "~/utils/permission";
import { Permissions } from "~/utils/permission/permission";
import {
  findRecordContest,
  findRecordTeam,
  findRecordUser,
} from "~/utils/db/record";
import { fromEventSource } from "~/utils/eventSource";
import { AiOutlineCopy } from "react-icons/ai";
import { HiOutlineChevronRight } from "react-icons/hi";
import { ToastContext } from "~/utils/context/toast";

export async function loader({ request, params }: LoaderArgs) {
  const recordId = invariant(idScheme, params.recordId, { status: 404 });
  const self = await findRequestUser(request);
  const user = await findRecordUser(recordId);
  const [allowCode] = await self
    .team(await findRecordTeam(recordId))
    .contest(await findRecordContest(recordId))
    .hasPermission(
      user === self.userId
        ? Permissions.PERM_VIEW_RECORD_SELF
        : Permissions.PERM_VIEW_RECORD
    );

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
      submitter: { select: selectUserData },
      problem: { select: selectProblemListData },
      contest: { select: selectContestListData },
    },
  });

  if (!record) {
    throw new Response("Record not found", { status: 404 });
  }

  const code = allowCode
    ? (await s3.readFile(`/record/${record.id}`)).toString()
    : "";

  return json({ record, code });
}

export const meta: MetaFunction<typeof loader> = ({ data }) => ({
  title: `提交记录: ${data?.record.status} - HITwh OJ`,
});

export default function RecordView() {
  const { record, code } = useLoaderData<typeof loader>();

  const [time, setTime] = useState(record.time);
  const [memory, setMemory] = useState(record.memory);
  const [status, setStatus] = useState(record.status);
  const [subtasks, setSubtasks] = useState(record.subtasks as SubtaskResult[]);
  const [message, setMessage] = useState(record.message);

  useEffect(() => {
    const subscription = fromEventSource<MessageType>(
      `./${record.id}/events`
    ).subscribe((message) => {
      setTime(message.time);
      setMemory(message.memory);
      setStatus(message.status);
      setSubtasks(message.subtasks as SubtaskResult[]);
      setMessage(message.message);
    });

    return () => subscription.unsubscribe();
  }, [record.id]);

  const Toasts = useContext(ToastContext);

  return (
    <>
      <h1>
        <RecordStatus status={status} />
      </h1>

      <p>
        <RecordTimeMemory time={time} memory={memory} />
      </p>

      <UserLink user={record.submitter} />
      <ProblemLink problem={record.problem} />
      {record.contest && <ContestLink contest={record.contest} />}

      {message && (
        <>
          <h2>输出信息</h2>
          <Highlighter language="text" children={message} />
        </>
      )}

      {subtasks.length > 0 && (
        <>
          <h2>测试点结果</h2>
          {subtasks.map((subtask, index) => (
            <div className={`collapse collapse-open`} key={index} tabIndex={0}>
              <div className="collapse-title flex gap-2">
                <span>子任务 {index + 1}</span>
                <RecordStatus status={subtask.status} />
                <span>{subtask.message}</span>
              </div>
              <div className="collapse-content">
                {subtask.tasks.map((task, index) => (
                  <div className="flex gap-2 items-center" key={index}>
                    <HiOutlineChevronRight />
                    <span>测试点 {index + 1}</span>
                    <RecordStatus status={task.status} />
                    <span>{task.message}</span>
                    <RecordTimeMemory time={task.time} memory={task.memory} />
                  </div>
                ))}
              </div>
            </div>
          ))}
        </>
      )}

      {code && (
        <>
          <h2 className="flex gap-2">
            <span>源代码</span>
            <button
              className="btn btn-ghost btn-sm btn-square"
              onClick={() =>
                navigator.clipboard.writeText(code).then(
                  () => Toasts.success("复制成功"),
                  () => Toasts.error("权限不足")
                )
              }
            >
              <AiOutlineCopy className="w-4 h-4 text-info" />
            </button>
          </h2>
          <Highlighter language={record.language} children={code} />
        </>
      )}
    </>
  );
}

export { ErrorBoundary } from "~/src/ErrorBoundary";
export { CatchBoundary } from "~/src/CatchBoundary";
