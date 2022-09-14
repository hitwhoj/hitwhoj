import type { LoaderArgs } from "@remix-run/node";
import { invariant } from "~/utils/invariant";
import { json } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { db } from "~/utils/server/db.server";
import { idScheme } from "~/utils/scheme";

interface Problem {
  id: number;
  title: string;
  isAc: boolean;
  subNum: number;
  TimePenalty: number;
}
interface TableData {
  userId: number;
  username: string;
  key: number;
  solved: number;
  problemList: Array<Problem>;
}

export async function loader({ params }: LoaderArgs) {
  const contestId = invariant(idScheme, params.contestId, { status: 404 });
  // 获取比赛所含题目信息
  const problems = await db.contestProblem.findMany({
    where: { contestId },
    orderBy: { rank: "asc" },
    include: {
      problem: true,
    },
  });
  // 获取记录信息
  const records = await db.record.findMany({
    where: { contestId },
    include: {
      submitter: {
        select: { id: true, username: true },
      },
    },
  });
  const tableHeader = ["提交者", "总得分", "解题数"];
  problems.forEach((problem) => {
    tableHeader.push(problem.problem.title);
  });

  let tableData = [] as Array<TableData>;
  records.forEach((item) => {
    let exist = false;
    tableData.forEach((object) => {
      if (object.userId === item.submitterId) {
        exist = true;
        object.key += item.score;
        object.problemList.forEach((problem) => {
          if (problem.id === item.problemId) {
            problem.subNum += 1;
            problem.isAc = item.status === "Accepted" ? true : problem.isAc;
          }
        });
      }
    });
    if (!exist) {
      const tableDataItem = {
        userId: item.submitter.id,
        username: item.submitter.username,
        key: 0,
        solved: 0,
        problemList: [] as Array<Problem>,
      };
      problems.forEach((problem) => {
        tableDataItem.problemList.push({
          id: problem.problemId,
          title: problem.problem.title,
          isAc:
            problem.problemId === item.problemId && item.status === "Accepted",
          subNum: problem.problemId === item.problemId ? 1 : 0,
          TimePenalty: 0,
        });
      });
      tableData.push(tableDataItem);
    }
  });

  tableData.sort((x, y) => {
    if (x.key < y.key) {
      return 1;
    } else if (x.key > y.key) {
      return -1;
    } else {
      return 0;
    }
  });

  tableData.forEach((item) => {
    item.problemList.forEach((problem) => {
      if (problem.isAc) {
        item.solved += 1;
      }
    });
  });

  return json({ tableData, tableHeader });
}

export default function RankView() {
  const { tableData, tableHeader } = useLoaderData<typeof loader>();
  return (
    <div className="overflow-x-auto">
      <table className="table w-full">
        <thead>
          <tr>
            <th></th>
            {tableHeader.map((item, index) => {
              return <th key={index}>{item}</th>;
            })}
          </tr>
        </thead>
        <tbody>
          {tableData.map((item, index) => {
            return (
              <tr key={index}>
                <th>{index + 1}</th>
                <td>{item.username}</td>
                <td>{item.key}</td>
                <td>{item.solved}</td>
                {item.problemList.map((problem) => {
                  const isAc = problem.isAc;
                  const badge = isAc ? (
                    <div className="badge badge-xs badge-accent">+</div>
                  ) : (
                    <div className="badge badge-xs badge-error">-</div>
                  );
                  let element = (
                    <td>
                      <div>
                        {badge} {problem.subNum}/无罚时数据
                      </div>
                    </td>
                  );
                  return element;
                })}
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

export { ErrorBoundary } from "~/src/ErrorBoundary";
export { CatchBoundary } from "~/src/CatchBoundary";
