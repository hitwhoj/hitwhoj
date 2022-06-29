import { Popover, Space, Tag, Typography } from "@arco-design/web-react";
import { Link } from "@remix-run/react";
import type { UserData } from "~/utils/db/user";
import { isAdmin } from "~/utils/permission";
import { UserAvatar } from "./UserAvatar";

type Props = {
  user: UserData;
};

export function UserLink({ user }: Props) {
  return (
    <Popover
      trigger="hover"
      content={
        <Space align="start" size="medium">
          <UserAvatar user={user} />
          <Space direction="vertical" size="mini">
            <Typography.Text>
              <Space>
                <b>{user.nickname || user.username}</b>
                {isAdmin(user.role) && <Tag color="magenta">大会员</Tag>}
              </Space>
            </Typography.Text>
            <Typography.Text>
              {user.bio || (
                <i style={{ color: "rgb(var(--gray-6))" }}>没有签名</i>
              )}
            </Typography.Text>
          </Space>
        </Space>
      }
    >
      <Link to={`/user/${user.id}`}>
        {user.nickname ? (
          <>
            {user.nickname}{" "}
            <span style={{ color: "rgb(var(--gray-6))" }}>
              ({user.username})
            </span>
          </>
        ) : (
          user.username
        )}
      </Link>
    </Popover>
  );
}
