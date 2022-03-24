import { Problem } from "@prisma/client";
import { LoaderFunction, json, useLoaderData, MetaFunction, Link } from "remix";
import { db } from "~/utils/db.server";

type LoaderData = {
  problems: Pick<Problem, "pid" | "title" | "private">[];
};

export const loader: LoaderFunction = async () => {
  // TODO: 按照用户是否有题目的访问权限来筛选题目

  const problems = await db.problem.findMany({
    orderBy: [{ pid: "asc" }],
    take: 20,
    select: {
      pid: true,
      title: true,
      private: true,
    },
  });

  return json({ problems });
};

export const meta: MetaFunction = () => ({
  title: "Problem List",
});

export default function ProblemList() {
  const { problems } = useLoaderData<LoaderData>();

  return (
    <>
      <h1>Problem List</h1>
      <ul>
        {problems.map((problem) => (
          <li key={problem.pid}>
            <span
              style={{
                color: "grey",
                marginRight: "10px",
              }}
            >
              P{problem.pid}
            </span>
            <Link to={`/problem/${problem.pid}`}>{problem.title}</Link>
            {problem.private && (
              <span
                style={{
                  color: "white",
                  backgroundColor: "red",
                  borderRadius: "10px",
                  margin: "0 10px",
                  padding: "0 10px",
                }}
              >
                Private
              </span>
            )}
          </li>
        ))}
      </ul>
    </>
  );
}
