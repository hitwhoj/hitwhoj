import type { LoaderArgs } from "@remix-run/node";
import { invariant } from "~/utils/invariant";
import { json } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { db } from "~/utils/server/db.server";
import { idScheme } from "~/utils/scheme";
import type { UserData } from "~/utils/db/user";
import { selectUserData } from "~/utils/db/user";
import { useMemo, useState } from "react";
import { UserLink } from "~/src/user/UserLink";

interface Problem {
  count: number;
  solved: boolean;
  penalty: number;
}

export async function loader({ params }: LoaderArgs) {
  const contestId = invariant(idScheme, params.contestId, { status: 404 });
  // 获取比赛所含题目信息
  const contest = await db.contest.findUnique({
    where: { id: contestId },
    select: {
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

  return json({ contest });
}

export default function RankView() {
  const { contest } = useLoaderData<typeof loader>();

  // TODO 推送更新榜单
  const [records, _setRecords] = useState(contest.relatedRecords);

  const [users] = useMemo(() => {
    // contestant user data cache
    const contestants = new Map<number, UserData>();
    // analyze ranklist
    const userMap = new Map<number, Map<number, Problem>>();
    const beginTime = new Date(contest.beginTime).getTime();

    for (const record of contest.relatedRecords) {
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
        return {
          ...user,
          rank:
            prev.solved === user.solved && prev.penalty === user.penalty
              ? prev.rank
              : user.rank,
        };
      });

    return [users];
  }, [records]);

  return (
    <table className="table w-full not-prose">
      <thead>
        <tr>
          <th></th>
          <th>选手</th>
          <th>解题数</th>
          <th>总罚时</th>
          {contest.problems.map((problem) => (
            <th key={problem.problemId}>{problem.rank}</th>
          ))}
        </tr>
      </thead>
      <tbody>
        {users.map((user) => {
          return (
            <tr key={user.submitter.id}>
              <th>{user.rank}</th>
              <td>
                <UserLink user={user.submitter} />
              </td>
              <td>{user.solved}</td>
              <td>{user.penalty}</td>
              {contest.problems.map(({ problemId }) => {
                const problem = user.problems.get(problemId);
                if (!problem) return <td key={problemId}>-</td>;

                return (
                  <td
                    key={problemId}
                    className={
                      problem.solved
                        ? "bg-success text-success-content"
                        : "bg-error text-error-content"
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
  );
}

export { ErrorBoundary } from "~/src/ErrorBoundary";
export { CatchBoundary } from "~/src/CatchBoundary";
