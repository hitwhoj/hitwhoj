import { a as p } from "/build/_shared/chunk-TWYVBWDW.js";
import { a as u } from "/build/_shared/chunk-6WF7NKYL.js";
import { a as i, b as c } from "/build/_shared/chunk-ZPF2YCTJ.js";
import { c as m } from "/build/_shared/chunk-33FVQFAB.js";
import { d as t } from "/build/_shared/chunk-ASHX7EDV.js";
import { C as l } from "/build/_shared/chunk-KLFOMCVP.js";
import { a as w } from "/build/_shared/chunk-XIHPQXCX.js";
import { f as s } from "/build/_shared/chunk-IYNQWWEV.js";
import { c as n } from "/build/_shared/chunk-P4KF3DFI.js";
import { d as o } from "/build/_shared/chunk-G5WX4PPA.js";
var v = o(w());
var e = o(n()),
  y = 15;
var E = () => ({ title: "\u9898\u76EE\u5217\u8868 - HITwh OJ" });
function d() {
  let a = m(),
    f = t(() => a.value.problems),
    P = t(() => a.value.hasCreatePerm),
    h = t(() => a.value.totalProblems),
    b = t(() => a.value.currentPage),
    g = t(() => Math.ceil(h.value / y));
  return (0, e.jsxs)(e.Fragment, {
    children: [
      (0, e.jsxs)("h1", {
        className: "flex items-center justify-between",
        children: [
          (0, e.jsx)("span", { children: "\u9898\u76EE\u5217\u8868" }),
          P.value &&
            (0, e.jsxs)(s, {
              to: "/problem/new",
              className: "btn btn-primary gap-2",
              children: [
                (0, e.jsx)(l, { className: "h-4 w-4" }),
                (0, e.jsx)("span", { children: "\u65B0\u5EFA\u9898\u76EE" }),
              ],
            }),
        ],
      }),
      (0, e.jsxs)("table", {
        className: "not-prose table-compact table w-full",
        children: [
          (0, e.jsx)("thead", {
            children: (0, e.jsxs)("tr", {
              children: [
                (0, e.jsx)("th", { className: "w-16" }),
                (0, e.jsx)("th", { children: "\u9898\u76EE" }),
                (0, e.jsx)("th", { children: "\u63D0\u4EA4" }),
              ],
            }),
          }),
          (0, e.jsx)("tbody", {
            children: f.value.map((r) =>
              (0, e.jsxs)(
                "tr",
                {
                  children: [
                    (0, e.jsx)("th", {
                      className: "text-center",
                      children: r.id,
                    }),
                    (0, e.jsx)("td", {
                      children: (0, e.jsx)(u, { problem: r }),
                    }),
                    (0, e.jsx)("td", { children: r._count.relatedRecords }),
                  ],
                },
                r.id
              )
            ),
          }),
        ],
      }),
      (0, e.jsx)(p, {
        action: "/problem",
        totalPages: g.value,
        currentPage: b.value,
      }),
    ],
  });
}
export { c as CatchBoundary, i as ErrorBoundary, d as default, E as meta };
