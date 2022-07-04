import type { TableColumnProps } from "@arco-design/web-react";
import { Table } from "@arco-design/web-react";
import type { ProblemListData } from "~/utils/db/problem";
import { ProblemLink } from "./ProblemLink";

type Props = {
  problems: ProblemListData[];
  columns?: TableColumnProps<ProblemListData>[];
};

export function ProblemList({ problems, columns }: Props) {
  return (
    <Table
      columns={[
        {
          title: "#",
          dataIndex: "id",
          cellStyle: { width: "5%", whiteSpace: "nowrap" },
        },
        {
          title: "题目",
          dataIndex: "title",
          render: (_, problem) => <ProblemLink problem={problem} />,
        },
        ...(columns || []),
      ]}
      data={problems}
      rowKey="id"
      hover={false}
      border={false}
      pagination={false}
    />
  );
}
