import { Space } from "@arco-design/web-react";
import { IconEyeInvisible, IconTrophy } from "@arco-design/web-react/icon";
import type { SerializeFrom } from "@remix-run/node";
import { Link } from "@remix-run/react";
import type { ContestListData } from "~/utils/db/contest";
import { ContestStateTag } from "./ContestStateTag";

type Props = {
  contest: SerializeFrom<ContestListData>;
};

export function ContestLink({ contest }: Props) {
  return (
    <Link to={`/contest/${contest.id}`}>
      <Space>
        <IconTrophy />
        {contest.title}
        {contest.private && <IconEyeInvisible />}
        <ContestStateTag
          beginTime={contest.beginTime}
          endTime={contest.endTime}
        />
      </Space>
    </Link>
  );
}
