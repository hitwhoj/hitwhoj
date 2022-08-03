import type { Problem, File as ProblemFile } from "@prisma/client";
import type { LoaderFunction, MetaFunction } from "@remix-run/node";
import { Link, useLoaderData } from "@remix-run/react";
import { Markdown } from "~/src/Markdown";
import { Link as ArcoLink, Typography } from "@arco-design/web-react";
import { db } from "~/utils/server/db.server";
import { invariant } from "~/utils/invariant";
import { idScheme } from "~/utils/scheme";
import { findRequestUser } from "~/utils/permission";
import { Permissions } from "~/utils/permission/permission";
import { findProblemPrivacy, findProblemTeam } from "~/utils/db/problem";

type LoaderData = {
  problem: Pick<Problem, "id" | "title" | "description"> & {
    files: ProblemFile[];
  };
};

export const loader: LoaderFunction<LoaderData> = async ({
  request,
  params,
}) => {
  const problemId = invariant(idScheme, params.problemId, { status: 404 });
  const self = await findRequestUser(request);
  await self
    .team(await findProblemTeam(problemId))
    .checkPermission(
      (await findProblemPrivacy(problemId))
        ? Permissions.PERM_VIEW_PROBLEM
        : Permissions.PERM_VIEW_PROBLEM_PUBLIC
    );

  const problem = await db.problem.findUnique({
    where: { id: problemId },
    select: {
      id: true,
      title: true,
      description: true,
      private: true,
      files: { orderBy: { filename: "asc" } },
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
      <Markdown>{problem.description}</Markdown>

      {problem.files.length > 0 && (
        <>
          <Typography.Title heading={4}>相关文件</Typography.Title>

          <ul>
            {problem.files.map((file) => (
              <li key={file.id}>
                <ArcoLink>
                  <Link to={`/file/${file.id}`}>{file.filename}</Link>
                </ArcoLink>
              </li>
            ))}
          </ul>
        </>
      )}
    </>
  );
}

export { ErrorBoundary } from "~/src/ErrorBoundary";
export { CatchBoundary } from "~/src/CatchBoundary";
