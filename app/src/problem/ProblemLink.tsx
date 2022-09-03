import type { Problem } from "@prisma/client";
import { Link } from "@remix-run/react";
import { HiOutlineEyeOff } from "react-icons/hi";

type Props = {
  problem: Pick<Problem, "id" | "title" | "private">;
};

export function ProblemLink({ problem }: Props) {
  return (
    <Link
      to={`/problem/${problem.id}`}
      className="link inline-flex gap-2 items-center"
    >
      <span>{problem.title}</span>
      {problem.private && <HiOutlineEyeOff className="inline-block" />}
    </Link>
  );
}
