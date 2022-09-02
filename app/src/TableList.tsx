import type { TableColumnProps } from "@arco-design/web-react";
import { Table } from "@arco-design/web-react";
import type { RowCallbackProps } from "@arco-design/web-react/es/Table/interface";

type Id = { id: string | number };

type TableListColumnProps<T extends Id> = {
  title: string;
  render: (row: T, index: number) => React.ReactNode;
  minimize?: boolean;
  align?: TableColumnProps<T>["align"];
  sorter?: (a: T, b: T) => number;
};

type TableListProps<T extends Id> = {
  data: T[];
  columns?: TableListColumnProps<T>[];
  onRow?: (row: T, index: number) => RowCallbackProps;
};

/**
 * Arco-Design 的 Table 的包装，添加了默认的样式
 *
 * 就是一张表格，但是你必须要保证有 id 字段
 */
export function TableList<T extends Id>(props: TableListProps<T>) {
  return (
    <Table
      data={props.data}
      columns={props.columns?.map(
        (column): TableColumnProps<T> => ({
          title: column.title,
          render: (_, row, index) => column.render(row, index),
          ...(column.align && { align: column.align }),
          cellStyle: column.minimize
            ? { whiteSpace: "nowrap", width: "5%" }
            : { whiteSpace: "nowrap" },
          ...(column.sorter && { sorter: column.sorter }),
        })
      )}
      onRow={props.onRow}
      rowKey="id"
      hover={false}
      border={false}
      pagination={false}
    />
  );
}
