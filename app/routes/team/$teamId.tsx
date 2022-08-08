import type { LoaderFunction } from "@remix-run/node";
import { Outlet, useLoaderData } from "@remix-run/react";
import { db } from "~/utils/server/db.server";
import type { Team } from "@prisma/client";
import { invariant } from "~/utils/invariant";
import { idScheme } from "~/utils/scheme";
import { Space, Typography } from "@arco-design/web-react";
import { Navigator } from "~/src/Navigator";
import { IconUserGroup } from "@arco-design/web-react/icon";

type LoaderData = {
  team: Pick<Team, "name">;
};

export function loader({ params }: LoaderArgs) {
  const teamId = invariant(idScheme, params.teamId);
  const team = await db.team.findUnique({
    where: { id: teamId },
    select: { name: true },
  });

  if (!team) {
    throw new Response("团队不存在", { status: 404 });
  }

  return { team };
}

export default function Record() {
  const { team } = useLoaderData<LoaderData>();

  return (
    <Typography>
      <Typography.Title heading={3}>
        <Space>
          <IconUserGroup />
          {team.name}
        </Space>
      </Typography.Title>

      <Typography.Paragraph>
        <Navigator
          routes={[
            { title: "信息", key: "." },
            { title: "比赛", key: "contest" },
            { title: "成员", key: "members" },
            { title: "设置", key: "settings" },
          ]}
        />
      </Typography.Paragraph>

      <Typography.Paragraph>
        <Outlet />
      </Typography.Paragraph>
    </Typography>
  );
}

export { CatchBoundary } from "~/src/CatchBoundary";
export { ErrorBoundary } from "~/src/ErrorBoundary";
