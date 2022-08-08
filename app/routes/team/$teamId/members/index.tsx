import { Link, useFetcher, useLoaderData } from "@remix-run/react";
import { db } from "~/utils/server/db.server";
import type { User } from "@prisma/client";
import { invariant } from "~/utils/invariant";
import { idScheme } from "~/utils/scheme";
import {
  Button,
  Card,
  Grid,
  Input,
  Modal,
  Space,
  Typography,
} from "@arco-design/web-react";
import { IconDelete, IconPlus } from "@arco-design/web-react/icon";
import { useEffect, useState } from "react";
import { UserAvatar } from "~/src/user/UserAvatar";
import type { ActionArgs, LoaderArgs } from "@remix-run/node";
import { json } from "@remix-run/node";

const Row = Grid.Row;
const Col = Grid.Col;

type Member = Pick<User, "id" | "username" | "avatar">;

enum ActionType {
  AddMember = "addMember",
  DeleteMember = "deleteMember",
}

export async function loader({ params }: LoaderArgs) {
  const teamId = invariant(idScheme, params.teamId, { status: 404 });
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
    },
  });

  return json({
    members: result.map(({ user }) => user),
  });
}

export async function action({ request, params }: ActionArgs) {
  const teamId = invariant(idScheme, params.teamId, { status: 404 });
  const form = await request.formData();

  const member = invariant(idScheme, form.get("member"));
  const _action = form.get("_action");

  switch (_action) {
    case ActionType.AddMember: {
      await db.teamMember.create({
        data: {
          teamId,
          userId: member,
        },
      });
      return;
    }
    case ActionType.DeleteMember: {
      await db.teamMember.delete({
        where: {
          userId_teamId: {
            userId: member,
            teamId,
          },
        },
      });
      return;
    }
  }

  throw new Response("Invalid action", { status: 400 });
}

const MemberCard = ({ id, username, avatar }: Member) => {
  const fetcher = useFetcher();
  return (
    <Card hoverable>
      <Row justify="space-between" align="center">
        <Link to={`/user/${id}`}>
          <span style={{ display: "flex", alignItems: "center" }}>
            <UserAvatar
              user={{ username, avatar, nickname: username }}
              style={{ marginRight: 10, backgroundColor: "#165DFF" }}
              size={32}
            />
            <Typography.Text>{username}</Typography.Text>
          </span>
        </Link>
        <fetcher.Form method="post">
          <input name="member" type="hidden" value={id} />
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
        </fetcher.Form>
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
          />
        </Col>
      ))}
    </Row>
  );
};

export default function MemberList() {
  const { members } = useLoaderData<typeof loader>();
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
