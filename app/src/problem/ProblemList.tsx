import type { TableColumnProps } from "@arco-design/web-react";
import { Table } from "@arco-design/web-react";
import type { Problem } from "@prisma/client";
import { ProblemLink } from "./ProblemLink";

type Props<T> = {
  problems: T[];
  columns?: TableColumnProps<T>[];
  columnsBefore?: TableColumnProps<T>[];
};

export function ProblemList<
  T extends Pick<Problem, "id" | "title" | "private">
>(props: Props<T>) {
  return (
    <Table
      columns={[
        ...(props.columnsBefore || []),
        {
          title: "题目",
          dataIndex: "title",
          render: (_, problem) => <ProblemLink problem={problem} />,
        },
        ...(props.columns || []),
      ]}
      data={props.problems}
      rowKey="id"
      hover={false}
      border={false}
      pagination={false}
    />
  );
}
