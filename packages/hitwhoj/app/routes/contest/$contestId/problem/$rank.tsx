import type { ActionArgs, LoaderArgs, MetaFunction } from "@remix-run/node";
import { json } from "@remix-run/node";
import {
  Form,
  Link,
  useBeforeUnload,
  useLoaderData,
  useParams,
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
import { s3 } from "~/utils/server/s3.server";
import { useCallback, useContext, useEffect } from "react";
import { RecordStatus } from "~/src/record/RecordStatus";
import { findRequestUser } from "~/utils/permission";
import {
  findContestProblemIdByRank,
  findContestStatus,
  findContestTeam,
} from "~/utils/db/contest";
import { Permissions } from "~/utils/permission/permission";
import { Privileges } from "~/utils/permission/privilege";
import { fromEventSource } from "~/utils/eventSource";
import Fullscreen from "~/src/Fullscreen";
import { AiOutlineHistory } from "react-icons/ai";
import { HiOutlineChevronLeft, HiOutlinePaperAirplane } from "react-icons/hi";
import { RecordTimeMemory } from "~/src/record/RecordTimeMemory";
import { ToastContext } from "~/utils/context/toast";
import { judge } from "~/utils/server/judge/manager.server";
import { recordUpdateSubject } from "~/utils/serverEvents";
import type { MessageType } from "~/routes/record/$recordId/events";
import { VscodeEditor } from "~/src/VscodeEditor";
import { useComputed, useSignal, useSignalEffect } from "@preact/signals-react";
import { useSignalTransition } from "~/utils/hooks";

export async function loader({ request, params }: LoaderArgs) {
  const contestId = invariant(idScheme, params.contestId, { status: 404 });
  const rank = invariant(problemRankScheme, params.rank, { status: 404 });
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

export const meta: MetaFunction<typeof loader> = ({ data, params }) => ({
  title: `${params.rank} - ${data?.problem.title} - HITwh OJ`,
});

export async function action({ request, params }: ActionArgs) {
  const contestId = invariant(idScheme, params.contestId, { status: 404 });
  const rank = invariant(problemRankScheme, params.rank, { status: 404 });
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

  const record = await db.record.create({
    data: {
      language,
      problemId,
      contestId,
      submitterId: self.userId!,
    },
    select: {
      id: true,
      status: true,
      message: true,
      time: true,
      memory: true,
      score: true,
      subtasks: true,
    },
  });

  await s3.writeFile(`/record/${record.id}`, Buffer.from(code));
  judge.push(record.id);
  recordUpdateSubject.next(record);

  return null;
}

export default function ContestProblemView() {
  const {
    problem,
    records: _records,
    contest,
  } = useLoaderData<typeof loader>();
  const { contestId, rank } = useParams();

  const { success, loading } = useSignalTransition();

  const visible = useSignal(false);

  const Toasts = useContext(ToastContext);

  useSignalEffect(() => {
    if (success.value) {
      Toasts.success("提交成功");
      visible.value = true;
    }
  });

  const language = useSignal("cpp");
  const code = useSignal(
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

  // load code from local storage
  useEffect(() => {
    const storedLang = localStorage.getItem(`C#${contestId}#${rank}#language`);
    if (storedLang) language.value = storedLang;
    const storedCode = localStorage.getItem(`C#${contestId}#${rank}#code`);
    if (storedCode) code.value = storedCode;
  }, []);

  // save code to local storage
  useBeforeUnload(
    useCallback(() => {
      localStorage.setItem(`C#${contestId}#${rank}#language`, language.value);
      localStorage.setItem(`C#${contestId}#${rank}#code`, code.value);
    }, [language.value, code.value])
  );

  const now = new Date();
  const isNotStarted = now < new Date(contest.beginTime);
  const isEnded = now > new Date(contest.endTime);

  const records = useSignal(_records);
  useEffect(() => {
    records.value = _records;
  }, [_records]);

  const pending = useComputed(() => {
    return records.value
      .filter(
        (record) =>
          record.status === "Pending" ||
          record.status === "Compiling" ||
          record.status === "Judging" ||
          record.status === "Running"
      )
      .map(({ id }) => id);
  });

  useEffect(() => {
    const subscriptions = pending.value.map((id) => {
      return fromEventSource<MessageType>(`/record/${id}/events`).subscribe(
        (message) => {
          const found = records.value.find(
            (record) => record.id === message.id
          );
          if (found) {
            found.time = message.time;
            found.score = message.score;
            found.memory = message.memory;
            found.status = message.status;
          }
          records.value = [...records.value];
        }
      );
    });

    return () => {
      subscriptions.forEach((subscription) => subscription.unsubscribe());
    };
  }, [pending.value.join(" ")]);

  return (
    <Fullscreen
      visible={true}
      className="drawer drawer-end h-full w-full bg-base-100"
    >
      <input
        type="checkbox"
        id="records"
        className="drawer-toggle"
        checked={visible.value}
        readOnly
      />
      <div className="drawer-content grid grid-cols-2 grid-rows-1">
        <div className="flex flex-col overflow-y-auto">
          <nav className="sticky top-0 z-10 flex-shrink-0 bg-base-100 p-4">
            <Link
              className="btn btn-ghost gap-2"
              to={`/contest/${contest.id}/problem`}
            >
              <HiOutlineChevronLeft className="" />
              <span>返回题目列表</span>
            </Link>
          </nav>
          <article className="p-4">
            <h1>
              {rank} - {problem.title}
            </h1>
            <p>
              <RecordTimeMemory
                time={problem.timeLimit}
                memory={problem.memoryLimit}
              />
            </p>
            {isNotStarted && (
              <p className="alert alert-warning shadow-lg">比赛还没有开始</p>
            )}
            {isEnded && (
              <p className="alert alert-warning shadow-lg">
                比赛已经结束，本页面仅供查看
              </p>
            )}
            <Markdown>{problem.description}</Markdown>
            {problem.files.length > 0 && (
              <>
                <h2>可供下载的文件</h2>
                <ol>
                  {problem.files.map((file) => (
                    <li key={file.id}>
                      <Link to={`/file/${file.id}`} target="_blank">
                        {file.filename}
                      </Link>
                    </li>
                  ))}
                </ol>
              </>
            )}
          </article>
        </div>
        <div className="flex flex-col">
          <VscodeEditor code={code} language={language.value} />
          <Form
            method="post"
            className="flex flex-shrink-0 justify-between p-2"
          >
            <textarea name="code" hidden value={code.value} readOnly />
            <div>
              <select
                className="select select-bordered"
                name="language"
                value={language.value}
                onChange={(event) =>
                  (language.value = event.currentTarget.value)
                }
                disabled={loading.value}
              >
                <option value="c">C</option>
                <option value="cpp">C++</option>
                <option value="java">Java</option>
              </select>
            </div>
            <div className="inline-flex gap-4">
              <button
                className="btn btn-ghost gap-2"
                type="button"
                onClick={() => (visible.value = true)}
              >
                <AiOutlineHistory />
                <span>查看提交记录</span>
              </button>
              {!isNotStarted && !isEnded ? (
                <button
                  className="btn btn-primary gap-2"
                  type="submit"
                  disabled={loading.value}
                >
                  <HiOutlinePaperAirplane className="rotate-90" />
                  <span>提交</span>
                </button>
              ) : (
                <Link className="btn btn-primary" to={`/problem/${problem.id}`}>
                  跳转到题目页面
                </Link>
              )}
            </div>
          </Form>
        </div>
      </div>
      <div className="drawer-side">
        <label
          className="drawer-overlay"
          onClick={() => (visible.value = false)}
        />
        <aside className="not-prose bg-base-200 p-4">
          <h3 className="text-lg font-bold">提交记录</h3>
          <ul className="menu menu-compact my-4 w-96">
            {records.value.map((record) => (
              <li key={record.id}>
                <Link
                  to={`/record/${record.id}`}
                  className="block p-4"
                  target="_blank"
                >
                  <RecordStatus status={record.status} />
                </Link>
              </li>
            ))}
          </ul>
        </aside>
      </div>
    </Fullscreen>
  );
}

export { ErrorBoundary } from "~/src/ErrorBoundary";
export { CatchBoundary } from "~/src/CatchBoundary";
