import type { LoaderFunction } from "@remix-run/node";
import { Link, useLoaderData } from "@remix-run/react";
import { db } from "~/utils/server/db.server";
import type { User } from "@prisma/client";
import { invariant } from "~/utils/invariant";
import { idScheme } from "~/utils/scheme";
import { Avatar, Button, Card, Grid, Typography } from "@arco-design/web-react";
import { IconDelete, IconPlus } from "@arco-design/web-react/icon";
const Row = Grid.Row;
const Col = Grid.Col;

type Member = Pick<User, "id" | "username" | "avatar">;

type LoaderData = {
  members: Member[];
};

export const loader: LoaderFunction<LoaderData> = async ({ params }) => {
  const teamId = invariant(idScheme.safeParse(params.teamId));
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

  return {
    members: result.map(({ user }) => user),
  };
};

const CardContent = ({ id, username, avatar }: Member) => {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
      }}
    >
      <Link to={`/user/${id}`}>
        <span style={{ display: "flex", alignItems: "center" }}>
          <Avatar
            style={{ marginRight: 10, backgroundColor: "#165DFF" }}
            size={32}
          >
            {avatar ? (
              <img alt="avatar" src={avatar} />
            ) : (
              <span>{username.charAt(0)}</span>
            )}
          </Avatar>
          <Typography.Text>{username}</Typography.Text>
        </span>
      </Link>
      <Button type="primary" status="danger" icon={<IconDelete />} />
    </div>
  );
};

const Members = ({ members }: { members: Member[] }) => {
  return (
    <Row justify="space-around">
      {members.map((member) => (
        <Col key={member.id} xs={24} sm={11} style={{ marginBottom: 15 }}>
          <Card hoverable>
            <CardContent
              id={member.id}
              username={member.username}
              avatar={member.avatar}
            />
          </Card>
        </Col>
      ))}
    </Row>
  );
};

export default function MemberList() {
  const { members } = useLoaderData<LoaderData>();
  return (
    <>
      <Grid.Row
        justify="end"
        align="center"
        style={{
          height: "3rem",
        }}
      >
        <Button type="primary" icon={<IconPlus />}>
          {" "}
          add member{" "}
        </Button>
      </Grid.Row>
      <Card style={{ width: "100%" }}>{<Members members={members} />}</Card>
    </>
  );
}
