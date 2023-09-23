import type { ProblemSet } from "@prisma/client";
import { Link } from "@remix-run/react";
import { HiOutlineEyeOff } from "react-icons/hi";

type Props = {
  problemset: Pick<ProblemSet, "id" | "title" | "private">;
};

export function TeamProblemSetLink({ problemset }: Props) {
  return (
    <Link
      className="link inline-flex items-center gap-2"
      to={`team/problemset/${problemset.id}`}
    >
      <span>{problemset.title}</span>
      {problemset.private && <HiOutlineEyeOff className="inline-block" />}
    </Link>
  );
}
