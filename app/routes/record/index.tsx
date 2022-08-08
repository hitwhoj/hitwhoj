import { Typography } from "@arco-design/web-react";
import type { LoaderArgs, MetaFunction } from "@remix-run/node";
import { json } from "@remix-run/node";
import { Link, useLoaderData } from "@remix-run/react";
import { ProblemLink } from "~/src/problem/ProblemLink";
import { RecordStatus } from "~/src/record/RecordStatus";
import { TableList } from "~/src/TableList";
import { UserLink } from "~/src/user/UserLink";
import { selectUserData } from "~/utils/db/user";
import { db } from "~/utils/server/db.server";
import { formatDateTime } from "~/utils/tools";

export async function loader(_: LoaderArgs) {
  const records = await db.record.findMany({
    where: { contest: null },
    orderBy: [{ id: "desc" }],
    take: 100,
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
          ...selectUserData,
        },
      },
    },
  });

  return json({ records });
}

export const meta: MetaFunction = () => ({
  title: "评测记录 - HITwh OJ",
});

export default function RecordList() {
  const { records } = useLoaderData<typeof loader>();

  return (
    <Typography>
      <Typography.Title heading={3}>评测记录</Typography.Title>

      <Typography.Paragraph>
        您只能查询到最近的 100 条评测记录（因为我们懒得写分页）。
      </Typography.Paragraph>

      <Typography.Paragraph>
        <TableList
          data={records}
          columns={[
            {
              title: "#",
              render: ({ id }) => id,
              align: "center",
              minimize: true,
            },
            {
              title: "状态",
              render: (record) => (
                <Link to={`/record/${record.id}`}>
                  <RecordStatus status={record.status} />
                </Link>
              ),
              minimize: true,
            },
            {
              title: "题目",
              render: ({ problem }) => <ProblemLink problem={problem} />,
            },
            {
              title: "用户",
              render: ({ submitter }) => <UserLink user={submitter} />,
              align: "center",
              minimize: true,
            },
            {
              title: "提交时间",
              render: ({ submittedAt }) => formatDateTime(submittedAt),
              align: "center",
              minimize: true,
            },
          ]}
        />
      </Typography.Paragraph>
    </Typography>
  );
}

export { ErrorBoundary } from "~/src/ErrorBoundary";
export { CatchBoundary } from "~/src/CatchBoundary";
