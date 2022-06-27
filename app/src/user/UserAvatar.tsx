import type { AvatarProps } from "@arco-design/web-react";
import { Avatar } from "@arco-design/web-react";
import type { User } from "@prisma/client";

type Props = {
  user: Pick<User, "nickname" | "username" | "avatar">;
} & AvatarProps;

export function UserAvatar({ user, ...props }: Props) {
  const name = user.nickname || user.username;

  return (
    <Avatar {...props}>
      {user.avatar ? <img src={user.avatar} alt={name} /> : name.charAt(0)}
    </Avatar>
  );
}
