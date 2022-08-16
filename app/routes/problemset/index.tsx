import type { ProblemSet } from "@prisma/client";
import type { LoaderFunction, MetaFunction } from "@remix-run/node";
import { Link, useLoaderData } from "@remix-run/react";
import { db } from "~/utils/server/db.server";
import { Grid, Button, Typography } from "@arco-design/web-react";
import { IconPlus } from "@arco-design/web-react/icon";
import { ProblemSetLink } from "~/src/problemset/ProblemSetLink";
import { useContext } from "react";
import { UserInfoContext } from "~/utils/context/user";
import { isAdmin } from "~/utils/permission";
import { TableList } from "~/src/TableList";
import { findSessionUserOptional } from "~/utils/sessions";

type LoaderData = {
  problemSets: (Pick<ProblemSet, "id" | "title" | "private"> & {
    _count: {
      problems: number;
    };
  })[];
};

export const loader: LoaderFunction<LoaderData> = async ({ request }) => {
  const self = await findSessionUserOptional(request);

  const problemSets = await db.problemSet.findMany({
    where:
      self && isAdmin(self.role)
        ? { team: null }
        : { team: null, private: false },
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
  const user = useContext(UserInfoContext);

  return (
    <Typography>
      <Typography.Title heading={3}>
        <Grid.Row justify="space-between" align="center">
          <span>题单列表</span>

          {user && isAdmin(user.role) && (
            <Link to="new">
              <Button type="primary" icon={<IconPlus />}>
                创建题单
              </Button>
            </Link>
          )}
        </Grid.Row>
      </Typography.Title>

      <Typography.Paragraph>
        <TableList
          data={problemSets}
          columns={[
            {
              title: "#",
              render: ({ id }) => id,
              minimize: true,
            },
            {
              title: "题单",
              render: (problemset) => (
                <ProblemSetLink problemset={problemset} />
              ),
            },
            {
              title: "题目数",
              render: ({ _count: { problems } }) => problems,
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
