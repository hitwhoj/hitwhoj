import { Problem } from "@prisma/client";
import { LoaderFunction, json, useLoaderData, MetaFunction, Link } from "remix";
import { db } from "~/utils/db.server";
import { Table } from "@arco-design/web-react";

// TODO: 分页
type LoaderData = {
  problems: Pick<Problem, "pid" | "title" | "private">[];
};

export const loader: LoaderFunction = async () => {
  const problems = await db.problem.findMany({
    orderBy: [{ pid: "asc" }],
    take: 20,
    select: {
      pid: true,
      title: true,
      private: true,
    },
  });

  return json({ problems });
};

export const meta: MetaFunction = () => ({
  title: "Problem List",
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
      title: "PID",
      dataIndex: "pid",
      render: (col: string) => <Link to={`${col}`}>{col}</Link>,
    },
    {
      title: "Title",
      dataIndex: "title",
      render: (
        col: string,
        problem: Pick<Problem, "pid" | "title" | "private">
      ) => (
        <Link
          to={`${problem.pid}`}
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
      rowKey="pid"
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
