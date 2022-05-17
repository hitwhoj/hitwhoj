import type { Contest } from "@prisma/client";
import type { LoaderFunction, MetaFunction } from "@remix-run/node";
import { useLoaderData, useParams } from "@remix-run/react";
import { db } from "~/utils/server/db.server";
import { invariant } from "~/utils/invariant";
import { tagScheme } from "~/utils/scheme";
import { ContestList } from "~/routes/contest";

type LoaderData = {
  contests: Pick<Contest, "id" | "title" | "beginTime" | "endTime">[];
};

export const loader: LoaderFunction<LoaderData> = async ({ params }) => {
  const tag = invariant(tagScheme.safeParse(params.tag), {
    status: 404,
  });

  const contests = await db.contest.findMany({
    orderBy: [{ id: "asc" }],
    take: 20,
    select: {
      id: true,
      title: true,
      beginTime: true,
      endTime: true,
    },
    where: {
      tags: {
        some: {
          name: tag,
        },
      },
    },
  });

  return { contests };
};

export const meta: MetaFunction<LoaderData> = ({ params }) => ({
  title: `比赛标签: ${params.tag} - HITwh OJ`,
});

export default function ContestTag() {
  const { tag } = useParams();
  const { contests } = useLoaderData<LoaderData>();

  return (
    <>
      <h1>Tag: {tag}</h1>
      <ContestList contests={contests} />
    </>
  );
}

export { ErrorBoundary } from "~/src/ErrorBoundary";
export { CatchBoundary } from "~/src/CatchBoundary";
