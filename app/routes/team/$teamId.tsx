import { Outlet, useLoaderData, useFetcher } from "@remix-run/react";
import { db } from "~/utils/server/db.server";
import { InvitationType } from "@prisma/client";
import { findRequestUser } from "~/utils/permission";
import { invariant } from "~/utils/invariant";
import { idScheme, teamInvitationCodeScheme } from "~/utils/scheme";
import { Space, Typography, Input, Button } from "@arco-design/web-react";
import { Navigator } from "~/src/Navigator";
import { IconUserGroup } from "@arco-design/web-react/icon";
import type { LoaderArgs, ActionArgs } from "@remix-run/node";

export async function loader({ request, params }: LoaderArgs) {
  const teamId = invariant(idScheme, params.teamId, { status: 404 });
  const team = await db.team.findUnique({
    where: { id: teamId },
    select: { name: true, invitationType: true },
  });

  if (!team) {
    throw new Response("团队不存在", { status: 404 });
  }

  const user = await findRequestUser(request);

  const userInTeam = Boolean(
    user.userId &&
      (await db.teamMember.findUnique({
        where: {
          userId_teamId: {
            userId: user.userId,
            teamId,
          },
        },
      }))
  );

  return {
    team,
    userInTeam,
  };
}

export const action = async ({ params, request }: ActionArgs) => {
  const teamId = invariant(idScheme, params.teamId);
  const team = await db.team.findUnique({
    where: { id: teamId },
    select: { invitationType: true, invitationCode: true },
  });

  if (!team) {
    throw new Response("团队不存在", { status: 404 });
  }

  const user = await findRequestUser(request);
  if (!user.userId) {
    throw new Response("请先登录", { status: 401 });
  }

  const isMember = await db.teamMember.findUnique({
    where: {
      userId_teamId: {
        userId: user.userId,
        teamId,
      },
    },
  });
  if (isMember) {
    throw new Response("你已经是该团队成员了", { status: 400 });
  }

  if (team.invitationType === InvitationType.NONE) {
    throw new Response("该团队不允许加入", { status: 400 });
  }

  if (team.invitationType === InvitationType.CODE) {
    const form = await request.formData();
    const code = invariant(teamInvitationCodeScheme, form.get("code"));
    if (code !== team.invitationCode) {
      throw new Response("邀请码错误", { status: 400 });
    }
  }

  await db.teamMember.create({
    data: {
      user: {
        connect: {
          id: user.userId,
        },
      },
      team: {
        connect: {
          id: teamId,
        },
      },
    },
  });

  return new Response("加入团队成功", { status: 200 });
};

function JoinTeam({ invitationType }: { invitationType: InvitationType }) {
  const fetcher = useFetcher();
  const isJoining = fetcher.state === "submitting";

  return (
    <>
      {invitationType !== InvitationType.NONE && fetcher.state != "loading" && (
        <fetcher.Form method="post">
          <Space align="end">
            {invitationType === InvitationType.CODE && (
              <Input
                name="code"
                placeholder="请输入邀请码"
                required
                disabled={isJoining}
              />
            )}
            <Button type="primary" htmlType="submit" loading={isJoining}>
              加入团队
            </Button>
          </Space>
        </fetcher.Form>
      )}
    </>
  );
}

export default function Record() {
  const { team, userInTeam } = useLoaderData<typeof loader>();

  return (
    <Typography>
      <Typography.Title heading={3}>
        <Space>
          <IconUserGroup />
          {team.name}
        </Space>
      </Typography.Title>

      <Typography.Paragraph>
        {userInTeam ? (
          <Navigator
            routes={[
              { title: "信息", key: "." },
              { title: "比赛", key: "contest" },
              { title: "成员", key: "members" },
              { title: "设置", key: "settings" },
            ]}
          />
        ) : (
          <JoinTeam invitationType={team.invitationType} />
        )}
      </Typography.Paragraph>

      <Typography.Paragraph>
        <Outlet />
      </Typography.Paragraph>
    </Typography>
  );
}

export { CatchBoundary } from "~/src/CatchBoundary";
export { ErrorBoundary } from "~/src/ErrorBoundary";
