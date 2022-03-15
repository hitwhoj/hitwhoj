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
import { contestList } from "~/routes/contest";

type LoaderData = {
  contests: Contest[];
};

export const loader: LoaderFunction = async ({ params }) => {
  const tag = invariant(tagScheme.safeParse(params.tag), {
    status: 404,
  });

  const contests = await db.contest.findMany({
    where: {
      tags: {
        some: {
          name: tag,
        },
      },
    },
    take: 20,
  });

  if (!contests.length) {
    throw new Response("Contest Tag not found", { status: 404 });
  }

  return json({ contests: contests });
};

export const meta: MetaFunction = ({ params }) => ({
  title: `Contest Tag: ${params.tag} - HITwh OJ`,
});

export default function ContestTag() {
  const { tag } = useParams();
  const { contests } = useLoaderData<LoaderData>();

  return (
    <>
      <h1>Tag: {tag}</h1>
      {contestList(contests)}
    </>
  );
}
