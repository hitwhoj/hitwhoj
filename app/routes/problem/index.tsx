import type { LoaderFunction, MetaFunction } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { Typography } from "@arco-design/web-react";
import type { ProblemListData } from "~/utils/db/problem";
import { selectProblemListData } from "~/utils/db/problem";
import { ProblemList } from "~/src/problem/ProblemList";
import { db } from "~/utils/server/db.server";

// TODO: 分页
type LoaderData = {
  problems: (ProblemListData & {
    _count: {
      relatedRecords: number;
    };
  })[];
};

export const loader: LoaderFunction<LoaderData> = async () => {
  // 全部展示，私有题目会有个标识，普通用户应该自己有自知之明
  const problems = await db.problem.findMany({
    where: { team: null },
    orderBy: [{ id: "asc" }],
    select: {
      ...selectProblemListData,
      _count: {
        select: {
          relatedRecords: true,
        },
      },
    },
  });

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
        <ProblemList
          problems={problems}
          columns={[
            {
              title: "提交",
              dataIndex: "_count.relatedRecords",
              align: "center",
              cellStyle: { width: "5%", whiteSpace: "nowrap" },
            },
          ]}
        />
      </Typography.Paragraph>
    </Typography>
  );
}

export { ErrorBoundary } from "~/src/ErrorBoundary";
export { CatchBoundary } from "~/src/CatchBoundary";
