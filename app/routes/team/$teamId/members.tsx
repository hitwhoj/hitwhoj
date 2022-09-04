import type { ActionArgs, LoaderArgs } from "@remix-run/node";
import { json } from "@remix-run/node";
import { Link, useFetcher, useLoaderData } from "@remix-run/react";
import { db } from "~/utils/server/db.server";
import { TeamMemberRole } from "@prisma/client";
import { invariant } from "~/utils/invariant";
import { idScheme, teamMemberRoleScheme } from "~/utils/scheme";
import {
  Button,
  Card,
  Dropdown,
  Grid,
  Input,
  Menu,
  Message,
  Modal,
  Space,
  Tooltip,
  Typography,
} from "@arco-design/web-react";
import {
  IconDelete,
  IconPlus,
  IconSettings,
} from "@arco-design/web-react/icon";
import { useEffect, useRef, useState } from "react";
import { UserAvatar } from "~/src/user/UserAvatar";
import { findRequestUser } from "~/utils/permission";
import { TeamMemberRoleTag } from "~/src/team/TeamMemberRoleTag";
import { Permissions } from "~/utils/permission/permission";
import { Privileges } from "~/utils/permission/privilege";
import {
  findTeamAllowMembersInvite,
  findTeamMemberRole,
} from "~/utils/db/team";
import type { UseDataFunctionReturn } from "@remix-run/react/dist/components";
import { UserLink } from "~/src/user/UserLink";
import { selectUserData } from "~/utils/db/user";
const Row = Grid.Row;
const Col = Grid.Col;
const MenuItem = Menu.Item;

export async function loader({ request, params }: LoaderArgs) {
  const teamId = invariant(idScheme, params.teamId);
  const self = await findRequestUser(request);
  await self.team(teamId).checkPermission(Permissions.PERM_TEAM_VIEW_INTERNAL);
  const [hasEditPerm, hasInvitePerm, hasKickAdminPerm, hasKickMemberPerm] =
    await self
      .team(teamId)
      .hasPermission(
        Permissions.PERM_TEAM_EDIT_MEMBER_ROLE,
        (await findTeamAllowMembersInvite(teamId))
          ? Permissions.PERM_TEAM_INVITE_MEMBER
          : Permissions.PERM_TEAM_INVITE_ADMIN,
        Permissions.PERM_TEAM_KICK_ADMIN,
        Permissions.PERM_TEAM_KICK_MEMBER
      );

  const members = await db.teamMember.findMany({
    where: { teamId },
    select: {
      user: { select: selectUserData },
      role: true,
    },
  });

  return json({
    members,
    hasEditPerm,
    hasInvitePerm,
    hasKickAdminPerm,
    hasKickMemberPerm,
  });
}

type Member = UseDataFunctionReturn<typeof loader>["members"][number];

enum ActionType {
  AddMember = "AddMember",
  DeleteMember = "DeleteMember",
  ChangeRole = "ChangeRole",
}

