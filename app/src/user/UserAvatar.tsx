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
      className={`avatar placeholder ${className ?? "w-16 h-16"}`}
      {...props}
    >
      <div className="rounded-box bg-base-100">
        {user.avatar ? (
          <img src={user.avatar} alt={name} />
        ) : (
          <span className="text-3xl">{name.charAt(0)}</span>
        )}
      </div>
    </div>
  );
}
