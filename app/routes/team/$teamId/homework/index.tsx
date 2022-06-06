import type { LoaderFunction, MetaFunction } from "@remix-run/node";
import { Link, useLoaderData } from "@remix-run/react";
import { db } from "~/utils/server/db.server";
import type { Contest } from "@prisma/client";
import { ContestSystem } from "@prisma/client";
import { idScheme } from "~/utils/scheme";
import { invariant } from "~/utils/invariant";
import { Button, Grid, Table } from "@arco-design/web-react";

type LoaderData = {
  homeworks: Pick<Contest, "id" | "title">[];
};

export const meta: MetaFunction<LoaderData> = () => ({
  title: `Team Homework - HITwh OJ`,
});

export const loader: LoaderFunction<LoaderData> = async ({ params }) => {
  const teamId = invariant(idScheme.safeParse(params.teamId));

  const homeworks = await db.team.findUnique({
    where: { id: teamId },
    select: {
      contests: {
        where: {
          system: ContestSystem.Homework,
        },
        select: {
          id: true,
          title: true,
        },
      },
    },
  });

  if (!homeworks) {
    throw new Response("Team not found", { status: 404 });
  }

  return {
    homeworks: homeworks.contests,
  };
};

const tableColumns = [
  {
    title: "#",
    dataIndex: "id",
    render: (col: string) => <Link to={`/contest/${col}`}>{col}</Link>,
  },
  {
    title: "Title",
    dataIndex: "title",
    render: (col: string, homework: Pick<Contest, "id" | "title">) => (
      <Link to={`/contest/${homework.id}`}>{col}</Link>
    ),
  },
];

export default function HomeworkList() {
  const { homeworks } = useLoaderData<LoaderData>();

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
          <Button type="primary">Create Homework</Button>
        </Link>
      </Grid.Row>
      <Table
        columns={tableColumns}
        data={homeworks}
        hover={false}
        rowKey="id"
        pagination={{
          total: homeworks.length,
          defaultPageSize: 20,
          showTotal: (total: number) => `Total ${Math.ceil(total / 20)} pages`,
          showJumper: true,
        }}
        noDataElement={
          <div style={{ color: "var(--color-text-2)" }}>没有作业？好耶！</div>
        }
      />
    </>
  );
}
