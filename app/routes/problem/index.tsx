import type { Problem } from "@prisma/client";
import type { LoaderFunction, MetaFunction } from "@remix-run/node";
import { Link, useLoaderData } from "@remix-run/react";
import { Table } from "@arco-design/web-react";
import { findSessionUserOptional } from "~/utils/sessions";
import type { ProblemListData } from "~/utils/db/problem";
import { findProblemMany } from "~/utils/db/problem";
import { isAdmin, isUser } from "~/utils/permission";

// TODO: 分页
type LoaderData = {
  problems: ProblemListData[];
};

export const loader: LoaderFunction<LoaderData> = async ({ request }) => {
  const self = await findSessionUserOptional(request);

  let problems: ProblemListData[];

  // 访客，只能访问到非团队所有的公开的题目
  if (!self) {
    problems = await findProblemMany({
      private: false,
      team: null,
    });
  }
  // 系统管理员，可以访问所有题目
  else if (isAdmin(self.role)) {
    problems = await findProblemMany({
      team: null,
    });
  }
  // 普通用户，只能访问到公开的非团队题目或者自己创建的题目
  else if (isUser(self.role)) {
    problems = await findProblemMany({
      OR: [
        // 公开的非团队题目
        { private: false, team: null },
        // 自己创建的题目
        { creator: { id: self.id }, team: null },
      ],
    });
  }
  // 封禁用户，啥也看不了
  else {
    problems = [];
  }

  return { problems };
};

export const meta: MetaFunction = () => ({
  title: "题目列表 - HITwh OJ",
});

export default function ProblemIndex() {
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
      render: (col: string) => <Link to={`/problem/${col}`}>{col}</Link>,
    },
    {
      title: "Title",
      dataIndex: "title",
      render: (
        col: string,
        problem: Pick<Problem, "id" | "title" | "private">
      ) => (
        <Link
          to={`/problem/${problem.id}`}
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
      rowKey="id"
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
