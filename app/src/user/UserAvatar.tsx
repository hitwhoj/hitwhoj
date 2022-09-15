import type { User } from "@prisma/client";
import type { HTMLProps } from "react";

type Props = {
  user: Pick<User, "nickname" | "username" | "avatar">;
};

export function UserAvatar({
  user,
  className,
  ...props
}: Props & HTMLProps<HTMLDivElement>) {
  const name = user.nickname || user.username;

  return (
    <div
      className={`avatar placeholder overflow-hidden flex justify-center items-center rounded-box ${
        className ?? "w-16 h-16 text-3xl"
      }`}
      {...props}
    >
      {user.avatar ? (
        <img src={user.avatar} alt={name} />
      ) : (
        <span className="text-base-content">{name.charAt(0)}</span>
      )}
    </div>
  );
}
