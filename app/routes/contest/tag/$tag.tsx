import type { LoaderFunction, MetaFunction } from "@remix-run/node";
import { useLoaderData, useParams } from "@remix-run/react";
import { invariant } from "~/utils/invariant";
import { tagScheme } from "~/utils/scheme";
import { ContestList } from "~/src/contest/ContestList";
import type { ContestListData } from "~/utils/db/contest";
import { selectContestListData } from "~/utils/db/contest";
import { Typography } from "@arco-design/web-react";
import { db } from "~/utils/server/db.server";
import { findSessionUserOptional } from "~/utils/sessions";
import { isAdmin } from "~/utils/permission";

type LoaderData = {
  contests: ContestListData[];
};

export const loader: LoaderFunction<LoaderData> = async ({
  params,
  request,
}) => {
  const tag = invariant(tagScheme, params.tag, { status: 404 });
  const self = await findSessionUserOptional(request);

  const contests = await db.contest.findMany({
    where:
      self && isAdmin(self.role)
        ? { team: null, tags: { some: { name: tag } } }
        : { team: null, tags: { some: { name: tag } }, private: false },
    orderBy: [{ id: "asc" }],
    select: {
      ...selectContestListData,
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
    <Typography>
      <Typography.Title heading={3}>比赛标签：{tag}</Typography.Title>
      <Typography.Paragraph>
        <ContestList contests={contests} />
      </Typography.Paragraph>
    </Typography>
  );
}

export { ErrorBoundary } from "~/src/ErrorBoundary";
export { CatchBoundary } from "~/src/CatchBoundary";
