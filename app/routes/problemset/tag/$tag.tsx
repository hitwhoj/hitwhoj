import { ProblemSet } from "@prisma/client";
import {
  json,
  Link,
  LoaderFunction,
  MetaFunction,
  useLoaderData,
  useParams,
} from "remix";
import { db } from "~/utils/db.server";

type LoaderData = {
  problemSets: ProblemSet[];
};

export const loader: LoaderFunction = async ({ params }) => {
  const tag = params.tag as string;

  const problemSets = await db.problemSet.findMany({
    where: {
      tags: {
        some: {
          name: tag,
        },
      },
    },
    take: 20,
  });

  if (!problemSets.length) {
    throw new Response("Problem Set Tag not found", { status: 404 });
  }

  return json({ problemSets });
};

export const meta: MetaFunction = ({ params }) => ({
  title: `Tag: ${params.tag} - HITwh OJ`,
});

export default function ProblemSetTag() {
  const { tag } = useParams();
  const { problemSets } = useLoaderData<LoaderData>();

  return (
    <>
      <h1>Tag: {tag}</h1>
      <ul>
        {problemSets.map((problemSet) => (
          <li key={problemSet.sid}>
            <Link to={`/problemset/${problemSet.sid}`}>
              <span style={{ color: "red" }}>S{problemSet.sid}</span>
              {problemSet.title}
            </Link>
          </li>
        ))}
      </ul>
    </>
  );
}
