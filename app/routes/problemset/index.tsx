import type { ProblemSet } from "@prisma/client";
import type { LoaderFunction, MetaFunction } from "@remix-run/node";
import { Link, useLoaderData } from "@remix-run/react";
import { db } from "~/utils/server/db.server";
import { Table, Grid, Button, Typography, Empty } from "@arco-design/web-react";
import { IconPlus } from "@arco-design/web-react/icon";
import { ProblemSetLink } from "~/src/problemset/ProblemSetLink";

type LoaderData = {
  problemSets: (Pick<ProblemSet, "id" | "title" | "private"> & {
    _count: {
      problems: number;
    };
  })[];
};

export const loader: LoaderFunction<LoaderData> = async () => {
  const problemSets = await db.problemSet.findMany({
    where: { team: null },
    orderBy: [{ id: "asc" }],
    select: {
      id: true,
      title: true,
      private: true,
      _count: {
        select: {
          problems: true,
        },
      },
    },
  });

  return { problemSets };
};

export const meta: MetaFunction<LoaderData> = () => ({
  title: "题单列表 - HITwh OJ",
});

export default function ProblemsetList() {
  const { problemSets } = useLoaderData<LoaderData>();

  return (
    <Typography>
      <Typography.Title heading={3}>
        <Grid.Row justify="space-between" align="center">
          <span>题单列表</span>
          <Link to="new">
            <Button type="primary" icon={<IconPlus />}>
              创建题单
            </Button>
          </Link>
        </Grid.Row>
      </Typography.Title>

      <Typography.Paragraph>
        <Table
          columns={[
            {
              title: "#",
              dataIndex: "id",
              cellStyle: { width: "5%", whiteSpace: "nowrap" },
            },
            {
              title: "题单",
              render: (_, problemset) => (
                <ProblemSetLink problemset={problemset} />
              ),
            },
            {
              title: "题目数",
              dataIndex: "_count.problems",
              align: "center",
              cellStyle: { width: "5%", whiteSpace: "nowrap" },
            },
          ]}
          data={problemSets}
          rowKey="id"
          noDataElement={<Empty description="没有题单" />}
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
