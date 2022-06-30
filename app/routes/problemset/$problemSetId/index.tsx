import type { Problem, ProblemSet, ProblemSetTag } from "@prisma/client";
import type { LoaderFunction } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { db } from "~/utils/server/db.server";
import { invariant } from "~/utils/invariant";
import { idScheme } from "~/utils/scheme";
import { Table, Typography, Empty } from "@arco-design/web-react";
import { Markdown } from "~/src/Markdown";
import { ProblemLink } from "~/src/problem/ProblemLink";
import { checkProblemSetReadPermission } from "~/utils/permission/problemset";

type LoaderData = {
  problemSet: ProblemSet & {
    tags: ProblemSetTag[];
    problems: Pick<Problem, "id" | "title" | "private">[];
  };
};

export const loader: LoaderFunction<LoaderData> = async ({
  request,
  params,
}) => {
  const problemSetId = invariant(idScheme, params.problemSetId, {
    status: 404,
  });
  await checkProblemSetReadPermission(request, problemSetId);

  const problemSet = await db.problemSet.findUnique({
    where: { id: problemSetId },
    include: {
      tags: true,
      problems: {
        select: {
          id: true,
          title: true,
          private: true,
        },
      },
    },
  });

  if (!problemSet) {
    throw new Response("Problem Set not found", { status: 404 });
  }

  return {
    problemSet,
  };
};

export default function ProblemSetIndex() {
  const { problemSet } = useLoaderData<LoaderData>();

  return (
    <Typography>
      <Markdown>{problemSet.description}</Markdown>

      <Typography.Title heading={4}>题目</Typography.Title>
      <Table
        columns={[
          {
            title: "#",
            dataIndex: "id",
            cellStyle: { width: "5%", whiteSpace: "nowrap" },
          },
          {
            title: "题目",
            render: (_, problem) => <ProblemLink problem={problem} />,
          },
        ]}
        data={problemSet.problems}
        rowKey="id"
        hover={false}
        border={false}
        pagination={false}
        noDataElement={<Empty description="没有题目" />}
      />
    </Typography>
  );
}

export { ErrorBoundary } from "~/src/ErrorBoundary";
export { CatchBoundary } from "~/src/CatchBoundary";
