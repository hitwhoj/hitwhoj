import { Link } from "@remix-run/react";
import { AiOutlineTrophy } from "react-icons/ai";
import { HiOutlineEyeOff } from "react-icons/hi";
import type { SerializeFrom } from "@remix-run/node";
import type { ContestListData } from "~/utils/db/contest";
import { ContestStateTag } from "./ContestStateTag";

type Props = {
  contest: SerializeFrom<ContestListData>;
};

export function ContestLink({ contest }: Props) {
  return (
    <Link
      className="link inline-flex gap-2 items-center"
      to={`/contest/${contest.id}`}
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
