import type { LoaderArgs, MetaFunction } from "@remix-run/node";
import { json } from "@remix-run/node";
import { db } from "~/utils/server/db.server";
import { s3 } from "~/utils/server/s3.server";
import { invariant } from "~/utils/invariant";
import { idScheme } from "~/utils/scheme";
import Highlighter from "~/src/Highlighter";
import { RecordStatus } from "~/src/record/RecordStatus";
import { RecordTimeMemory } from "~/src/record/RecordTimeMemory";
import { UserLink } from "~/src/user/UserLink";
import { ContestLink } from "~/src/contest/ContestLink";
import { selectUserData } from "~/utils/db/user";
import type { MessageType } from "./events";
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
import type { SubtaskResult } from "~/utils/server/judge/judge.types";
import { useComputed, useSignalEffect } from "@preact/signals-react";
import { useSignalLoaderData, useSynchronized } from "~/utils/hooks";
import { useToasts } from "~/utils/toast";

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
  const loaderData = useSignalLoaderData<typeof loader>();
  const record = useSynchronized(() => loaderData.value.record);
  const code = useComputed(() => loaderData.value.code);

  useSignalEffect(() => {
    const subscription = fromEventSource<MessageType>(
      `./${record.value.id}/events`
    ).subscribe((msg) => {
      record.value = {
        ...record.value,
        time: msg.time,
        memory: msg.memory,
        status: msg.status,
        subtasks: msg.subtasks,
        message: msg.message,
      };
    });

    return () => subscription.unsubscribe();
  });

  const Toasts = useToasts();

  const subtasks = useComputed(() => record.value.subtasks as SubtaskResult[]);

  return (
    <>
      <h1>
        <RecordStatus status={record.value.status} />
      </h1>

      <p>
        <RecordTimeMemory
          time={record.value.time}
          memory={record.value.memory}
        />
      </p>

      <div className="my-4 flex flex-wrap gap-4">
        <span>
          <span className="opacity-60">用户：</span>
          <UserLink user={record.value.submitter} />
        </span>
        <span>
          <span className="opacity-60">题目：</span>
          <ProblemLink problem={record.value.problem} />
        </span>
        {record.value.contest && (
          <span>
            <span className="opacity-60">比赛：</span>
            <ContestLink contest={record.value.contest} />
          </span>
        )}
      </div>

      {record.value.message && (
        <>
          <h2>输出信息</h2>
          <Highlighter language="text">{record.value.message}</Highlighter>
        </>
      )}

      {subtasks.value.length > 0 && (
        <>
          <h2>测试点结果</h2>
          {subtasks.value.map((subtask, index) => (
            <div className="collapse-open collapse" key={index} tabIndex={0}>
              <div className="collapse-title flex gap-2">
                <span>子任务 {index + 1}</span>
                <RecordStatus status={subtask.status} />
                <span>{subtask.message}</span>
              </div>
              <div className="collapse-content">
                {subtask.tasks.map((task, index) => (
                  <div className="flex items-center gap-2" key={index}>
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

      {code.value && (
        <>
          <h2 className="flex gap-2">
            <span>源代码</span>
            <button
              className="btn btn-square btn-ghost btn-sm"
              onClick={() =>
                navigator.clipboard.writeText(code.value).then(
                  () => Toasts.success("复制成功"),
                  () => Toasts.error("权限不足")
                )
              }
            >
              <AiOutlineCopy className="text-info h-4 w-4" />
            </button>
          </h2>
          <Highlighter language={record.value.language}>
            {code.value}
          </Highlighter>
        </>
      )}
    </>
  );
}

export { ErrorBoundary } from "~/src/ErrorBoundary";
export { CatchBoundary } from "~/src/CatchBoundary";