export async function action({ params, request }: ActionArgs) {
  const teamId = invariant(idScheme, params.teamId);
  const self = await findRequestUser(request);
  await self.checkPrivilege(Privileges.PRIV_OPERATE);

  const form = await request.formData();
  const _action = form.get("_action");
  const memberId = invariant(idScheme, form.get("member"));

  switch (_action) {
    case ActionType.AddMember: {
      await self
        .team(teamId)
        .checkPermission(
          (await findTeamAllowMembersInvite(teamId))
            ? Permissions.PERM_TEAM_INVITE_MEMBER
            : Permissions.PERM_TEAM_INVITE_ADMIN
        );

      await db.$transaction(async (db) => {
        const exists = await db.teamMember.findUnique({
          where: { userId_teamId: { teamId, userId: memberId } },
        });

        if (exists) {
          throw new Response("User is already in this team", { status: 400 });
        }

        await db.teamMember.create({
          data: { teamId, userId: memberId },
        });
      });
      return null;
    }

    case ActionType.DeleteMember: {
      await self
        .team(teamId)
        .checkPermission(
          (await findTeamMemberRole(teamId, memberId)) === TeamMemberRole.Member
            ? Permissions.PERM_TEAM_KICK_MEMBER
            : Permissions.PERM_TEAM_KICK_ADMIN
        );

      await db.$transaction(async (db) => {
        const exists = await db.teamMember.findUnique({
          where: { userId_teamId: { teamId, userId: memberId } },
        });

        if (!exists) {
          throw new Response("User is not in this team", { status: 400 });
        }

        await db.teamMember.delete({
          where: { userId_teamId: { userId: memberId, teamId } },
        });
      });

      return null;
    }

    case ActionType.ChangeRole: {
      await self
        .team(teamId)
        .checkPermission(Permissions.PERM_TEAM_EDIT_MEMBER_ROLE);

      const role = invariant(teamMemberRoleScheme, form.get("role"));

      await db.$transaction(async (db) => {
        const exists = await db.teamMember.findUnique({
          where: { userId_teamId: { teamId, userId: memberId } },
        });

        if (!exists) {
          throw new Response("User is not in this team", { status: 400 });
        }

        await db.teamMember.update({
          where: { userId_teamId: { userId: memberId, teamId } },
          data: { role },
        });
      });

      return null;
    }
  }

  throw new Response("Unknown action type", { status: 400 });
}

function DeleteMember({ id }: { id: number }) {
  const fetcher = useFetcher();
  const isActionSubmit =
    fetcher.state === "submitting" && fetcher.type === "actionSubmission";
  const isActionReload =
    fetcher.state === "loading" && fetcher.type === "actionReload";
  const isLoading = isActionSubmit || isActionReload;

  useEffect(() => {
    if (isActionReload) {
      Message.success("踢出成功");
    }
  }, [isActionReload]);

  return (
    <fetcher.Form method="post">
      <input type="hidden" name="member" value={id} />
      <Tooltip content="踢出团队">
        <Button
          type="primary"
          status="danger"
          icon={<IconDelete />}
          htmlType="submit"
          name="_action"
          value={ActionType.DeleteMember}
          loading={isLoading}
        />
      </Tooltip>
    </fetcher.Form>
  );
}

function SetMemberRole({ id, role }: { id: number; role: TeamMemberRole }) {
  const fetcher = useFetcher();
  const isActionSubmit =
    fetcher.state === "submitting" && fetcher.type === "actionSubmission";
  const isActionReload =
    fetcher.state === "loading" && fetcher.type === "actionReload";
  const isLoading = isActionSubmit || isActionReload;

  useEffect(() => {
    if (isActionReload) {
      Message.success("设定成员角色成功");
    }
  }, [isActionReload]);

  const setOwnerRef = useRef<HTMLButtonElement>(null);
  const setAdminRef = useRef<HTMLButtonElement>(null);
  const setMemberRef = useRef<HTMLButtonElement>(null);

  return (
    <fetcher.Form method="post">
      <input type="hidden" name="member" value={id} />
      <input type="hidden" name="_action" value={ActionType.ChangeRole} />
      <button
        hidden
        type="submit"
        name="role"
        value={TeamMemberRole.Owner}
        ref={setOwnerRef}
      />
      <button
        hidden
        type="submit"
        name="role"
        value={TeamMemberRole.Admin}
        ref={setAdminRef}
      />
      <button
        hidden
        type="submit"
        name="role"
        value={TeamMemberRole.Member}
        ref={setMemberRef}
      />

      <Dropdown
        droplist={
          <Menu>
            <MenuItem
              key={TeamMemberRole.Owner}
              onClick={() => setOwnerRef.current?.click()}
              disabled={role === TeamMemberRole.Owner}
            >
              设为所有人
            </MenuItem>
            <MenuItem
              key={TeamMemberRole.Admin}
              onClick={() => setAdminRef.current?.click()}
              disabled={role === TeamMemberRole.Admin}
            >
              设为管理员
            </MenuItem>
            <MenuItem
              key={TeamMemberRole.Member}
              onClick={() => setMemberRef.current?.click()}
              disabled={role === TeamMemberRole.Member}
            >
              设为成员
            </MenuItem>
          </Menu>
        }
      >
        <Button type="primary" icon={<IconSettings />} loading={isLoading} />
      </Dropdown>
    </fetcher.Form>
  );
}

