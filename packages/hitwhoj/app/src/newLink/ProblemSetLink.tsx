import type { ProblemSet } from "@prisma/client";
import { Link } from "@remix-run/react";
import { HiOutlineEyeOff } from "react-icons/hi";

type Props = {
  problemset: Pick<ProblemSet, "id" | "title" | "private">;
  teamId: string;
};

export function ProblemSetLink({ problemset, teamId }: Props) {
  return (
    <Link
      className="link inline-flex items-center gap-2"
      to={`/${teamId}/problemset/${problemset.id}`}
    >
      <span>{problemset.title}</span>
      {problemset.private && <HiOutlineEyeOff className="inline-block" />}
    </Link>
  );
}
