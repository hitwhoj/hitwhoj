import type { Problem } from "@prisma/client";
import { Link } from "@remix-run/react";
import { HiOutlineEyeOff } from "react-icons/hi";

type Props = {
  problem: Pick<Problem, "id" | "title" | "private">;
  teamId: string;
};

export function ProblemLink({ problem, teamId }: Props) {
  return (
    <Link
      to={`/${teamId}/problem/${problem.id}`}
      className="link inline-flex items-center gap-2"
    >
      <span>{problem.title}</span>
      {problem.private && <HiOutlineEyeOff className="inline-block" />}
    </Link>
  );
}
