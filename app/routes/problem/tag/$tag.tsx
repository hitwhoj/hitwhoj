import type { LoaderFunction, MetaFunction } from "@remix-run/node";
import { useLoaderData, useParams } from "@remix-run/react";
import { Grid, Typography } from "@arco-design/web-react";
import { ProblemList } from "~/src/problem/ProblemList";
import { db } from "~/utils/server/db.server";
import { findSessionUserOptional } from "~/utils/sessions";
import { isAdmin } from "~/utils/permission";
import { invariant } from "~/utils/invariant";
import { tagScheme } from "~/utils/scheme";
import type { Problem } from "@prisma/client";

type LoaderData = {
  problems: (Pick<Problem, "id" | "title" | "private"> & {
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
        <ProblemList
          problems={problems}
          columnsBefore={[
            {
              title: "#",
              dataIndex: "id",
              align: "center",
              cellStyle: { width: "5%", whiteSpace: "nowrap" },
            },
          ]}
          columns={[
            {
              title: "提交",
              dataIndex: "_count.relatedRecords",
              align: "center",
              cellStyle: { width: "5%", whiteSpace: "nowrap" },
            },
          ]}
        />
      </Typography.Paragraph>
    </Typography>
  );
}

export { ErrorBoundary } from "~/src/ErrorBoundary";
export { CatchBoundary } from "~/src/CatchBoundary";
