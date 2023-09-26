import { j as m } from "/build/_shared/chunk-IYNQWWEV.js";
import { c as l } from "/build/_shared/chunk-P4KF3DFI.js";
import { d as u } from "/build/_shared/chunk-G5WX4PPA.js";
var t = u(l());
function s(a) {
  if (a.totalPages <= 1) return null;
  let g =
    a.totalPages >= 7
      ? Array.from(
          { length: 7 },
          (e, n) =>
            Math.max(a.currentPage - 4, 0) +
            n +
            1 +
            Math.min(0, a.totalPages - a.currentPage - 3)
        )
      : Array.from({ length: a.totalPages }, (e, n) => n + 1);
  return (0, t.jsxs)("div", {
    className: "flex flex-wrap items-center justify-end gap-2",
    children: [
      (0, t.jsxs)(m, {
        method: "get",
        action: a.action,
        className: "space-x-2",
        children: [
          (0, t.jsx)("span", { children: "\u524D\u5F80\u7B2C" }),
          (0, t.jsx)("input", {
            type: "number",
            className: "input input-bordered input-sm w-16",
            name: "page",
            max: a.totalPages,
            min: 1,
            defaultValue: a.currentPage,
          }),
          (0, t.jsx)("span", { children: "\u9875" }),
          (0, t.jsx)("button", {
            className: "btn btn-sm",
            children: "\u524D\u8FDB",
          }),
        ],
      }),
      (0, t.jsxs)("span", { children: ["\u5171 ", a.totalPages, " \u9875"] }),
      (0, t.jsxs)(m, {
        method: "get",
        className: "btn-group",
        action: a.action,
        children: [
          (0, t.jsx)("button", {
            className: "btn btn-sm",
            disabled: a.currentPage === 1,
            name: "page",
            value: a.currentPage - 1,
            children: "\xAB",
          }),
          g.map((e) =>
            (0, t.jsx)(
              "button",
              {
                className: "btn btn-sm",
                disabled: a.currentPage === e,
                name: "page",
                value: e,
                children: e,
              },
              e
            )
          ),
          (0, t.jsx)("button", {
            className: "btn btn-sm",
            disabled: a.currentPage === a.totalPages,
            name: "page",
            value: a.currentPage + 1,
            children: "\xBB",
          }),
        ],
      }),
    ],
  });
}
export { s as a };
