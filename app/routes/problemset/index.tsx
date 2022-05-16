import type { ProblemSet } from "@prisma/client";
import type { LoaderFunction, MetaFunction } from "@remix-run/node";
import { json } from "@remix-run/node";
import { Link, useLoaderData } from "@remix-run/react";
import { db } from "~/utils/db.server";
import { Table, Grid, Button } from "@arco-design/web-react";

type LoaderData = {
  problemSets: ProblemSet[];
};

export const loader: LoaderFunction = async () => {
  const problemSets = await db.problemSet.findMany({
    orderBy: {
      id: "asc",
    },
    take: 20,
  });

  return json({ problemSets });
};

export const meta: MetaFunction = () => ({
  title: "题单列表 - HITwh OJ",
});

export default function ProblemsetList() {
  const { problemSets } = useLoaderData<LoaderData>();
  const tableColumns = [
    {
      title: "#",
      dataIndex: "id",
      render: (col: string) => <Link to={`${col}`}>{col}</Link>,
    },
    {
      title: "Title",
      dataIndex: "title",
      render: (col: string, problemSet: ProblemSet) => (
        <Link
          to={`/problemset/${problemSet.id}`}
          // TODO: 写个hover样式qwq
          style={{}}
        >
          {col}
        </Link>
      ),
    },
  ];

  return (
    <>
      <Grid.Row
        justify="end"
        align="center"
        style={{
          height: "3rem",
        }}
      >
        <Link to="new">
          <Button type="primary">Create ProblemSet</Button>
        </Link>
      </Grid.Row>
      <Table
        columns={tableColumns}
        data={problemSets}
        hover={false}
        pagination={{
          total: problemSets.length,
          defaultPageSize: 20,
          showTotal: (total: number) => `Total ${Math.ceil(total / 20)} pages`,
          showJumper: true,
        }}
      />
    </>
  );
}

export { ErrorBoundary } from "~/src/ErrorBoundary";
export { CatchBoundary } from "~/src/CatchBoundary";
