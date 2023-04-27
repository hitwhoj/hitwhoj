import { Link } from "@remix-run/react";
import { AiOutlineTrophy } from "react-icons/ai";
import { HiOutlineEyeOff } from "react-icons/hi";
import type { SerializeFrom } from "@remix-run/node";
import type { ContestListData } from "~/utils/db/contest";
import { ContestStateTag} from "~/src/contest/ContestStateTag";

type Props = {
  contest: SerializeFrom<ContestListData>;
  teamId: string;
};

export function ContestLink({ contest,teamId}: Props) {
  return (
    <Link
      className="link inline-flex items-center gap-2"
      to={`/${teamId}/contest/${contest.id}`}
    >
      <AiOutlineTrophy />
      {contest.title}
      {contest.private && <HiOutlineEyeOff />}
      <ContestStateTag
        beginTime={contest.beginTime}
        endTime={contest.endTime}
      />
    </Link>
  );
}
