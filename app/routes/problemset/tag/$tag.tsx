import type { ProblemSet } from "@prisma/client";
import type { LoaderFunction, MetaFunction } from "@remix-run/node";
import { useLoaderData, useParams } from "@remix-run/react";
import { db } from "~/utils/server/db.server";
import { invariant } from "~/utils/invariant";
import { tagScheme } from "~/utils/scheme";
import { Empty, Table, Typography } from "@arco-design/web-react";
import { ProblemSetLink } from "~/src/problemset/ProblemSetLink";
import { findSessionUserOptional } from "~/utils/sessions";
import { isAdmin } from "~/utils/permission";

type LoaderData = {
  problemSets: (Pick<ProblemSet, "id" | "title" | "private"> & {
    _count: {
      problems: number;
    };
  })[];
};

export const loader: LoaderFunction<LoaderData> = async ({
  request,
  params,
}) => {
  const tag = invariant(tagScheme, params.tag, { status: 404 });
  const self = await findSessionUserOptional(request);

  const problemSets = await db.problemSet.findMany({
    where:
      self && isAdmin(self.role)
        ? { team: null, tags: { some: { name: tag } } }
        : { team: null, tags: { some: { name: tag } }, private: false },
    orderBy: { id: "asc" },
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

  if (!problemSets.length) {
    throw new Response("Problem Set Tag not found", { status: 404 });
  }

  return { problemSets };
};

export const meta: MetaFunction = ({ params }) => ({
  title: `题单标签: ${params.tag} - HITwh OJ`,
});

export default function ProblemSetTag() {
  const { tag } = useParams();
  const { problemSets } = useLoaderData<LoaderData>();

  return (
    <Typography>
      <Typography.Title heading={3}>题单标签：{tag}</Typography.Title>

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
