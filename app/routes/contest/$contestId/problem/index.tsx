import { Space, Statistic, Table } from "@arco-design/web-react";
import { IconCheck, IconClose } from "@arco-design/web-react/icon";
import type { Contest, Problem, Record } from "@prisma/client";
import type { LoaderFunction } from "@remix-run/node";
import { Link, useLoaderData, useNavigate } from "@remix-run/react";
import { invariant } from "~/utils/invariant";
import { checkContestProblemReadPermission } from "~/utils/permission/contest";
import { idScheme } from "~/utils/scheme";
import { db } from "~/utils/server/db.server";
import { findSessionUserOptional } from "~/utils/sessions";

type LoaderData = {
  problems: { rank: number; problem: Pick<Problem, "title"> }[];
  records: { rank: number; records: Pick<Record, "status">[] }[];
  contest: Pick<Contest, "beginTime" | "endTime">;
};

export const loader: LoaderFunction<LoaderData> = async ({
  request,
  params,
}) => {
  const contestId = invariant(idScheme, params.contestId, { status: 404 });
  const self = await findSessionUserOptional(request);
  await checkContestProblemReadPermission(request, contestId);

  const problems = await db.contestProblem.findMany({
    where: { contestId },
    orderBy: {
      rank: "asc",
    },
    select: {
      rank: true,
      problem: {
        select: {
          title: true,
        },
      },
    },
  });

  // 已经登录用户的提交记录
  const records = self
    ? await db.contestProblem.findMany({
        where: { contestId },
        select: {
          rank: true,
          problem: {
            select: {
              relatedRecords: {
                where: { submitterId: self.id, contestId },
                select: { status: true },
              },
            },
          },
        },
      })
    : [];

  const contest = (await db.contest.findUnique({
    where: { id: contestId },
    select: {
      beginTime: true,
      endTime: true,
    },
  }))!;

  return {
    problems,
    records: records.map(({ rank, problem: { relatedRecords: records } }) => ({
      rank,
      records,
    })),
    contest,
  };
};

export default function ContestProblemIndex() {
  const { problems, records, contest } = useLoaderData<LoaderData>();

  const started = new Date() > new Date(contest.beginTime);
  const navigate = useNavigate();

  if (!started) {
    return (
      <div style={{ textAlign: "center", marginTop: 100 }}>
        <Statistic.Countdown
          title="距离比赛开始还有"
          value={new Date(contest.beginTime)}
          format="D 天 H 时 m 分 s 秒"
          onFinish={() => navigate(".")}
        />
      </div>
    );
  }

  return (
    <Table
      columns={[
        {
          title: "#",
          dataIndex: "rank",
          align: "center",
          cellStyle: { width: "5%", whiteSpace: "nowrap" },
          render(rank) {
            return String.fromCharCode(0x40 + rank);
          },
        },
        {
          title: "题目",
          render(_, { rank, problem }) {
            const problemId = String.fromCharCode(0x40 + rank);
            // 是否已经通过这道题目
            const accepted =
              records.findIndex(
                (rec) =>
                  rec.rank === rank &&
                  rec.records.findIndex(
                    ({ status }) => status === "Accepted"
                  ) !== -1
              ) > -1;
            // 是否有失败的提交记录
            const failed =
              records.findIndex(
                (rec) => rec.rank === rank && rec.records.length > 0
              ) !== -1 && !accepted;

            return (
              <Link to={problemId} target="_blank">
                <Space>
                  {problem.title}
                  {accepted ? (
                    <IconCheck style={{ color: "rgb(var(--green-6))" }} />
                  ) : failed ? (
                    <IconClose style={{ color: "rgb(var(--red-6))" }} />
                  ) : null}
                </Space>
              </Link>
            );
          },
        },
      ]}
      data={problems}
      hover={false}
      border={false}
      pagination={false}
    />
  );
}

export { ErrorBoundary } from "~/src/ErrorBoundary";
export { CatchBoundary } from "~/src/CatchBoundary";
