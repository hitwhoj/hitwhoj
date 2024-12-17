import type { LoaderArgs } from "@remix-run/node";
import { invariant } from "~/utils/invariant";
import { json } from "@remix-run/node";
import { db } from "~/utils/server/db.server";
import { idScheme } from "~/utils/scheme";
import type { UserData } from "~/utils/db/user";
import { selectUserData } from "~/utils/db/user";
import { useCallback } from "react";
import { UserLink } from "~/src/user/UserLink";
import { fromEventSource } from "~/utils/eventSource";
import type { MessageType } from "./events";
import { findRequestUser } from "~/utils/permission";
import { findContestTeam } from "~/utils/db/contest";
import { Permissions } from "~/utils/permission/permission";
import { HiOutlineSave } from "react-icons/hi";
import { useComputed, useSignalEffect } from "@preact/signals-react";
import { useSignalLoaderData, useSynchronized } from "~/utils/hooks";

interface Problem {
  count: number;
  solved: boolean;
  penalty: number;
  score: number;
}

export async function loader({ request, params }: LoaderArgs) {
  const contestId = invariant(idScheme, params.contestId, { status: 404 });

  // 获取导出权限
  const self = await findRequestUser(request);
  const [canExport] = await self
    .team(await findContestTeam(contestId))
    .contest(contestId)
    .hasPermission(Permissions.PERM_EXPORT_CONTEST_BOARD);

  // 获取比赛所含题目信息
  const contest = await db.contest.findUnique({
    where: { id: contestId },
    select: {
      id: true,
      title: true,
      beginTime: true,
      endTime: true,
      system: true,
      problems: {
        orderBy: { rank: "asc" },
        select: { problemId: true, rank: true },
      },
      relatedRecords: {
        orderBy: { submittedAt: "asc" },
        select: {
          status: true,
          score: true,
          subtasks: true,
          submittedAt: true,
          problemId: true,
          submitter: { select: { ...selectUserData } },
        },
      },
    },
  });

  if (!contest) {
    throw new Response("Contest not found", { status: 404 });
  }

  return json({ canExport, contest });
}

