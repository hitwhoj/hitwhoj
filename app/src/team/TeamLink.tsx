import type { Team } from "@prisma/client";
import { Link } from "@remix-run/react";
import { HiOutlineUserGroup } from "react-icons/hi";

type Props = {
  team: Pick<Team, "id" | "name">;
};

export function TeamLink({ team }: Props) {
  return (
    <Link
      className="link inline-flex gap-2 items-center"
      to={`/team/${team.id}`}
    >
      <HiOutlineUserGroup />
      <span>{team.name}</span>
    </Link>
  );
}
