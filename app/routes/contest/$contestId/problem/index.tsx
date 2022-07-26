import { Space, Statistic } from "@arco-design/web-react";
import { IconCheck, IconClose } from "@arco-design/web-react/icon";
import type { Contest, Problem, Record } from "@prisma/client";
import type { LoaderFunction } from "@remix-run/node";
import { Link, useLoaderData, useNavigate } from "@remix-run/react";
import { TableList } from "~/src/TableList";
import { invariant } from "~/utils/invariant";
import { permissionContestProblemRead } from "~/utils/permission/contest";
import { idScheme } from "~/utils/scheme";
import { db } from "~/utils/server/db.server";
import { findSessionUserOptional } from "~/utils/sessions";

type LoaderData = {
  contest: Pick<Contest, "beginTime" | "endTime"> & {
    problems: {
      rank: number;
      problem: Pick<Problem, "title"> & {
        relatedRecords: Pick<Record, "status">[];
      };
    }[];
  };
};

export const loader: LoaderFunction<LoaderData> = async ({
  request,
  params,
}) => {
  const contestId = invariant(idScheme, params.contestId, { status: 404 });
  await permissionContestProblemRead.ensure(request, contestId);
  const self = await findSessionUserOptional(request);

  const contest = await db.contest.findUnique({
    where: { id: contestId },
    select: {
      beginTime: true,
      endTime: true,
      problems: {
        orderBy: { rank: "asc" },
        select: {
          rank: true,
          problem: {
            select: {
              title: true,
              relatedRecords: {
                where: self
                  ? { contestId, submitterId: self.id }
                  : { contestId, submitterId: -1 },
                select: { status: true },
              },
            },
          },
        },
      },
    },
  });

  if (!contest) {
    throw new Response("Contest not found", { status: 404 });
  }

  return { contest };
};

export default function ContestProblemIndex() {
  const { contest } = useLoaderData<LoaderData>();

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
    <TableList
      data={contest.problems.map(({ rank, problem }) => ({
        id: rank,
        ...problem,
      }))}
      columns={[
        {
          title: "#",
          render: ({ id: rank }) => String.fromCharCode(0x40 + rank),
          align: "center",
          minimize: true,
        },
        {
          title: "题目",
          render({ id: rank, title, relatedRecords: records }) {
            const problemId = String.fromCharCode(0x40 + rank);
            // 是否已经通过这道题目
            const accepted = records.some(
              ({ status }) => status === "Accepted"
            );
            // 是否有失败的提交记录
            const failed = records.length > 0 && !accepted;

            return (
              <Link to={problemId} target="_blank">
                <Space>
                  {title}
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
    />
  );
}

export { ErrorBoundary } from "~/src/ErrorBoundary";
export { CatchBoundary } from "~/src/CatchBoundary";
