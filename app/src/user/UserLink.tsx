import { Link } from "@remix-run/react";
import type { UserData } from "~/utils/db/user";
import { UserAvatar } from "./UserAvatar";

type Props = {
  user: UserData;
};

export function UserLink({ user }: Props) {
  return (
    <div className="dropdown dropdown-hover dropdown-top">
      <Link tabIndex={0} className="link" to={`/user/${user.id}`}>
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
      <div
        tabIndex={0}
        className="dropdown-content p-4 shadow bg-base-300 rounded-box w-72 flex gap-4"
      >
        <UserAvatar user={user} />
        <div className="whitespace-normal">
          <div className="font-bold text-lg">
            {user.nickname || user.username}
          </div>
          <div className="text-base-content">
            {user.bio || <span className="italic">没有签名</span>}
          </div>
        </div>
      </div>
    </div>
  );
}
