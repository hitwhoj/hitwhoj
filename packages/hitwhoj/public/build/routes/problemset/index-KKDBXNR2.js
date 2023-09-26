import { a as d } from "/build/_shared/chunk-VA6CUZ65.js";
import { a as p } from "/build/_shared/chunk-TWYVBWDW.js";
import { a as u, b as c } from "/build/_shared/chunk-ZPF2YCTJ.js";
import { c as i } from "/build/_shared/chunk-33FVQFAB.js";
import { d as e } from "/build/_shared/chunk-ASHX7EDV.js";
import { C as m } from "/build/_shared/chunk-KLFOMCVP.js";
import { a as v } from "/build/_shared/chunk-XIHPQXCX.js";
import { f as n } from "/build/_shared/chunk-IYNQWWEV.js";
import { c as l } from "/build/_shared/chunk-P4KF3DFI.js";
import { d as o } from "/build/_shared/chunk-G5WX4PPA.js";
var S = o(v());
var t = o(l()),
  f = 15;
var y = () => ({ title: "\u9898\u5355\u5217\u8868 - HITwh OJ" });
function P() {
  let a = i(),
    h = e(() => a.value.problemSets),
    b = e(() => a.value.hasEditPerm),
    E = e(() => a.value.totalProblemSets),
    s = e(() => a.value.currentPage),
    g = e(() => Math.ceil(E.value / f));
  return (0, t.jsxs)(t.Fragment, {
    children: [
      (0, t.jsxs)("h1", {
        className: "flex items-center justify-between",
        children: [
          (0, t.jsx)("span", { children: "\u9898\u5355\u5217\u8868" }),
          b.value &&
            (0, t.jsxs)(n, {
              className: "btn btn-primary gap-2",
              to: "new",
              children: [
                (0, t.jsx)(m, { className: "h-4 w-4" }),
                (0, t.jsx)("span", { children: "\u65B0\u5EFA\u9898\u5355" }),
              ],
            }),
        ],
      }),
      (0, t.jsxs)("table", {
        className: "not-prose table-compact table w-full",
        children: [
          (0, t.jsx)("thead", {
            children: (0, t.jsxs)("tr", {
              children: [
                (0, t.jsx)("th", { className: "w-16" }),
                (0, t.jsx)("th", { children: "\u9898\u5355" }),
                (0, t.jsx)("th", { children: "\u9898\u76EE\u6570\u91CF" }),
              ],
            }),
          }),
          (0, t.jsx)("tbody", {
            children: h.value.map((r, w) =>
              (0, t.jsxs)(
                "tr",
                {
                  children: [
                    (0, t.jsx)("th", {
                      className: "text-center",
                      children: w + 1 + (Number(s) - 1) * f,
                    }),
                    (0, t.jsx)("td", {
                      children: (0, t.jsx)(d, { problemset: r }),
                    }),
                    (0, t.jsx)("td", { children: r._count.problems }),
                  ],
                },
                r.id
              )
            ),
          }),
        ],
      }),
      (0, t.jsx)(p, {
        action: "/problemset",
        totalPages: g.value,
        currentPage: s.value,
      }),
    ],
  });
}
export { c as CatchBoundary, u as ErrorBoundary, P as default, y as meta };
