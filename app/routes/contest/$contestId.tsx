import { Space, Tag, Typography } from "@arco-design/web-react";
import type { LoaderFunction, MetaFunction } from "@remix-run/node";
import { Link, Outlet, useLoaderData } from "@remix-run/react";
import { db } from "~/utils/server/db.server";
import { invariant } from "~/utils/invariant";
import { idScheme } from "~/utils/scheme";
import { Navigator } from "~/src/Navigator";
import type { ContestListData } from "~/utils/db/contest";
import { findContestPrivacy, findContestTeam } from "~/utils/db/contest";
import { ContestStateTag } from "~/src/contest/ContestStateTag";
import { ContestSystemTag } from "~/src/contest/ContestSystemTag";
import {
  IconEyeInvisible,
  IconTag,
  IconTrophy,
} from "@arco-design/web-react/icon";
import { TagSpace } from "~/src/TagSpace";
import { findRequestUser } from "~/utils/permission";
import { Permissions } from "~/utils/permission/permission";

type LoaderData = {
  contest: ContestListData;
  hasEditPerm: boolean;
};

export const loader: LoaderFunction<LoaderData> = async ({
  request,
  params,
}) => {
  const contestId = invariant(idScheme, params.contestId, { status: 404 });
  const self = await findRequestUser(request);
  const perm = self.team(await findContestTeam(contestId)).contest(contestId);
  await perm.checkPermission(
    (await findContestPrivacy(contestId))
      ? Permissions.PERM_VIEW_CONTEST
      : Permissions.PERM_VIEW_CONTEST_PUBLIC
  );
  const [hasEditPerm] = await perm.hasPermission(Permissions.PERM_EDIT_CONTEST);

  const contest = await db.contest.findUnique({
    where: { id: contestId },
    select: {
      id: true,
      title: true,
      system: true,
      beginTime: true,
      endTime: true,
      private: true,
      tags: {
        select: {
          name: true,
        },
      },
    },
  });

  if (!contest) {
    throw new Response("Contest not found", { status: 404 });
  }

  return { contest, hasEditPerm };
};

export const meta: MetaFunction<LoaderData> = ({ data }) => ({
  title: `比赛: ${data?.contest.title} - HITwh OJ`,
});

export default function ContestView() {
  const { contest, hasEditPerm } = useLoaderData<LoaderData>();

  return (
    <Typography className="contest-problem-container">
      <Typography.Title heading={3} className="contest-problem-hide">
        <Space>
          <IconTrophy />
          {contest.title}
        </Space>
      </Typography.Title>

      <Typography.Paragraph className="contest-problem-hide">
        <TagSpace>
          <ContestStateTag
            beginTime={contest.beginTime}
            endTime={contest.endTime}
          />
          <ContestSystemTag system={contest.system} />
          {contest.private && (
            <Tag icon={<IconEyeInvisible />} color="gold">
              隐藏
            </Tag>
          )}
          {contest.tags.map(({ name }) => (
            <Link to={`/contest/tag/${name}`} key={name}>
              <Tag icon={<IconTag />}>{name}</Tag>
            </Link>
          ))}
        </TagSpace>
      </Typography.Paragraph>

      <Typography.Paragraph className="contest-problem-hide">
        <Navigator
          routes={[
            { title: "详情", key: "." },
            { title: "题目", key: "problem" },
            ...(hasEditPerm ? [{ title: "编辑", key: "edit" }] : []),
          ]}
        />
      </Typography.Paragraph>
      <Outlet />
    </Typography>
  );
}

export { ErrorBoundary } from "~/src/ErrorBoundary";
export { CatchBoundary } from "~/src/CatchBoundary";
