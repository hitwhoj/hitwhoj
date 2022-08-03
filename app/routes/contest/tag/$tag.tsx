import type { LoaderFunction, MetaFunction } from "@remix-run/node";
import { useLoaderData, useParams } from "@remix-run/react";
import { invariant } from "~/utils/invariant";
import { tagScheme } from "~/utils/scheme";
import type { ContestListData } from "~/utils/db/contest";
import { selectContestListData } from "~/utils/db/contest";
import { Typography } from "@arco-design/web-react";
import { db } from "~/utils/server/db.server";
import { TableList } from "~/src/TableList";
import { ContestLink } from "~/src/contest/ContestLink";
import { ContestSystemTag } from "~/src/contest/ContestSystemTag";
import { formatDateTime } from "~/utils/tools";
import { findRequestUser } from "~/utils/permission";
import { Permissions } from "~/utils/permission/permission";

type LoaderData = {
  contests: ContestListData[];
};

export const loader: LoaderFunction<LoaderData> = async ({
  params,
  request,
}) => {
  const tag = invariant(tagScheme, params.tag, { status: 404 });
  const self = await findRequestUser(request);
  const [viewAll, viewPublic] = await self
    .team(null)
    .contest(null)
    .hasPermission(
      Permissions.PERM_VIEW_CONTEST,
      Permissions.PERM_VIEW_CONTEST_PUBLIC
    );

  const contests = await db.contest.findMany({
    where: viewAll
      ? { team: null, tags: { some: { name: tag } } }
      : viewPublic
      ? { team: null, tags: { some: { name: tag } }, private: false }
      : { id: -1 },
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
        <TableList
          data={contests}
          columns={[
            {
              title: "标题",
              render: (contest) => <ContestLink contest={contest} />,
            },
            {
              title: "赛制",
              render: ({ system }) => <ContestSystemTag system={system} />,
              align: "center",
              minimize: true,
            },
            {
              title: "开始时间",
              render: ({ beginTime }) => formatDateTime(beginTime),
              align: "center",
              minimize: true,
            },
            {
              title: "结束时间",
              render: ({ endTime }) => formatDateTime(endTime),
              align: "center",
              minimize: true,
            },
          ]}
        />
      </Typography.Paragraph>
    </Typography>
  );
}

export { ErrorBoundary } from "~/src/ErrorBoundary";
export { CatchBoundary } from "~/src/CatchBoundary";
