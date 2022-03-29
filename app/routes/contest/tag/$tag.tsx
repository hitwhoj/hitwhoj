import { Contest } from "@prisma/client";
import {
  json,
  LoaderFunction,
  MetaFunction,
  useLoaderData,
  useParams,
} from "remix";
import { db } from "~/utils/db.server";
import { invariant } from "~/utils/invariant";
import { tagScheme } from "~/utils/scheme";
import { ContestList } from "~/routes/contest";

type LoaderData = {
  contests: Pick<Contest, "cid" | "title" | "beginTime" | "endTime">[];
};

export const loader: LoaderFunction = async ({ params }) => {
  const tag = invariant(tagScheme.safeParse(params.tag), {
    status: 404,
  });

  const contests = await db.contest.findMany({
    orderBy: [{ cid: "asc" }],
    take: 20,
    select: {
      cid: true,
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

  return json({ contests });
};

export const meta: MetaFunction = ({ params }) => ({
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