type MemberCardProps = {
  member: Member;
  hasEditPerm: boolean;
  hasKickAdminPerm: boolean;
  hasKickMemberPerm: boolean;
};

function MemberCard({
  member,
  hasEditPerm,
  hasKickAdminPerm,
  hasKickMemberPerm,
}: MemberCardProps) {
  return (
    <Card hoverable>
      <Row justify="space-between" align="center">
        <Link to={`/user/${member.user.id}`}>
          <Space>
            <UserAvatar user={member.user} />
            <Typography.Text>
              <UserLink user={member.user} />
            </Typography.Text>
            <Typography.Text>
              <TeamMemberRoleTag role={member.role} />
            </Typography.Text>
          </Space>
        </Link>
        <Space>
          {hasEditPerm && (
            <SetMemberRole id={member.user.id} role={member.role} />
          )}
          {(member.role === TeamMemberRole.Member
            ? hasKickMemberPerm
            : hasKickAdminPerm) && <DeleteMember id={member.user.id} />}
        </Space>
      </Row>
    </Card>
  );
}

type MembersProps = {
  members: Member[];
  hasEditPerm: boolean;
  hasKickAdminPerm: boolean;
  hasKickMemberPerm: boolean;
};

function Members({ members, ...perms }: MembersProps) {
  return (
    <Row justify="space-between" gutter={20}>
      {members.map((member) => (
        <Col key={member.user.id} xs={24} sm={12} style={{ margin: "10px 0" }}>
          <MemberCard member={member} {...perms} />
        </Col>
      ))}
    </Row>
  );
}

export default function MemberList() {
  const {
    members,
    hasEditPerm,
    hasInvitePerm,
    hasKickAdminPerm,
    hasKickMemberPerm,
  } = useLoaderData<typeof loader>();
  const fetcher = useFetcher();
  const [modalVisible, setModalVisible] = useState(false);
  const [userIdInput, setUserIdInput] = useState("");
  useEffect(() => {
    if (fetcher.state === "idle") {
      setModalVisible(false);
      setUserIdInput("");
    }
  }, [fetcher]);
  return (
    <Typography>
      <Typography.Title heading={4}>
        <Row justify="space-between" align="center">
          <span>团队成员</span>
          {hasInvitePerm && (
            <Button
              type="primary"
              icon={<IconPlus />}
              onClick={() => setModalVisible(true)}
            >
              添加成员
            </Button>
          )}
        </Row>
      </Typography.Title>

      <Typography.Paragraph>
        <Members
          members={members}
          hasEditPerm={hasEditPerm}
          hasKickAdminPerm={hasKickAdminPerm}
          hasKickMemberPerm={hasKickMemberPerm}
        />
      </Typography.Paragraph>

      <Modal
        title="添加成员"
        visible={modalVisible}
        footer={null}
        autoFocus
        onCancel={() => setModalVisible(false)}
        style={{ width: "350px" }}
      >
        <fetcher.Form method="post">
          <Space
            style={{
              width: "100%",
              display: "flex",
              justifyContent: "space-around",
            }}
          >
            <Input
              type="text"
              name="member"
              placeholder="用户 ID"
              required
              value={userIdInput}
              onChange={(userId) => setUserIdInput(userId)}
            />
            <Button
              type="primary"
              htmlType="submit"
              name="_action"
              value={ActionType.AddMember}
              loading={fetcher.state != "idle"}
            >
              提交
            </Button>
          </Space>
        </fetcher.Form>
      </Modal>
    </Typography>
  );
}

export { CatchBoundary } from "~/src/CatchBoundary";
export { ErrorBoundary } from "~/src/ErrorBoundary";
