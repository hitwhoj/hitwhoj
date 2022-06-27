import { Empty, Table } from "@arco-design/web-react";
import type { ContestListData } from "~/utils/db/contest";
import { formatDateTime } from "~/utils/tools";
import { ContestSystemTag } from "./ContestSystemTag";
import { ContestLink } from "./ContestLink";

type Props = {
  contests: ContestListData[];
};

export function ContestList({ contests }: Props) {
  return (
    <Table
      columns={[
        {
          title: "标题",
          dataIndex: "title",
          render: (_, contest) => <ContestLink contest={contest} />,
        },
        {
          title: "赛制",
          dataIndex: "system",
          align: "center",
          cellStyle: { width: "5%", whiteSpace: "nowrap" },
          render: (system) => <ContestSystemTag system={system} />,
        },
        {
          title: "开始时间",
          dataIndex: "beginTime",
          align: "center",
          cellStyle: { width: "5%", whiteSpace: "nowrap" },
          render: (time) => formatDateTime(time),
        },
        {
          title: "结束时间",
          dataIndex: "endTime",
          align: "center",
          cellStyle: { width: "5%", whiteSpace: "nowrap" },
          render: (time) => formatDateTime(time),
        },
      ]}
      data={contests}
      rowKey="id"
      noDataElement={<Empty description="没有比赛" />}
      hover={false}
      border={false}
      pagination={false}
    />
  );
}
