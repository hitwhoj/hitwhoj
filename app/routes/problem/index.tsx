import type { LoaderFunction, MetaFunction } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { Typography } from "@arco-design/web-react";
import type { ProblemListData } from "~/utils/db/problem";
import { selectProblemListData } from "~/utils/db/problem";
import { ProblemList } from "~/src/problem/ProblemList";
import { db } from "~/utils/server/db.server";
import { findSessionUserOptional } from "~/utils/sessions";
import { isAdmin } from "~/utils/permission";

// TODO: 分页
type LoaderData = {
  problems: (ProblemListData & {
    _count: {
      relatedRecords: number;
    };
  })[];
};

export const loader: LoaderFunction<LoaderData> = async ({ request }) => {
  const self = await findSessionUserOptional(request);

  const problems = await db.problem.findMany({
    // 只有系统管理员可以看到私有题目
    where:
      self && isAdmin(self.role)
        ? { team: null }
        : { team: null, private: false },
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
