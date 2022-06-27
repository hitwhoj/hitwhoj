import type { LoaderFunction, MetaFunction } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { Table, Typography } from "@arco-design/web-react";
import type { ProblemListData } from "~/utils/db/problem";
import { findProblemMany } from "~/utils/db/problem";
import { ProblemLink } from "~/src/problem/ProblemLink";

// TODO: 分页
type LoaderData = {
  problems: ProblemListData[];
};

export const loader: LoaderFunction<LoaderData> = async () => {
  // 全部展示，私有题目会有个标识，普通用户应该自己有自知之明
  const problems = await findProblemMany({ team: null });

  return { problems };
};

export const meta: MetaFunction = () => ({
  title: "题目列表 - HITwh OJ",
});

export default function ProblemIndex() {
  const { problems } = useLoaderData<LoaderData>();

  return (
    <Typography>
      <Typography.Title heading={3}>题目列表</Typography.Title>

      <Typography.Paragraph>
        <Table
          columns={[
            {
              title: "#",
              dataIndex: "id",
              cellStyle: { width: "5%", whiteSpace: "nowrap" },
            },
            {
              title: "题目",
              dataIndex: "title",
              render: (_, problem) => <ProblemLink problem={problem} />,
            },
            {
              title: "提交",
              dataIndex: "_count.relatedRecords",
              align: "center",
              cellStyle: { width: "5%", whiteSpace: "nowrap" },
            },
          ]}
          data={problems}
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
