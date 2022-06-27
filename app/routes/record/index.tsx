import { Table, Typography } from "@arco-design/web-react";
import type { Problem, Record, User } from "@prisma/client";
import type { LoaderFunction, MetaFunction } from "@remix-run/node";
import { Link, useLoaderData } from "@remix-run/react";
import { ProblemLink } from "~/src/problem/ProblemLink";
import { RecordStatus } from "~/src/record/RecordStatus";
import { UserLink } from "~/src/user/UserLink";
import { db } from "~/utils/server/db.server";
import { formatDateTime } from "~/utils/tools";

type LoaderData = {
  records: (Pick<Record, "id" | "status" | "submittedAt"> & {
    problem: Pick<Problem, "id" | "title" | "private">;
    submitter: Pick<User, "id" | "username" | "nickname">;
  })[];
};

export const loader: LoaderFunction<LoaderData> = async () => {
  const records = await db.record.findMany({
    where: { contest: null },
    orderBy: [{ id: "desc" }],
    select: {
      id: true,
      status: true,
      submittedAt: true,
      problem: {
        select: {
          id: true,
          title: true,
          private: true,
        },
      },
      submitter: {
        select: {
          id: true,
          username: true,
          nickname: true,
        },
      },
    },
    take: 20,
  });

  return { records };
};

export const meta: MetaFunction = () => ({
  title: "提交记录 - HITwh OJ",
});

export default function RecordList() {
  const { records } = useLoaderData<LoaderData>();

  return (
    <Typography>
      <Typography.Title heading={3}>评测记录</Typography.Title>

      <Typography.Paragraph>
        <Table
          columns={[
            {
              title: "#",
              dataIndex: "id",
              align: "center",
              cellStyle: { width: "5%", whiteSpace: "nowrap" },
            },
            {
              title: "状态",
              dataIndex: "status",
              render: (status, record) => (
                <Link to={`/record/${record.id}`}>
                  <RecordStatus status={status} />
                </Link>
              ),
              cellStyle: { width: "5%", whiteSpace: "nowrap" },
            },
            {
              title: "题目",
              dataIndex: "problem",
              render: (problem) => <ProblemLink problem={problem} />,
            },
            {
              title: "用户",
              dataIndex: "submitter",
              render: (user) => <UserLink user={user} />,
              align: "center",
              cellStyle: { width: "5%", whiteSpace: "nowrap" },
            },
            {
              title: "提交时间",
              dataIndex: "submittedAt",
              render: (time) => formatDateTime(time),
              align: "center",
              cellStyle: { width: "5%", whiteSpace: "nowrap" },
            },
          ]}
          data={records}
          rowKey="id"
          hover={false}
          border={false}
          pagination={false}
        />
      </Typography.Paragraph>
    </Typography>
  );
}

export { ErrorBoundary } from "~/src/ErrorBoundary";
export { CatchBoundary } from "~/src/CatchBoundary";
