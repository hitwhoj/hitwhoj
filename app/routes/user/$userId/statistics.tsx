import type { LoaderArgs } from "@remix-run/node";
import { json } from "@remix-run/node";
import { Link, useLoaderData } from "@remix-run/react";
import { invariant } from "~/utils/invariant";
import { idScheme } from "~/utils/scheme";
import { db } from "~/utils/server/db.server";
import {
  Typography,
  Link as ArcoLink,
  Statistic,
  Space,
} from "@arco-design/web-react";
import { findRequestUser } from "~/utils/permission";
import { Permissions } from "~/utils/permission/permission";

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
              id: true,
              title: true,
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

  return (
    <Typography>
      <Typography.Paragraph>
        <Space size="large">
          <Statistic title="提交" value={user._count.createdRecords} />
          <Statistic title="评论" value={user._count.createdComments} />
          <Statistic title="回复" value={user._count.createdReplies} />
        </Space>
      </Typography.Paragraph>

      <Typography.Title heading={4}>参与的比赛</Typography.Title>
      <Typography.Paragraph>
        {user.participatedContests.length ? (
          <ul>
            {user.participatedContests.map(({ contest }) => (
              <li key={contest.id}>
                <ArcoLink>
                  <Link to={`/contest/${contest.id}`}>{contest.title}</Link>
                </ArcoLink>
              </li>
            ))}
          </ul>
        ) : (
          <div>没有喵</div>
        )}
      </Typography.Paragraph>
    </Typography>
  );
}

export { CatchBoundary } from "~/src/CatchBoundary";
export { ErrorBoundary } from "~/src/ErrorBoundary";
