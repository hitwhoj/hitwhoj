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
import { Button, Grid, Input, Space, Typography } from "@arco-design/web-react";
import { IconPlus } from "@arco-design/web-react/icon";
import { TeamLink } from "~/src/team/TeamLink";
import { TableList } from "~/src/TableList";

export const meta: MetaFunction = () => ({
  title: "团队列表 - HITwh OJ",
});

export const action: ActionFunction<Response> = async ({ request }) => {
  const form = await request.formData();
  const teamName = invariant(teamNameScheme, form.get("teamName"));

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

  return (
    <Typography>
      <Typography.Title heading={3}>
        <Grid.Row justify="space-between" align="center">
          <span>团队列表</span>
          <Link to="new">
            <Button type="primary" icon={<IconPlus />}>
              创建团队
            </Button>
          </Link>
        </Grid.Row>
      </Typography.Title>

      <Typography.Paragraph>
        <Form method="post">
          <Space>
            <Input
              type="text"
              name="teamName"
              placeholder="团队名称"
              required
            />
            <Button htmlType="submit" type="primary">
              前往
            </Button>
          </Space>
        </Form>
      </Typography.Paragraph>

      <Typography.Paragraph>
        <TableList
          data={teams}
          columns={[
            {
              title: "#",
              render: ({ id }) => id,
              minimize: true,
            },
            {
              title: "团队",
              render: (team) => <TeamLink team={team} />,
            },
          ]}
        />
      </Typography.Paragraph>
    </Typography>
  );
}

export { CatchBoundary } from "~/src/CatchBoundary";
export { ErrorBoundary } from "~/src/ErrorBoundary";
