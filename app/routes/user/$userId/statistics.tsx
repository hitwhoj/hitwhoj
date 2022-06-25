import type { Contest } from "@prisma/client";
import type { LoaderFunction } from "@remix-run/node";
import { Link, useLoaderData } from "@remix-run/react";
import { invariant } from "~/utils/invariant";
import { idScheme } from "~/utils/scheme";
import { db } from "~/utils/server/db.server";
import { checkUserReadPermission } from "~/utils/permission/user";
import { Typography } from "@arco-design/web-react";

type LoaderData = {
  attendedContests: Pick<Contest, "id" | "title">[];
};

export const loader: LoaderFunction<LoaderData> = async ({
  request,
  params,
}) => {
  const userId = invariant(idScheme, params.userId, { status: 404 });
  await checkUserReadPermission(request, userId);

  const user = await db.user.findUnique({
    where: { id: userId },
    select: {
      attendedContests: {
        select: {
          id: true,
          title: true,
        },
      },
    },
  });

  if (!user) {
    throw new Response("User not found", { status: 404 });
  }

  return user;
};

export default function UserStatistics() {
  const { attendedContests } = useLoaderData<LoaderData>();

  return (
    <Typography>
      <Typography.Title heading={4}>创建的题单</Typography.Title>

      <Typography.Title heading={4}>参与的比赛</Typography.Title>
      <Typography.Paragraph>
        {attendedContests.length ? (
          <ul>
            {attendedContests.map((contest) => (
              <li key={contest.id}>
                <Link to={`/contest/${contest.id}`}>{contest.title}</Link>
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
