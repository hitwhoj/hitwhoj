import type { ActionFunction, LoaderFunction } from "@remix-run/node";
import { Link, useFetcher, useLoaderData } from "@remix-run/react";
import type { FormMethod } from "@remix-run/react";
import { db } from "~/utils/server/db.server";
import { TeamMemberRole } from "@prisma/client";
import type { User } from "@prisma/client";
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
import { useEffect, useState } from "react";
import { UserAvatar } from "~/src/user/UserAvatar";
import { findSessionUid } from "~/utils/sessions";
import { TeamMemberRoleTag } from "~/src/team/TeamMemberRoleTag";
const Row = Grid.Row;
const Col = Grid.Col;
const MenuItem = Menu.Item;

type Member = Pick<User, "id" | "username" | "avatar"> & {
  role: TeamMemberRole;
};

type LoaderData = {
  members: Member[];
};

enum ActionType {
  AddMember = "AddMember",
  DeleteMember = "DeleteMember",
  ChangeRole = "ChangeRole",
}

export const loader: LoaderFunction<LoaderData> = async ({ params }) => {
  const teamId = invariant(idScheme, params.teamId);
  const result = await db.teamMember.findMany({
    where: { teamId },
    select: {
      user: {
        select: {
          id: true,
          username: true,
          avatar: true,
        },
      },
      role: true,
    },
  });
  return {
    members: result.map((member) => ({ ...member.user, role: member.role })),
  };
};

export const action: ActionFunction<Response> = async ({ params, request }) => {
  const teamId = invariant(idScheme, params.teamId);
  const form = await request.formData();

  const memberId = invariant(idScheme, form.get("member"));
  const _action = form.get("_action");

  const self = await findSessionUid(request);
  const teamMember = await db.teamMember.findUnique({
    where: { userId_teamId: { teamId, userId: self } },
    select: { role: true },
  });

  if (!teamMember) {
    throw new Response("You are not in this team", { status: 403 });
  }

  switch (_action) {
    case ActionType.AddMember: {
      await db.teamMember.create({
        data: {
          teamId,
          userId: memberId,
        },
      });
      return new Response("add member success", { status: 200 });
    }
    case ActionType.DeleteMember: {
      if (memberId === self) {
        throw new Response("You can't delete yourself", { status: 403 });
      }

      if (
        teamMember.role != TeamMemberRole.Owner &&
        teamMember.role != TeamMemberRole.Admin
      ) {
        throw new Response("Only owner or admin can delete member", {
          status: 403,
        });
      }

      await db.teamMember.delete({
        where: {
          userId_teamId: {
            userId: memberId,
            teamId,
          },
        },
      });

      return new Response("delete member success", { status: 200 });
    }
    case ActionType.ChangeRole: {
      const role = invariant(teamMemberRoleScheme, form.get("role"));

      await db.teamMember.update({
        where: {
          userId_teamId: {
            userId: memberId,
            teamId,
          },
        },
        data: {
          role,
        },
      });

      return new Response("change role success", { status: 200 });
    }
  }

  throw new Response("I'm a teapot", { status: 418 });
};

const DeleteMember = ({ id }: { id: number }) => {
  const fetcher = useFetcher();
  if (fetcher.state === "loading") {
    Message.success("删除成员成功");
  }

  return (
    <fetcher.Form method="post">
      <input name="member" type="hidden" value={id} />
      <Tooltip content="踢出团队">
        <Button
          type="primary"
          status="danger"
          icon={<IconDelete />}
          htmlType="submit"
          name="_action"
          value={ActionType.DeleteMember}
          loading={
            fetcher.state === "submitting" || fetcher.state === "loading"
          }
        />
      </Tooltip>
    </fetcher.Form>
  );
};

const SetMemberRole = ({ id, role }: { id: number; role: TeamMemberRole }) => {
  const fetcher = useFetcher();
  if (fetcher.state === "loading") {
    Message.success("设定成员角色成功");
  }

  const renderDropdown = (role: TeamMemberRole) => {
    const formData = new FormData();
    formData.append("_action", ActionType.ChangeRole);
    formData.append("member", String(id));
    const formOptions: { method: FormMethod } = {
      method: "post",
    };

    return (
      <Menu>
        {role == TeamMemberRole.Member && (
          <MenuItem
            key={TeamMemberRole.Member}
            onClick={() => {
              formData.append("role", String(TeamMemberRole.Admin));
              fetcher.submit(formData, formOptions);
            }}
          >
            设为管理员
          </MenuItem>
        )}
        {role == TeamMemberRole.Admin && (
          <MenuItem
            key={TeamMemberRole.Admin}
            onClick={() => {
              formData.append("role", String(TeamMemberRole.Member));
              fetcher.submit(formData, formOptions);
            }}
          >
            设为普通成员
          </MenuItem>
        )}
      </Menu>
    );
  };

  return (
    <fetcher.Form method="post">
      <Dropdown droplist={renderDropdown(role)}>
        <Button
          type="primary"
          icon={<IconSettings />}
          loading={
            fetcher.state === "submitting" || fetcher.state === "loading"
          }
        />
      </Dropdown>
    </fetcher.Form>
  );
};

const MemberCard = ({ id, username, avatar, role }: Member) => {
  return (
    <Card hoverable>
      <Row justify="space-between" align="center">
        <Link to={`/user/${id}`}>
          <Space>
            <UserAvatar
              user={{ username, avatar, nickname: username }}
              style={{ marginRight: 10, backgroundColor: "#165DFF" }}
              size={32}
            />
            <Typography.Text>{username}</Typography.Text>
            <Typography.Text>
              <TeamMemberRoleTag role={role} />
            </Typography.Text>
          </Space>
        </Link>
        <Space>
          <SetMemberRole id={id} role={role} />
          <DeleteMember id={id} />
        </Space>
      </Row>
    </Card>
  );
};

const Members = ({ members }: { members: Member[] }) => {
  return (
    <Row justify="space-between" gutter={20}>
      {members.map((member) => (
        <Col key={member.id} xs={24} sm={12} style={{ margin: "10px 0" }}>
          <MemberCard
            id={member.id}
            username={member.username}
            avatar={member.avatar}
            role={member.role}
          />
        </Col>
      ))}
    </Row>
  );
};

export default function MemberList() {
  const { members } = useLoaderData<LoaderData>();
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
          <Button
            onClick={() => setModalVisible(true)}
            type="primary"
            icon={<IconPlus />}
            loading={fetcher.state === "submitting"}
          >
            添加成员
          </Button>
        </Row>
      </Typography.Title>

      <Typography.Paragraph>
        <Members members={members} />
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
              placeholder="User ID"
              required
              value={userIdInput}
              onInput={(e: any) => setUserIdInput(e.target.value)}
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
