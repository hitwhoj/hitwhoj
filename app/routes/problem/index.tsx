import type { LoaderFunction, MetaFunction } from "@remix-run/node";
import { Link, useLoaderData } from "@remix-run/react";
import { Button, Grid, Typography } from "@arco-design/web-react";
import type { ProblemListData } from "~/utils/db/problem";
import { db } from "~/utils/server/db.server";
import { findSessionUserOptional } from "~/utils/sessions";
import { isAdmin } from "~/utils/permission";
import { useContext } from "react";
import { UserInfoContext } from "~/utils/context/user";
import { IconPlus } from "@arco-design/web-react/icon";
import { TableList } from "~/src/TableList";
import { ProblemLink } from "~/src/problem/ProblemLink";

// TODO: 分页
type LoaderData = {
  problems: (Pick<ProblemListData, "id" | "title" | "private"> & {
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
      id: true,
      title: true,
      private: true,
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
  const user = useContext(UserInfoContext);

  return (
    <Typography>
      <Typography.Title heading={3}>
        <Grid.Row justify="space-between" align="center">
          题目列表
          {user && isAdmin(user.role) && (
            <Link to="/problem/new">
              <Button type="primary" icon={<IconPlus />}>
                新建题目
              </Button>
            </Link>
          )}
        </Grid.Row>
      </Typography.Title>

      <Typography.Paragraph>
        <TableList
          data={problems}
          columns={[
            {
              title: "#",
              render: ({ id }) => id,
              align: "center",
              minimize: true,
            },
            {
              title: "题目",
              render: (problem) => <ProblemLink problem={problem} />,
            },
            {
              title: "提交",
              render: ({ _count: { relatedRecords } }) => relatedRecords,
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
