import type { Problem } from "@prisma/client";
import type { LoaderFunction, MetaFunction } from "@remix-run/node";
import { json } from "@remix-run/node";
import { Link, useLoaderData } from "@remix-run/react";
import { db } from "~/utils/db.server";
import { Table } from "@arco-design/web-react";

// TODO: 分页
type LoaderData = {
  problems: Pick<Problem, "id" | "title" | "private">[];
};

export const loader: LoaderFunction = async () => {
  // TODO: 按照用户是否有题目的访问权限来筛选题目

  const problems = await db.problem.findMany({
    orderBy: [{ id: "asc" }],
    take: 20,
    select: {
      id: true,
      title: true,
      private: true,
    },
  });

  return json({ problems });
};

export const meta: MetaFunction = () => ({
  title: "题目列表 - HITwh OJ",
});

export default function ProblemList() {
  const { problems } = useLoaderData<LoaderData>();
  // 一个备选方案
  /**
   * <List
      header="Problem List"
      dataSource={ problems }
      render={(problem, index) => (
        <List.Item key={index}>
          <Space>
            <span> { problem.title } </span>
          </Space>
        </List.Item>
      )}
    />
   *  */
  const tableColumns = [
    {
      title: "#",
      dataIndex: "id",
      render: (col: string) => <Link to={`${col}`}>{col}</Link>,
    },
    {
      title: "Title",
      dataIndex: "title",
      render: (
        col: string,
        problem: Pick<Problem, "id" | "title" | "private">
      ) => (
        <Link
          to={`${problem.id}`}
          // TODO: 写个hover样式qwq
          style={{}}
        >
          {col}
        </Link>
      ),
    },
  ];

  return (
    <Table
      columns={tableColumns}
      data={problems}
      hover={false}
      // TODO: 毕竟这是个假的分页qwq
      pagination={{
        total: problems.length,
        defaultPageSize: 20,
        showTotal: (total: number) => `Total ${Math.ceil(total / 20)} pages`,
        showJumper: true,
      }}
    />
  );
}

export { ErrorBoundary } from "~/src/ErrorBoundary";
export { CatchBoundary } from "~/src/CatchBoundary";
