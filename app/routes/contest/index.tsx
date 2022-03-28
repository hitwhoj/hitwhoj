import { Contest } from "@prisma/client";
import { LoaderFunction, json, useLoaderData, MetaFunction, Link } from "remix";
import { db } from "~/utils/db.server";
import { Table, Grid, Button } from "@arco-design/web-react";

type LoaderData = {
  contests: Pick<Contest, "cid" | "title" | "beginTime" | "endTime">[];
};

export const loader: LoaderFunction = async () => {
  const contests = await db.contest.findMany({
    orderBy: [{ cid: "asc" }],
    take: 20,
    select: {
      cid: true,
      title: true,
      beginTime: true,
      endTime: true,
    },
  });

  return json({ contests });
};

export const meta: MetaFunction = () => ({
  title: "Contest List",
});

export function ContestState({ begin, end }: { begin: Date; end: Date }) {
  const status =
    begin > new Date() ? "upcoming" : end < new Date() ? "ended" : "running";
  return (
    <span
      style={{
        color: "white",
        backgroundColor:
          status === "upcoming" ? "blue" : status === "ended" ? "red" : "green",
        borderRadius: "10px",
        padding: "0 10px",
      }}
    >
      {status}
    </span>
  );
}

export function ContestList({
  contests,
}: {
  contests: Pick<Contest, "cid" | "title" | "beginTime" | "endTime">[];
}) {
  type ContestDetails = Pick<
    Contest,
    "cid" | "title" | "beginTime" | "endTime"
  >;
  const tableColumns = [
    {
      title: "CID",
      dataIndex: "cid",
      render: (col: string) => <Link to={`${col}`}>{col}</Link>,
    },
    {
      title: "Title",
      dataIndex: "title",
      render: (col: string, contest: ContestDetails) => (
        <Link
          to={`${contest.cid}`}
          // TODO: 写个hover样式qwq
          style={{}}
        >
          {col}
        </Link>
      ),
    },
    {
      title: "Status",
      render: (_: any, contest: ContestDetails) => (
        <ContestState
          begin={new Date(contest.beginTime)}
          end={new Date(contest.endTime)}
        />
      ),
    },
  ];
  return (
    <Table
      columns={tableColumns}
      data={contests}
      rowKey="cid"
      hover={false}
      pagination={{
        total: contests.length,
        defaultPageSize: 20,
        showTotal: (total: number) => `Total ${Math.ceil(total / 20)} pages`,
        showJumper: true,
      }}
    />
  );
}

export default function ContestListIndex() {
  const { contests } = useLoaderData<LoaderData>();

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
          <Button type="primary">Create Contest</Button>
        </Link>
      </Grid.Row>
      <ContestList contests={contests} />
    </>
  );
}
