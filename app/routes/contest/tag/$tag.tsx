import type { LoaderFunction, MetaFunction } from "@remix-run/node";
import { useLoaderData, useParams } from "@remix-run/react";
import { invariant } from "~/utils/invariant";
import { tagScheme } from "~/utils/scheme";
import { ContestList } from "~/src/contest/ContestList";
import type { ContestListData } from "~/utils/db/contest";
import { findContestList } from "~/utils/db/contest";
import { Typography } from "@arco-design/web-react";
import { isAdmin } from "~/utils/permission";
import { findSessionUserOptional } from "~/utils/sessions";

type LoaderData = {
  contests: ContestListData[];
};

export const loader: LoaderFunction<LoaderData> = async ({
  request,
  params,
}) => {
  const tag = invariant(tagScheme, params.tag, {
    status: 404,
  });
  const self = await findSessionUserOptional(request);

  let contests: ContestListData[] = [];

  // 访客只能看到公开的比赛
  if (!self) {
    contests = await findContestList({
      tags: { some: { name: tag } },
      private: false,
    });
  }
  // 管理员可以看到所有比赛
  else if (isAdmin(self.role)) {
    contests = await findContestList({
      tags: { some: { name: tag } },
    });
  }
  // 普通用户只能看到公开比赛以及自己创建、管理、裁判、参加的比赛
  else {
    contests = await findContestList({
      tags: { some: { name: tag } },
      OR: [
        { private: false },
        { mods: { some: { id: self.id } } },
        { juries: { some: { id: self.id } } },
        { attendees: { some: { id: self.id } } },
      ],
    });
  }

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
