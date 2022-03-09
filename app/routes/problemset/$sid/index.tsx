import { Problem, ProblemSet, ProblemSetTag } from "@prisma/client";
import { json, Link, LoaderFunction, MetaFunction, useLoaderData } from "remix";
import { db } from "~/utils/db.server";
import { ensureId, invariant } from "~/utils/invariant";

type LoaderData = {
  problemSet: ProblemSet & {
    tags: ProblemSetTag[];
    problems: Pick<Problem, "pid" | "title">[];
  };
};

export const loader: LoaderFunction = async ({ params }) => {
  const sid = invariant(ensureId(params.sid), "sid is required");

  const problemSet = await db.problemSet.findUnique({
    where: { sid },
    include: {
      tags: true,
      problems: {
        select: {
          pid: true,
          title: true,
        },
      },
    },
  });

  return json({
    problemSet,
  });
};

export const meta: MetaFunction = ({ data }: { data: LoaderData }) => ({
  title: `${data.problemSet.title} - HITwh OJ`,
});

export default function ProblemSetIndex() {
  const { problemSet } = useLoaderData<LoaderData>();

  return (
    <>
      <p>{problemSet.description}</p>
      <h2>标签</h2>
      {problemSet.tags.length ? (
        <ul>
          {problemSet.tags.map((tag) => (
            <li key={tag.name}>
              <Link to={`/problemset/tag/${tag.name}`}>#{tag.name}</Link>
            </li>
          ))}
        </ul>
      ) : (
        <div>没有标签捏</div>
      )}
      <h2>题目</h2>
      {problemSet.problems.length ? (
        <ol>
          {problemSet.problems.map((problem) => (
            <li key={problem.pid}>
              <Link to={`/problem/${problem.pid}`}>{problem.title}</Link>
            </li>
          ))}
        </ol>
      ) : (
        <div>没有题目捏</div>
      )}
    </>
  );
}
