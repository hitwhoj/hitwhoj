import {
  Problem,
  ProblemSet,
  ProblemTag,
  File as ProblemFile,
} from "@prisma/client";
import { json, Link, LoaderFunction, useLoaderData } from "remix";
import { db } from "~/utils/db.server";
import { invariant } from "~/utils/invariant";
import { idScheme } from "~/utils/scheme";

type LoaderData = {
  problem: Pick<Problem, "pid" | "title" | "description"> & {
    tags: Pick<ProblemTag, "name">[];
    includedProblemSets: Pick<ProblemSet, "sid" | "title">[];
    files: ProblemFile[];
  };
};

export const loader: LoaderFunction = async ({ params }) => {
  const pid = invariant(idScheme.safeParse(params.pid), { status: 404 });

  const problem = await db.problem.findUnique({
    where: { pid },
    select: {
      pid: true,
      title: true,
      description: true,
      tags: {
        select: {
          name: true,
        },
      },
      includedProblemSets: {
        select: {
          sid: true,
          title: true,
        },
      },
      files: {
        where: {
          private: false,
        },
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
      <h2>描述捏</h2>
      <div>{problem.description}</div>
      <h2>相关文件</h2>
      <ul>
        {problem.files.map((file) => (
          <li key={file.fid}>
            <Link to={`/file/${file.fid}`}>{file.filename}</Link>
          </li>
        ))}
      </ul>
      <h2>相关题单捏</h2>
      <ul>
        {problem.includedProblemSets.map(({ sid, title }) => (
          <li key={sid}>
            <Link to={`/problemset/${sid}`}>{title}</Link>
          </li>
        ))}
      </ul>
    </>
  );
}
