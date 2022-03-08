import { ProblemSet } from "@prisma/client";
import { json, Link, LoaderFunction, MetaFunction, useLoaderData } from "remix";
import { db } from "~/utils/db.server";

type LoaderData = {
  problemSets: ProblemSet[];
};

export const loader: LoaderFunction = async () => {
  const problemSets = await db.problemSet.findMany({
    orderBy: {
      sid: "asc",
    },
    take: 20,
  });

  return json({ problemSets });
};

export const meta: MetaFunction = () => ({
  title: "Problem Set - HITwh OJ",
});

export default function ProblemsetList() {
  const { problemSets } = useLoaderData<LoaderData>();

  return (
    <>
      <h1>题单列表</h1>
      <Link to="new">
        <button>创建题单</button>
      </Link>
      {problemSets.length ? (
        <ul>
          {problemSets.map((problemSet) => (
            <li key={problemSet.sid}>
              <Link to={`${problemSet.sid}`}>
                <span style={{ color: "red" }}>S{problemSet.sid}</span>
                {problemSet.title}
              </Link>
            </li>
          ))}
        </ul>
      ) : (
        <div>什么都没有捏</div>
      )}
    </>
  );
}
