import type { LoaderArgs } from "@remix-run/node";
import { invariant } from "~/utils/invariant";
import { json } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { db } from "~/utils/server/db.server";
import { idScheme } from "~/utils/scheme";
import type { UserData } from "~/utils/db/user";
import { selectUserData } from "~/utils/db/user";
import { useEffect, useMemo, useState } from "react";
import { UserLink } from "~/src/user/UserLink";
import { fromEventSource } from "~/utils/eventSource";
import type { MessageType } from "./events";
import { findRequestUser } from "~/utils/permission";
import { findContestTeam } from "~/utils/db/contest";
import { Permissions } from "~/utils/permission/permission";
import { HiOutlineSave } from "react-icons/hi";

interface Problem {
  count: number;
  solved: boolean;
  penalty: number;
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
      problems: {
        orderBy: { rank: "asc" },
        select: { problemId: true, rank: true },
      },
      relatedRecords: {
        orderBy: { submittedAt: "asc" },
        select: {
          status: true,
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
  const { canExport, contest } = useLoaderData<typeof loader>();

  const [records, setRecords] = useState(contest.relatedRecords);

  useEffect(() => {
    const subscription = fromEventSource<MessageType>(
      `/contest/${contest.id}/board/events`
    ).subscribe((record) => {
      setRecords((records) => [...records, record]);
    });

    return () => subscription.unsubscribe();
  }, []);

  const [users] = useMemo(() => {
    // contestant user data cache
    const contestants = new Map<number, UserData>();
    // analyze ranklist
    const userMap = new Map<number, Map<number, Problem>>();
    const beginTime = new Date(contest.beginTime).getTime();

    for (const record of records) {
      const submittedAt = new Date(record.submittedAt).getTime();
      const penalty = Math.floor((submittedAt - beginTime) / 60_000);

      if (!userMap.has(record.submitter.id)) {
        userMap.set(record.submitter.id, new Map());
        contestants.set(record.submitter.id, record.submitter);
      }
      const user = userMap.get(record.submitter.id)!;

      if (!user.has(record.problemId))
        user.set(record.problemId, { count: 0, solved: false, penalty: 0 });
      const problem = user.get(record.problemId)!;

      if (!problem.solved) {
        problem.count++;
        problem.solved ||= record.status === "Accepted";
        problem.penalty = penalty;
      }

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
      }))
      // sort rank
      .sort((a, b) => {
        if (a.solved !== b.solved) return b.solved - a.solved;
        if (a.penalty !== b.penalty) return a.penalty - b.penalty;
        return a.submitter.id - b.submitter.id;
      })
      // set rank
      .map((user, index) => ({ ...user, rank: index + 1 }))
      // adjust rank
      .map((user, index, array) => {
        if (!index) return user;
        const prev = array[index - 1];
        if (prev.solved === user.solved && prev.penalty === user.penalty) {
          user.rank = prev.rank;
        }
        return user;
      });

    return [users];
  }, [records]);

  const exportData = () => {
    const data = users.map((user) => {
      const problems = contest.problems.map((problem) => {
        const p = user.problems.get(problem.problemId);
        if (!p) return "-";
        return p.solved ? `+${p.count}/${p.penalty}\t` : `-${p.count}\t`;
      });
      return [
        user.rank,
        user.submitter.username,
        user.solved,
        user.penalty,
        ...problems,
      ];
    });
    // add \ufeff to make excel recognize the csv file as utf-8
    let csv =
      "\ufeff排名,选手,解题数,总罚时," +
      contest.problems
        .map((p) => String.fromCharCode(0x40 + p.rank))
        .join(",") +
      "\n";
    csv += data.map((row) => row.join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv,charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${contest.title}_${new Date()
      .toLocaleString()
      .replace(/:/g, "-")
      .replace(/\//g, "-")
      .replace(/ /g, "_")}_rank.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <>
      {canExport && (
        <div className="w-full flex justify-end items-center">
          <button
            className="btn btn-sm btn-primary font-normal gap-2"
            onClick={exportData}
          >
            <HiOutlineSave />
            导出csv
          </button>
        </div>
      )}
      <table className="table w-full not-prose">
        <thead>
          <tr>
            <th className="w-16 text-center">排名</th>
            <th>选手</th>
            <th className="w-16 text-center">解题数</th>
            <th className="w-16 text-center">总罚时</th>
            {contest.problems.map((problem) => (
              <th key={problem.problemId} className="w-16 text-center">
                {String.fromCharCode(0x40 + problem.rank)}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {users.map((user) => {
            return (
              <tr key={user.submitter.id}>
                <th className="text-center">{user.rank}</th>
                <td>
                  <UserLink user={user.submitter} />
                </td>
                <td className="text-center">{user.solved}</td>
                <td className="text-center">{user.penalty}</td>
                {contest.problems.map(({ problemId }) => {
                  const problem = user.problems.get(problemId);
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
                          ? "bg-success text-success-content text-center"
                          : "bg-error text-error-content text-center"
                      }
                    >
                      {problem.solved
                        ? `+${problem.count}/${problem.penalty}`
                        : `-${problem.count}`}
                    </td>
                  );
                })}
              </tr>
            );
          })}
        </tbody>
      </table>
    </>
  );
}

export { ErrorBoundary } from "~/src/ErrorBoundary";
export { CatchBoundary } from "~/src/CatchBoundary";
