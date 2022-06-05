import { List, Space, Tag } from "@arco-design/web-react";
import { IconCheck, IconClose } from "@arco-design/web-react/icon";
import type { Problem, Record } from "@prisma/client";
import type { LoaderFunction } from "@remix-run/node";
import { Link, useLoaderData } from "@remix-run/react";
import { invariant } from "~/utils/invariant";
import { checkContestProblemReadPermission } from "~/utils/permission/contest";
import { idScheme } from "~/utils/scheme";
import { db } from "~/utils/server/db.server";
import { findSessionUserOptional } from "~/utils/sessions";

type LoaderData = {
  problems: { rank: number; problem: Pick<Problem, "title"> }[];
  records: { rank: number; records: Pick<Record, "status">[] }[];
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
                where: { submitterId: self.id },
                select: { status: true },
              },
            },
          },
        },
      })
    : [];

  return {
    problems,
    records: records.map(({ rank, problem: { relatedRecords: records } }) => ({
      rank,
      records,
    })),
  };
};

export default function ContestProblemIndex() {
  const { problems, records } = useLoaderData<LoaderData>();

  return (
    <List
      dataSource={problems}
      bordered={false}
      render={({ rank, problem }) => {
        const problemId = String.fromCharCode(0x40 + rank);
        // 是否已经通过这道题目
        const accepted =
          records.findIndex(
            (rec) =>
              rec.rank === rank &&
              rec.records.findIndex(({ status }) => status === "Accepted") !==
                -1
          ) > -1;
        // 是否有失败的提交记录
        const failed =
          records.findIndex(
            (rec) => rec.rank === rank && rec.records.length > 0
          ) !== -1 && !accepted;

        return (
          <List.Item>
            <Space size="large">
              <Tag>{problemId}</Tag>
              {accepted ? (
                <IconCheck style={{ color: "rgb(var(--green-6))" }} />
              ) : failed ? (
                <IconClose style={{ color: "rgb(var(--red-6))" }} />
              ) : (
                <IconClose style={{ color: "transparent" }} />
              )}
              <Link to={problemId} target="_blank">
                {problem.title}
              </Link>
            </Space>
          </List.Item>
        );
      }}
    />
  );
}
