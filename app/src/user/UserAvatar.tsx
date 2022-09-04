import type { User } from "@prisma/client";

type Props = {
  user: Pick<User, "nickname" | "username" | "avatar">;
};

export function UserAvatar({ user }: Props) {
  const name = user.nickname || user.username;

  return (
    <div className="avatar placeholder">
      <div className="w-16 h-16 block rounded-box bg-base-100">
        {user.avatar ? (
          <img src={user.avatar} alt={name} />
        ) : (
          <span className="text-3xl">{name.charAt(0)}</span>
        )}
      </div>
    </div>
  );
}
