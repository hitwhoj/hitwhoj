import { Divider, Empty } from "@arco-design/web-react";
import { Fragment } from "react";
import type { ContestListData } from "~/utils/db/contest";
import { ContestListItem } from "./ContestListItem";

type Props = {
  contests: ContestListData[];
};

export function ContestList({ contests }: Props) {
  if (contests.length === 0) {
    return <Empty description="没有比赛" />;
  }

  return (
    <div>
      {contests.map((contest) => (
        <Fragment key={contest.id}>
          <ContestListItem contest={contest} />
          <Divider />
        </Fragment>
      ))}
    </div>
  );
}
