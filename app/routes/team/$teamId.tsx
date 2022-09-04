import { Outlet, useLoaderData } from "@remix-run/react";
import { db } from "~/utils/server/db.server";
import { invariant } from "~/utils/invariant";
import { idScheme } from "~/utils/scheme";
import { Space, Typography } from "@arco-design/web-react";
import { Navigator } from "~/src/Navigator";
import { IconUserGroup } from "@arco-design/web-react/icon";
import type { LoaderArgs } from "@remix-run/node";
import { json } from "@remix-run/node";
import { findRequestUser } from "~/utils/permission";
import { Permissions } from "~/utils/permission/permission";

export async function loader({ request, params }: LoaderArgs) {
  const teamId = invariant(idScheme, params.teamId, { status: 404 });
  const self = await findRequestUser(request);
  const [hasViewPerm, hasEditPerm] = await self
    .team(teamId)
    .hasPermission(
      Permissions.PERM_TEAM_VIEW_INTERNAL,
      Permissions.PERM_TEAM_EDIT_INTERNAL
    );

  const team = await db.team.findUnique({
    where: { id: teamId },
    select: { name: true },
  });

  if (!team) {
    throw new Response("团队不存在", { status: 404 });
  }

  return json({ team, hasViewPerm, hasEditPerm });
}

export default function Record() {
  const { team, hasEditPerm, hasViewPerm } = useLoaderData<typeof loader>();

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
            ...(hasViewPerm ? [{ title: "比赛", key: "contest" }] : []),
            ...(hasViewPerm ? [{ title: "成员", key: "members" }] : []),
            ...(hasViewPerm || hasEditPerm
              ? [{ title: "设置", key: "settings" }]
              : []),
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
