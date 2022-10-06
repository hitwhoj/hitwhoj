import { Form } from "@remix-run/react";

type PaginationProps = {
  /** 当前页面 URL，请求会在后面自动加上 page=x 参数 */
  action: string;
  /** 总页数 */
  totalPages: number;
  /** 当前页 */
  currentPage: number;
};

export function Pagination(props: PaginationProps) {
  if (props.totalPages <= 1) return null;
  const pageArray =
    props.totalPages >= 7
      ? Array.from(
          { length: 7 },
          (_, i) =>
            Math.max(props.currentPage - 4, 0) +
            i +
            1 +
            Math.min(0, props.totalPages - props.currentPage - 3)
        )
      : Array.from({ length: props.totalPages }, (_, i) => i + 1);

  return (
    <div className="flex justify-end items-center gap-2 flex-wrap">
      <Form method="get" action={props.action} className="space-x-2">
        <span>前往第</span>
        <input
          type="number"
          className="input input-bordered input-sm w-16"
          name="page"
          max={props.totalPages}
          min={1}
          defaultValue={props.currentPage}
        />
        <span>页</span>
        <button className="btn btn-sm">前进</button>
      </Form>
      <span>共 {props.totalPages} 页</span>
      <Form method="get" className="btn-group" action={props.action}>
        <button
          className="btn btn-sm"
          disabled={props.currentPage === 1}
          name="page"
          value={props.currentPage - 1}
        >
          «
        </button>
        {pageArray.map((page) => (
          <button
            key={page}
            className="btn btn-sm"
            disabled={props.currentPage === page}
            name="page"
            value={page}
          >
            {page}
          </button>
        ))}
        <button
          className="btn btn-sm"
          disabled={props.currentPage === props.totalPages}
          name="page"
          value={props.currentPage + 1}
        >
          »
        </button>
      </Form>
    </div>
  );
}
