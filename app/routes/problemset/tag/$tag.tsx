import type { ProblemSet } from "@prisma/client";
import type { LoaderFunction, MetaFunction } from "@remix-run/node";
import { Link, useLoaderData, useParams } from "@remix-run/react";
import { db } from "~/utils/server/db.server";
import { invariant } from "~/utils/invariant";
import { tagScheme } from "~/utils/scheme";

type LoaderData = {
  problemSets: ProblemSet[];
};

export const loader: LoaderFunction<LoaderData> = async ({ params }) => {
  const tag = invariant(tagScheme, params.tag, {
    status: 404,
  });

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

  return { problemSets };
};

export const meta: MetaFunction = ({ params }) => ({
  title: `题单标签: ${params.tag} - HITwh OJ`,
});

export default function ProblemSetTag() {
  const { tag } = useParams();
  const { problemSets } = useLoaderData<LoaderData>();

  return (
    <>
      <h1>Tag: {tag}</h1>
      <ul>
        {problemSets.map((problemSet) => (
          <li key={problemSet.id}>
            <Link to={`/problemset/${problemSet.id}`}>
              <span style={{ color: "red" }}>S{problemSet.id}</span>
              {problemSet.title}
            </Link>
          </li>
        ))}
      </ul>
    </>
  );
}

export { ErrorBoundary } from "~/src/ErrorBoundary";
export { CatchBoundary } from "~/src/CatchBoundary";
