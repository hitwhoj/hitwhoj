import { Space, Table, Typography } from "@arco-design/web-react";
import { IconEyeInvisible } from "@arco-design/web-react/icon";
import type { Problem, Record, User } from "@prisma/client";
import type { LoaderFunction, MetaFunction } from "@remix-run/node";
import { Link, useLoaderData } from "@remix-run/react";
import { RecordStatus } from "~/src/record/RecordStatus";
import { db } from "~/utils/server/db.server";

type LoaderData = {
  records: (Pick<Record, "id" | "status" | "submittedAt"> & {
    problem: Pick<Problem, "id" | "title" | "private">;
    submitter: Pick<User, "id" | "username" | "nickname">;
  })[];
};

export const loader: LoaderFunction<LoaderData> = async () => {
  const records = await db.record.findMany({
    orderBy: {
      submittedAt: "desc",
    },
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

  const columns = [
    {
      title: "#",
      dataIndex: "id",
      width: 32,
    },
    {
      title: "状态",
      dataIndex: "status",
      render: (
        col: string,
        record: Pick<Record, "id" | "status" | "submittedAt"> & {
          problem: Pick<Problem, "id" | "title" | "private">;
          submitter: Pick<User, "id" | "username" | "nickname">;
        }
      ) => (
        <Link to={`/record/${record.id}`}>
          <RecordStatus status={col} />
        </Link>
      ),
    },
    {
      title: "题目",
      dataIndex: "problem.title",
      render: (
        col: string,
        record: Pick<Record, "id" | "status" | "submittedAt"> & {
          problem: Pick<Problem, "id" | "title" | "private">;
          submitter: Pick<User, "id" | "username" | "nickname">;
        }
      ) => (
        <Link to={`/problem/${record.problem.id}`}>
          <Space>
            <span>{col}</span>
            {record.problem.private && <IconEyeInvisible />}
          </Space>
        </Link>
      ),
    },
    {
      title: "用户",
      dataIndex: "submitter",
      render: (
        user: Pick<User, "id" | "username" | "nickname">,
        record: Pick<Record, "id" | "status" | "submittedAt"> & {
          problem: Pick<Problem, "id" | "title" | "private">;
          submitter: Pick<User, "id" | "username" | "nickname">;
        }
      ) => (
        <Link to={`/user/${record.submitter.id}`}>
          {user.nickname ? (
            <span>
              {user.nickname}{" "}
              <span style={{ color: "rgb(var(--gray-6))" }}>
                ({user.username})
              </span>
            </span>
          ) : (
            user.username
          )}
        </Link>
      ),
    },
    {
      title: "提交时间",
      dataIndex: "submittedAt",
      render: (col: string) => (
        <span>
          {new Intl.DateTimeFormat("zh-CN", {
            year: "numeric",
            month: "numeric",
            day: "numeric",
            hour: "numeric",
            minute: "numeric",
            second: "numeric",
          }).format(new Date(col))}
        </span>
      ),
    },
  ];

  return (
    <Typography>
      <Typography.Title heading={3}>评测记录</Typography.Title>
      <Typography.Paragraph>
        <Table
          columns={columns}
          data={records}
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
