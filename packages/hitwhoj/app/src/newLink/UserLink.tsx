import { Link } from "@remix-run/react";
import type { UserData } from "~/utils/db/user";
import { UserAvatar } from "~/src/user/UserAvatar";

type Props = {
  user: UserData;
  teamId: string;
};

export function UserLink({ user, teamId }: Props) {
  return (
    <div className="dropdown dropdown-top dropdown-hover">
      <Link tabIndex={0} className="link" to={`/${teamId}/user/${user.id}`}>
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
        className="dropdown-content rounded-box bg-base-300 flex w-72 gap-4 p-4 shadow-2xl"
      >
        <UserAvatar
          user={user}
          className="bg-base-100 h-16 w-16 flex-shrink-0 text-3xl"
        />
        <div className="whitespace-normal">
          <div className="text-lg font-bold">
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
