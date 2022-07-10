import type {
  ProblemSet,
  ProblemSetProblem,
  ProblemSetTag,
} from "@prisma/client";
import type { LoaderFunction, MetaFunction } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { db } from "~/utils/server/db.server";
import { invariant } from "~/utils/invariant";
import { idScheme } from "~/utils/scheme";
import { Typography } from "@arco-design/web-react";
import { Markdown } from "~/src/Markdown";
import { checkProblemSetReadPermission } from "~/utils/permission/problemset";
import type { ProblemListData } from "~/utils/db/problem";
import { selectProblemListData } from "~/utils/db/problem";
import { TableList } from "~/src/TableList";
import { ProblemLink } from "~/src/problem/ProblemLink";

type LoaderData = {
  problemSet: Pick<ProblemSet, "id" | "title" | "description"> & {
    tags: ProblemSetTag[];
    problems: (Pick<ProblemSetProblem, "rank"> & {
      problem: ProblemListData;
    })[];
  };
};

export const meta: MetaFunction<LoaderData> = ({ data }) => ({
  title: `题单: ${data?.problemSet.title} - HITwh OJ`,
  description: data?.problemSet.description,
});

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
    select: {
      id: true,
      title: true,
      description: true,
      tags: true,
      problems: {
        orderBy: { rank: "asc" },
        select: {
          rank: true,
          problem: {
            select: {
              ...selectProblemListData,
            },
          },
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

      <Typography.Paragraph>
        <TableList
          data={problemSet.problems.map(({ problem }) => problem)}
          columns={[
            {
              title: "#",
              render: (_, index) => index + 1,
              align: "center",
              minimize: true,
            },
            {
              title: "题目",
              render: (problem) => <ProblemLink problem={problem} />,
            },
          ]}
        />
      </Typography.Paragraph>
    </Typography>
  );
}

export { ErrorBoundary } from "~/src/ErrorBoundary";
export { CatchBoundary } from "~/src/CatchBoundary";
