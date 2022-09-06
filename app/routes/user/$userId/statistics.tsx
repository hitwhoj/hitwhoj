import type { LoaderArgs } from "@remix-run/node";
import { json } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { invariant } from "~/utils/invariant";
import { idScheme } from "~/utils/scheme";
import { db } from "~/utils/server/db.server";
import { findRequestUser } from "~/utils/permission";
import { Permissions } from "~/utils/permission/permission";
import { ContestLink } from "~/src/contest/ContestLink";
import { selectContestListData } from "~/utils/db/contest";
import { formatNumber } from "~/utils/tools";

export async function loader({ request, params }: LoaderArgs) {
  const userId = invariant(idScheme, params.userId, { status: 404 });
  const self = await findRequestUser(request);
  await self.checkPermission(
    self.userId === userId
      ? Permissions.PERM_VIEW_USER_PROFILE_SELF
      : Permissions.PERM_VIEW_USER_PROFILE
  );

  const user = await db.user.findUnique({
    where: { id: userId },
    select: {
      participatedContests: {
        select: {
          contest: {
            select: {
              ...selectContestListData,
            },
          },
        },
      },
      _count: {
        select: {
          createdRecords: true,
          createdComments: true,
          createdReplies: true,
        },
      },
    },
  });

  if (!user) {
    throw new Response("User not found", { status: 404 });
  }

  return json({ user });
}

export default function UserStatistics() {
  const { user } = useLoaderData<typeof loader>();

  // FIXME 摆烂了，这个页面就跟 profile 页面合并了吧
  // 丢给 @lingyunchi 处理吧

  return (
    <>
      <div className="stats w-full">
        <div className="stat place-items-center">
          <div className="stat-value">
            {formatNumber(user._count.createdRecords)}
          </div>
          <div className="stat-desc">提交</div>
        </div>

        <div className="stat place-items-center">
          <div className="stat-value">
            {formatNumber(user._count.createdComments)}
          </div>
          <div className="stat-desc">评论</div>
        </div>

        <div className="stat place-items-center">
          <div className="stat-value">
            {formatNumber(user._count.createdReplies)}
          </div>
          <div className="stat-desc">回复</div>
        </div>
      </div>

      <h2>参与的比赛</h2>
      <ul>
        {user.participatedContests.map(({ contest }) => (
          <li key={contest.id}>
            <ContestLink contest={contest} />
          </li>
        ))}
      </ul>
    </>
  );
}

export { CatchBoundary } from "~/src/CatchBoundary";
export { ErrorBoundary } from "~/src/ErrorBoundary";
