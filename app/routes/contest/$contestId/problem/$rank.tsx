import Editor, {
  loader as monacoLoader,
  useMonaco,
} from "@monaco-editor/react";
import type { ActionArgs, LoaderArgs, MetaFunction } from "@remix-run/node";
import { json } from "@remix-run/node";
import {
  Form,
  Link,
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
import { s3 } from "~/utils/server/s3.server";
import { useContext, useEffect, useState } from "react";
import { RecordStatus } from "~/src/record/RecordStatus";
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
import Fullscreen from "~/src/Fullscreen";
import { AiOutlineHistory } from "react-icons/ai";
import { HiOutlineChevronLeft, HiOutlinePaperAirplane } from "react-icons/hi";
import { RecordTimeMemory } from "~/src/record/RecordTimeMemory";
import { darkThemes, defaultThemeColor, ThemeContext } from "~/utils/theme";
import { ToastContext } from "~/utils/context/toast";
import { judge } from "~/utils/server/judge/manager.server";
import { recordUpdateSubject } from "~/utils/serverEvents";

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

export const meta: MetaFunction<typeof loader> = ({ data, params }) => ({
  title: `${params.rank}. ${data?.problem.title} - HITwh OJ`,
});

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

  const record = await db.record.create({
    data: {
      language,
      problemId,
      contestId,
      submitterId: self.userId!,
    },
    select: { id: true },
  });

  await s3.writeFile(`/record/${record.id}`, Buffer.from(code));
  judge.push(record.id);
  recordUpdateSubject.next(record.id);

  return null;
}

// override monaco loader
monacoLoader.config({ paths: { vs: "/build/_assets/vs" } });

export default function ContestProblemView() {
  const {
    problem,
    records: _records,
    contest,
  } = useLoaderData<typeof loader>();
  const { contestId, rank } = useParams();

  const { state, type } = useTransition();
  const isActionSubmit = state === "submitting" && type === "actionSubmission";
  const isActionReload = state === "loading" && type === "actionReload";
  const isLoading = isActionSubmit || isActionReload;

  const [visible, setVisible] = useState(false);

  const Toasts = useContext(ToastContext);

  useEffect(() => {
    if (isActionReload) {
      Toasts.success("提交成功");
      setVisible(true);
    }
  }, [isActionReload]);

  const monaco = useMonaco();
  // 设置 monaco 主题
  useEffect(() => {
    if (monaco) {
      const color = defaultThemeColor[theme];
      monaco.editor.defineTheme(theme, {
        base: darkThemes.includes(theme) ? "vs-dark" : "vs",
        inherit: true,
        rules: [],
        colors: {
          "editor.background": color.base100,
          "editor.foreground": color.baseContent,
          "editor.lineHighlightBackground": color.base200,
        },
      });
      monaco.editor.setTheme(theme);
    }
  }, [monaco]);

  const [language, setLanguage] = useState("cpp");
  const [code, setCode] = useState(
    "#include <bits/stdc++.h>\n" +
      "\n" +
      "int main() {\n" +
      "  int a, b;\n" +
      "  std::cin >> a >> b;\n" +
      "  std::cout << a + b << std::endl;\n" +
      "  return 0;\n" +
      "}\n"
  );

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
            // 如果返回原来的 records，React 就不会重新渲染
            return [...records];
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

  const theme = useContext(ThemeContext);

  return (
    <Fullscreen
      visible={true}
      className="drawer drawer-end w-full h-full bg-base-100"
    >
      <input
        type="checkbox"
        id="records"
        className="drawer-toggle"
        checked={visible}
        readOnly
      />
      <div className="drawer-content grid grid-cols-2 grid-rows-1">
        <div className="flex flex-col overflow-y-auto">
          <nav className="p-4 sticky top-0 z-10 bg-base-100 flex-shrink-0">
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
              {rank}. {problem.title}
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
        <Form method="post" className="flex flex-col">
          <Editor
            value={code}
            language={language}
            theme={theme}
            onChange={(code) => setCode(code ?? "")}
            options={{
              cursorSmoothCaretAnimation: true,
              smoothScrolling: true,
              fontSize: 16,
            }}
          />
          <textarea name="code" hidden value={code} readOnly />
          <div className="flex-shrink-0 flex justify-between p-2">
            <div>
              <select
                className="select select-bordered"
                name="language"
                value={language}
                onChange={(event) => setLanguage(event.target.value)}
                disabled={isLoading}
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
                onClick={() => setVisible(true)}
              >
                <AiOutlineHistory />
                <span>查看提交记录</span>
              </button>
              {!isNotStarted && !isEnded ? (
                <button
                  className="btn btn-primary gap-2"
                  type="submit"
                  disabled={isLoading}
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
          </div>
        </Form>
      </div>
      <div className="drawer-side">
        <label className="drawer-overlay" onClick={() => setVisible(false)} />
        <aside className="bg-base-200 p-4 not-prose">
          <h3 className="font-bold text-lg">提交记录</h3>
          <ul className="menu menu-compact w-96 my-4">
            {records.map((record) => (
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
