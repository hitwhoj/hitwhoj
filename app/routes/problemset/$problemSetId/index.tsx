import type { Problem, ProblemSet, ProblemSetTag } from "@prisma/client";
import type { LoaderFunction } from "@remix-run/node";
import { Link, useLoaderData } from "@remix-run/react";
import { db } from "~/utils/server/db.server";
import { invariant } from "~/utils/invariant";
import { idScheme } from "~/utils/scheme";
import { Space, Tag, Table } from "@arco-design/web-react";

type LoaderData = {
  problemSet: ProblemSet & {
    tags: ProblemSetTag[];
    problems: Pick<Problem, "id" | "title">[];
  };
};

export const loader: LoaderFunction<LoaderData> = async ({ params }) => {
  const problemSetId = invariant(idScheme.safeParse(params.problemSetId), {
    status: 404,
  });

  const problemSet = await db.problemSet.findUnique({
    where: { id: problemSetId },
    include: {
      tags: true,
      problems: {
        select: {
          id: true,
          title: true,
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
  const tableColumns = [
    {
      title: "#",
      dataIndex: "id",
      render: (col: string) => <Link to={`/problem/${col}`}>{col}</Link>,
    },
    {
      title: "Title",
      dataIndex: "title",
      render: (col: string, problem: Pick<Problem, "id" | "title">) => (
        <Link to={`/problem/${problem.id}`}>{col}</Link>
      ),
    },
  ];

  return (
    <>
      <p>{problemSet.description}</p>
      <h2>标签</h2>
      {problemSet.tags.length ? (
        <Space size="medium">
          {problemSet.tags.map((tag) => (
            <Link to={`/problemset/tag/${tag.name}`} key={tag.name}>
              <Tag>#{tag.name}</Tag>
            </Link>
          ))}
        </Space>
      ) : (
        <div>没有标签捏</div>
      )}
      <h2>题目</h2>
      {problemSet.problems.length ? (
        <Table
          columns={tableColumns}
          data={problemSet.problems}
          hover={false}
          // TODO: 毕竟这是个假的分页qwq
          pagination={{
            total: problemSet.problems.length,
            defaultPageSize: 20,
            showTotal: (total: number) =>
              `Total ${Math.ceil(total / 20)} pages`,
            showJumper: true,
          }}
        />
      ) : (
        <div>没有题目捏</div>
      )}
    </>
  );
}

export { ErrorBoundary } from "~/src/ErrorBoundary";
export { CatchBoundary } from "~/src/CatchBoundary";
