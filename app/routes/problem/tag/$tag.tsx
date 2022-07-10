import type { LoaderFunction, MetaFunction } from "@remix-run/node";
import { useLoaderData, useParams } from "@remix-run/react";
import { Grid, Typography } from "@arco-design/web-react";
import { db } from "~/utils/server/db.server";
import { findSessionUserOptional } from "~/utils/sessions";
import { isAdmin } from "~/utils/permission";
import { invariant } from "~/utils/invariant";
import { tagScheme } from "~/utils/scheme";
import type { ProblemListData } from "~/utils/db/problem";
import { selectProblemListData } from "~/utils/db/problem";
import { TableList } from "~/src/TableList";
import { ProblemLink } from "~/src/problem/ProblemLink";

type LoaderData = {
  problems: (ProblemListData & {
    _count: {
      relatedRecords: number;
    };
  })[];
};

export const loader: LoaderFunction<LoaderData> = async ({
  request,
  params,
}) => {
  const tag = invariant(tagScheme, params.tag, { status: 404 });
  const self = await findSessionUserOptional(request);

  const problems = await db.problem.findMany({
    // 只有系统管理员可以看到私有题目
    where:
      self && isAdmin(self.role)
        ? { team: null, tags: { some: { name: tag } } }
        : { team: null, tags: { some: { name: tag } }, private: false },
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

export const meta: MetaFunction<LoaderData> = ({ params }) => ({
  title: `题目标签: ${params.tag} - HITwh OJ`,
});

export default function ProblemIndex() {
  const { problems } = useLoaderData<LoaderData>();
  const params = useParams();

  return (
    <Typography>
      <Typography.Title heading={3}>
        <Grid.Row justify="space-between" align="center">
          题目标签：{params.tag}
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
