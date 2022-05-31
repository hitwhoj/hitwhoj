import { Space, Tag, Typography } from "@arco-design/web-react";
import {
  IconClockCircle,
  IconTag,
  IconUser,
} from "@arco-design/web-react/icon";
import { Link } from "@remix-run/react";
import type { ContestListData } from "~/utils/db/contest";
import { ContestStateTag } from "./ContestStateTag";
import { ContestSystemTag } from "./ContestSystemTag";

type Props = {
  contest: ContestListData;
};

export function ContestListItem({ contest }: Props) {
  return (
    <Typography>
      <Typography.Title heading={4}>
        <Link to={`/contest/${contest.id}`}>{contest.title}</Link>
      </Typography.Title>
      <Space>
        <ContestStateTag
          beginTime={contest.beginTime}
          endTime={contest.endTime}
        />
        <ContestSystemTag system={contest.system} />
        <Tag icon={<IconClockCircle />} title="比赛时间">
          {`${(
            (new Date(contest.endTime).getTime() -
              new Date(contest.beginTime).getTime()) /
            3600000
          ).toFixed(1)} 小时`}
        </Tag>
        <Tag icon={<IconUser />} title="参加人数">
          {contest._count.attendees}
        </Tag>
        {contest.tags.map((tag) => (
          <Tag key={tag.name} icon={<IconTag />}>
            <Link to={`/contest/tag/${tag.name}`}>{tag.name}</Link>
          </Tag>
        ))}
      </Space>
    </Typography>
  );
}
