import { Typography } from "@arco-design/web-react";
import { Link } from "@remix-run/react";
import type { ContestListData } from "~/utils/db/contest";
import { ContestTags } from "./ContestTags";

type Props = {
  contest: ContestListData;
};

export function ContestListItem({ contest }: Props) {
  return (
    <Typography>
      <Typography.Title heading={4}>
        <Link to={`/contest/${contest.id}`}>{contest.title}</Link>
      </Typography.Title>
      <ContestTags contest={contest} />
    </Typography>
  );
}
