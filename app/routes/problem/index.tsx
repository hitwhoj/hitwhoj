import type { Problem } from "@prisma/client";
import { TeamMemberRole } from "@prisma/client";
import type { LoaderFunction, MetaFunction } from "@remix-run/node";
import { Link, useLoaderData } from "@remix-run/react";
import { Table } from "@arco-design/web-react";
import { findSessionUserOptional } from "~/utils/sessions";
import type { ProblemList } from "~/utils/db/problem";
import { findProblemMany } from "~/utils/db/problem";
import { isAdmin, isUser } from "~/utils/permission";

// TODO: 分页
type LoaderData = {
  problems: ProblemList;
};

export const loader: LoaderFunction<LoaderData> = async ({ request }) => {
  const self = await findSessionUserOptional(request);

  let problems: ProblemList;

  // 访客，只能访问到公开的题目
  if (!self) {
    problems = await findProblemMany({
      private: true,
    });
  }
  // 系统管理员，可以访问所有题目
  else if (isAdmin(self.role)) {
    problems = await findProblemMany({});
  }
  // 普通用户，只能访问到自己创建的题目，或者团队内担任为管理员的题目
  else if (isUser(self.role)) {
    problems = await findProblemMany({
      OR: [
        { creator: { id: self.id } },
        {
          team: {
            is: {
              members: {
                some: {
                  user: { id: self.id },
                  role: { in: [TeamMemberRole.Admin, TeamMemberRole.Owner] },
                },
              },
            },
          },
        },
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

export default function ProblemIndexList() {
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
