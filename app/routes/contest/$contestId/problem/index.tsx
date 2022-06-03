import { List, Space, Tag } from "@arco-design/web-react";
import type { Problem, Record } from "@prisma/client";
import type { LoaderFunction } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { Link } from "react-router-dom";
import { invariant } from "~/utils/invariant";
import { idScheme } from "~/utils/scheme";
import { db } from "~/utils/server/db.server";
import { findSessionUid } from "~/utils/sessions";

type LoaderData = {
  problems: {
    rank: number;
    problem: Pick<Problem, "title"> & {
      relatedRecords: Pick<Record, "status">[];
    };
  }[];
};

export const loader: LoaderFunction<LoaderData> = async ({
  request,
  params,
}) => {
  const contestId = invariant(idScheme, params.contestId, { status: 404 });
  const self = await findSessionUid(request);

  const problems = await db.contestProblem.findMany({
    where: {
      contestId,
    },
    select: {
      rank: true,
      problem: {
        select: {
          title: true,
          relatedRecords: {
            where: { contestId, submitterId: self },
            select: { status: true },
          },
        },
      },
    },
  });

  return { problems };
};

export default function ContestProblemIndex() {
  const { problems } = useLoaderData<LoaderData>();

  return (
    <List
      dataSource={problems}
      bordered={false}
      render={({ rank, problem }) => {
        const problemId = String.fromCharCode(0x40 + rank);
        const accepted =
          problem.relatedRecords.findIndex(
            (record) => record.status === "Accepted"
          ) > -1;
        const failed = problem.relatedRecords.length > 0 && !accepted;
        const color = accepted ? "green" : failed ? "red" : undefined;

        return (
          <List.Item>
            <Space size="large">
              <Tag color={color}>{problemId}</Tag>
              <Link to={problemId}>{problem.title}</Link>
            </Space>
          </List.Item>
        );
      }}
    />
  );
}
