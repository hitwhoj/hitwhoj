import { useState } from "react";

/**
 * 分页组件
 * @param totalPages 总页数
 * @param currentPage 当前页
 * @param onPageChange 页码改变时的回调
 * @returns
 */
export function Pagination({
  totalPages,
  currentPage,
  onPageChange,
}: {
  totalPages: number;
  currentPage: number;
  onPageChange: (page: number) => void;
}) {
  const [pageInput, setPageInput] = useState(currentPage.toString());
  if (totalPages <= 1) return null;
  const pageArray =
    totalPages >= 7
      ? Array.from(
          { length: 7 },
          (_, i) =>
            Math.max(currentPage - 4, 0) +
            i +
            1 +
            Math.min(0, totalPages - currentPage - 3)
        )
      : Array.from({ length: totalPages }, (_, i) => i + 1);

  return (
    <div className="space-x-2 float-right">
      <span className="space-x-2">
        <span>前往第</span>
        <input
          type="text"
          className="input input-bordered w-14"
          value={pageInput}
          onChange={(e) => setPageInput(e.target.value)}
          onKeyDown={(e) => {
            e.key === "Enter" && onPageChange(Number(pageInput));
          }}
        />
        <span>页</span>
        <button
          className="btn btn-primary"
          onClick={() => onPageChange(Number(pageInput))}
        >
          前进
        </button>
      </span>
      <span> 共 {totalPages} 页 </span>
      <button
        className={`btn btn-primary ${currentPage === 1 ? "btn-disabled" : ""}`}
        onClick={() => onPageChange(currentPage - 1)}
      >
        {" "}
        &lt;{" "}
      </button>
      {pageArray.map((page) => (
        <button
          key={page}
          className={`btn btn-primary ${
            currentPage === page ? "btn-disabled" : ""
          }`}
          onClick={() => onPageChange(page)}
        >
          {" "}
          {page}{" "}
        </button>
      ))}
      <button
        className={`btn btn-primary ${
          currentPage === totalPages ? "btn-disabled" : ""
        }`}
        onClick={() => onPageChange(currentPage + 1)}
      >
        {" "}
        &gt;{" "}
      </button>
    </div>
  );
}
