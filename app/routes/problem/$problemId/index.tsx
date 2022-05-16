import type {
  Problem,
  ProblemSet,
  ProblemTag,
  File as ProblemFile,
} from "@prisma/client";
import type { LoaderFunction, MetaFunction } from "@remix-run/node";
import { json } from "@remix-run/node";
import { Link, useLoaderData } from "@remix-run/react";
import { Markdown } from "~/src/Markdown";
import { db } from "~/utils/db.server";
import { invariant } from "~/utils/invariant";
import { idScheme } from "~/utils/scheme";

type LoaderData = {
  problem: Pick<Problem, "id" | "title" | "description"> & {
    tags: Pick<ProblemTag, "name">[];
    includedProblemSets: Pick<ProblemSet, "id" | "title">[];
    files: ProblemFile[];
  };
};

export const loader: LoaderFunction = async ({ request, params }) => {
  const problemId = invariant(idScheme.safeParse(params.problemId), {
    status: 404,
  });

  const problem = await db.problem.findUnique({
    where: { id: problemId },
    select: {
      id: true,
      title: true,
      description: true,
      private: true,
      tags: {
        select: {
          name: true,
        },
      },
      includedProblemSets: {
        select: {
          id: true,
          title: true,
        },
      },
      files: {
        orderBy: {
          filename: "asc",
        },
      },
    },
  });

  if (!problem) {
    throw new Response("Problem not found", { status: 404 });
  }

  return json({ problem });
};

export const meta: MetaFunction = ({ data }: { data?: LoaderData }) => ({
  title: `题目: ${data?.problem.title} - HITwh OJ`,
  description: data?.problem.description,
});

export default function ProblemIndex() {
  const { problem } = useLoaderData<LoaderData>();

  return (
    <>
      <h2>标签捏</h2>
      <ul>
        {problem.tags.map((tag) => (
          <li key={tag.name}>#{tag.name}</li>
        ))}
      </ul>
      <article>
        <Markdown>{problem.description}</Markdown>
      </article>
      <h2>相关文件</h2>
      <ul>
        {problem.files.map((file) => (
          <li key={file.id}>
            <Link to={`/file/${file.id}`}>{file.filename}</Link>
          </li>
        ))}
      </ul>
      <h2>相关题单捏</h2>
      <ul>
        {problem.includedProblemSets.map(({ id, title }) => (
          <li key={id}>
            <Link to={`/problemset/${id}`}>{title}</Link>
          </li>
        ))}
      </ul>
    </>
  );
}

export { ErrorBoundary } from "~/src/ErrorBoundary";
export { CatchBoundary } from "~/src/CatchBoundary";
