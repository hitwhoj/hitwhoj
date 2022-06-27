import type { User } from "@prisma/client";
import { Link } from "@remix-run/react";

type Props = {
  user: Pick<User, "id" | "nickname" | "username">;
};

export function UserLink({ user }: Props) {
  return (
    <Link to={`/user/${user.id}`}>
      {user.nickname ? (
        <>
          {user.nickname}{" "}
          <span style={{ color: "rgb(var(--gray-6))" }}>({user.username})</span>
        </>
      ) : (
        user.username
      )}
    </Link>
  );
}
