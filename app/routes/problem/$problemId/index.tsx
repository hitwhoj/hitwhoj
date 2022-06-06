import type { Problem, ProblemSet, File as ProblemFile } from "@prisma/client";
import type { LoaderFunction, MetaFunction } from "@remix-run/node";
import { Link, useLoaderData } from "@remix-run/react";
import { Markdown } from "~/src/Markdown";
import { Link as ArcoLink } from "@arco-design/web-react";
import { db } from "~/utils/server/db.server";
import { invariant } from "~/utils/invariant";
import { idScheme } from "~/utils/scheme";
import { checkProblemReadPermission } from "~/utils/permission/problem";

type LoaderData = {
  problem: Pick<Problem, "id" | "title" | "description"> & {
    includedProblemSets: Pick<ProblemSet, "id" | "title">[];
    files: ProblemFile[];
  };
};

export const loader: LoaderFunction<LoaderData> = async ({
  params,
  request,
}) => {
  const problemId = invariant(idScheme, params.problemId, {
    status: 404,
  });

  await checkProblemReadPermission(request, problemId);

  const problem = await db.problem.findUnique({
    where: { id: problemId },
    select: {
      id: true,
      title: true,
      description: true,
      private: true,
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

  return { problem };
};

export const meta: MetaFunction<LoaderData> = ({ data }) => ({
  title: `题目: ${data?.problem.title} - HITwh OJ`,
  description: data?.problem.description,
});

export default function ProblemIndex() {
  const { problem } = useLoaderData<LoaderData>();

  return (
    <>
      <article>
        <Markdown>{problem.description}</Markdown>
      </article>
      {problem.files.length > 0 && (
        <>
          <h2>相关文件</h2>
          {problem.files.map((file) => (
            <div key={file.id}>
              <ArcoLink>
                <Link to={`/file/${file.id}`}>{file.filename}</Link>
              </ArcoLink>
            </div>
          ))}
        </>
      )}
      {problem.includedProblemSets.length > 0 && (
        <>
          <h2>相关题单捏</h2>
          {problem.includedProblemSets.map(({ id, title }) => (
            <div key={id}>
              <ArcoLink>
                <Link to={`/problemset/${id}`}>{title}</Link>
              </ArcoLink>
            </div>
          ))}
        </>
      )}
    </>
  );
}

export { ErrorBoundary } from "~/src/ErrorBoundary";
export { CatchBoundary } from "~/src/CatchBoundary";
