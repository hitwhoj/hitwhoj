import { Empty, List } from "@arco-design/web-react";
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
    <List
      dataSource={contests}
      bordered={false}
      render={(contest) => <ContestListItem contest={contest} />}
    />
  );
}
