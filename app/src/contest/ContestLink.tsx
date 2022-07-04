import { Space } from "@arco-design/web-react";
import { IconEyeInvisible, IconTrophy } from "@arco-design/web-react/icon";
import type { Contest } from "@prisma/client";
import { Link } from "@remix-run/react";
import { ContestStateTag } from "./ContestStateTag";

type Props = {
  contest: Pick<Contest, "id" | "title" | "private" | "beginTime" | "endTime">;
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