export default function RankView() {
  const loaderData = useSignalLoaderData<typeof loader>();
  const canExport = useComputed(() => loaderData.value.canExport);
  const contest = useComputed(() => loaderData.value.contest);

  const records = useSynchronized(() => contest.value.relatedRecords);

  useSignalEffect(() => {
    const subscription = fromEventSource<MessageType>(
      `/contest/${contest.value.id}/board/events`
    ).subscribe((record) => {
      records.value = [...records.value, record];
    });

    return () => subscription.unsubscribe();
  });

  const users = useComputed(() => {
    // contestant user data cache
    const contestants = new Map<number, UserData>();
    // analyze ranklist
    const userMap = new Map<number, Map<number, Problem>>();
    const beginTime = new Date(contest.value.beginTime).getTime();

    for (const record of records.value) {
      const submittedAt = new Date(record.submittedAt).getTime();
      const penalty = Math.floor((submittedAt - beginTime) / 60_000);

      if (!userMap.has(record.submitter.id)) {
        userMap.set(record.submitter.id, new Map());
        contestants.set(record.submitter.id, record.submitter);
      }
      const user = userMap.get(record.submitter.id)!;

      if (!user.has(record.problemId))
        user.set(record.problemId, { count: 0, solved: false, penalty: 0, score: 0 });
      const problem = user.get(record.problemId)!;

      if (!problem.solved) {
        problem.count++;
        problem.solved ||= record.status === "Accepted";
        problem.penalty = penalty;
      }

      if (record.score > problem.score)
        problem.score = record.score;

      user.set(record.problemId, problem);
    }

    // fix penalty for ACM contest
    for (const user of userMap.values()) {
      for (const problem of user.values()) {
        if (problem.solved) {
          problem.penalty += (problem.count - 1) * 20;
        }
      }
    }

    const users = [...userMap.keys()]
      // calculate
      .map((id) => ({
        submitter: contestants.get(id)!,
        solved: [...userMap.get(id)!.values()].filter((p) => p.solved).length,
        penalty: [...userMap.get(id)!.values()]
          .filter((p) => p.solved)
          .reduce((acc, p) => acc + p.penalty, 0),
        problems: userMap.get(id)!,
        score: [...userMap.get(id)!.values()].reduce((acc, p) => acc + p.score, 0)
      }))
      // sort rank
      .sort((a, b) => {
        if (contest.value.system === "ACM") {
          if (a.solved !== b.solved) return b.solved - a.solved;
          if (a.penalty !== b.penalty) return a.penalty - b.penalty;
        } else {
          if (a.score !== b.score) return b.score - a.score;
        }
        return a.submitter.id - b.submitter.id;
      })
      // set rank
      .map((user, index) => ({ ...user, rank: index + 1 }))
      // 处理排名相同情况
      .map((user, index, array) => {
        if (!index) return user;
        const prev = array[index - 1];
        if (contest.value.system === "ACM") {
          if (prev.solved === user.solved && prev.penalty === user.penalty) {
            user.rank = prev.rank;
          }
        } else {
          if (prev.score === user.score) {
            user.rank = prev.rank;
          }
        }
        return user;
      });

    return users;
  });

  const exportData = useCallback(() => {
    const data = users.value.map((user) => {
      const problems = contest.value.problems.map((problem) => {
        const p = user.problems.get(problem.problemId);
        if (contest.value.system === "ACM") {
          if (!p) return "-";
          return p.solved ? `+${p.count}/${p.penalty}\t` : `-${p.count}\t`;
        }
        return p ? p.score.toString() : "0";
      });
      if (contest.value.system === "ACM") {
        return [
          user.rank,
          user.submitter.nickname,
          user.submitter.username,
          user.submitter.studentId,
          user.solved,
          user.penalty,
          ...problems,
        ];
      } else {
        return [
          user.rank,
          user.submitter.nickname,
          user.submitter.username,
          user.submitter.studentId,
          user.score,
          ...problems,
        ];
      }
    });
    // add \ufeff to make excel recognize the csv file as utf-8
    let csv = "";
    switch (contest.value.system) {
      case "ACM":
        csv += "\ufeff排名,选手,用户名,学号,解题数,总罚时,";
        break;
      case "IOI":
      case "OI":
      case "Homework":
        csv += "\ufeff排名,选手,用户名,学号,总分数,";
        break;
    }
    csv += contest.value.problems
        .map((p) => String.fromCharCode(0x40 + p.rank))
        .join(",") +
      "\n";
    csv += data.map((row) => row.join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv,charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${contest.value.title}_${new Date()
      .toLocaleString()
      .replace(/:/g, "-")
      .replace(/\//g, "-")
      .replace(/ /g, "_")}_rank.csv`;
    a.click();
    URL.revokeObjectURL(url);
  }, [users.value]);

  return (
    <>
      {(contest.value.system !== "OI" ||
        new Date(contest.value.endTime) < new Date()) && (
        <>
          {canExport && (
            <div className="flex w-full items-center justify-end">
              <button
                className="btn btn-primary btn-sm gap-2 font-normal"
                onClick={exportData}
              >
                <HiOutlineSave />
                导出csv
              </button>
            </div>
          )}
          <table className="not-prose table w-full">
            <thead>
              <tr>
                <th className="w-16 text-center">排名</th>
                <th>选手</th>
                {contest.value.system === "ACM" && (
                  <>
                    <th className="w-16 text-center">解题数</th>
                    <th className="w-16 text-center">总罚时</th>
                  </>
                )}
                {contest.value.system !== "ACM" && (
                  <th className="w-16 text-center">总分数</th>
                )}
                {contest.value.problems.map((problem) => (
                  <th key={problem.problemId} className="w-16 text-center">
                    {String.fromCharCode(0x40 + problem.rank)}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {users.value.map((user) => (
                <tr key={user.submitter.id}>
                  <th className="text-center">{user.rank}</th>
                  <td>
                    <UserLink user={user.submitter} />
                  </td>
                  {contest.value.system === "ACM" && (
                    <>
                      <td className="text-center">{user.solved}</td>
                      <td className="text-center">{user.penalty}</td>
                    </>
                  )}
                  {contest.value.system !== "ACM" && (
                    <td className="text-center">{user.score}</td>
                  )}
                  {contest.value.problems.map(({ problemId }) => {
                    const problem = user.problems.get(problemId);
                    if (contest.value.system === "ACM") {
                      if (!problem)
                        return (
                          <td key={problemId} className="text-center">
                            -
                          </td>
                        );

                      return (
                        <td
                          key={problemId}
                          className={
                            problem.solved
                              ? "bg-success text-center text-success-content"
                              : "bg-error text-center text-error-content"
                          }
                        >
                          {problem.solved
                            ? `+${problem.count}/${problem.penalty}`
                            : `-${problem.count}`}
                        </td>
                      );
                    } else {
                      if (!problem) {
                        return (
                          <td key={problemId} className="text-center">
                            0
                          </td>
                        );
                      }
                      return (
                        <td key={problemId} className="text-center">
                          {problem.score}
                        </td>
                      );
                    }
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </>
      )}
      {contest.value.system === "OI" &&
        new Date(contest.value.endTime) >= new Date() && (
          <label className="text-center">OI赛制比赛结束前不公开排行榜</label>
        )}
    </>
  );
}

export { ErrorBoundary } from "~/src/ErrorBoundary";
export { CatchBoundary } from "~/src/CatchBoundary";
