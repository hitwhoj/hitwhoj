import type {
  ActionFunction,
  LoaderFunction,
  MetaFunction,
} from "@remix-run/node";
import { redirect } from "@remix-run/node";
import { Form, Link, useLoaderData } from "@remix-run/react";
import { db } from "~/utils/server/db.server";
import { teamNameScheme } from "~/utils/scheme";
import type { Team } from "@prisma/client";
import { invariant } from "~/utils/invariant";
import { Button, Grid, Input, Space, Table } from "@arco-design/web-react";

export const meta: MetaFunction = () => ({
  title: "Team List",
});

export const action: ActionFunction<Response> = async ({ request }) => {
  const form = await request.formData();
  const teamName = invariant(teamNameScheme.safeParse(form.get("teamName")));

  if (!teamName)
    throw new Response("teamName is not registered", { status: 400 });

  const team = await db.team.findUnique({
    select: { id: true },
    where: { name: teamName },
  });
  if (!team) {
    throw new Response("team is not registered", { status: 400 });
  }

  return redirect(`/team/${team.id}`);
};

type LoaderData = {
  teams: Team[];
};

export const loader: LoaderFunction<LoaderData> = async () => {
  const teams = await db.team.findMany({
    take: 20,
    orderBy: {
      name: "asc",
    },
  });

  return { teams };
};

export default function TeamList() {
  const { teams } = useLoaderData<LoaderData>();
  const tableColumns = [
    {
      title: "#",
      dataIndex: "id",
      render: (col: string) => <Link to={`/problemset/${col}`}>{col}</Link>,
    },
    {
      title: "Name",
      dataIndex: "name",
      render: (col: string, team: Team) => (
        <Link to={`/team/${team.id}`}>{col}</Link>
      ),
    },
  ];

  return (
    <>
      <Grid.Row
        justify="space-between"
        align="center"
        style={{
          height: "3rem",
        }}
      >
        <Form
          method="post"
          style={{
            display: "flex",
            flexDirection: "column",
          }}
        >
          <Space>
            <Input
              type="text"
              name="teamName"
              placeholder="teamName"
              required
            />
            <Button htmlType="submit" type="primary">
              go
            </Button>
          </Space>
        </Form>
        <Link to="new">
          <Button type="primary">Create Team</Button>
        </Link>
      </Grid.Row>
      <Table
        columns={tableColumns}
        data={teams}
        hover={false}
        rowKey="id"
        pagination={{
          total: teams.length,
          defaultPageSize: 20,
          showTotal: (total: number) => `Total ${Math.ceil(total / 20)} pages`,
          showJumper: true,
        }}
      />
    </>
  );
}
