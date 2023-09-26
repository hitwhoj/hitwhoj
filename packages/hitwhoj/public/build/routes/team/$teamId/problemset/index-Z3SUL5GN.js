import { a as d } from "/build/_shared/chunk-J7GTACQU.js";
import { a as u } from "/build/_shared/chunk-TWYVBWDW.js";
import { a as c, b as p } from "/build/_shared/chunk-ZPF2YCTJ.js";
import { c as l } from "/build/_shared/chunk-33FVQFAB.js";
import { d as e } from "/build/_shared/chunk-ASHX7EDV.js";
import { C as i } from "/build/_shared/chunk-KLFOMCVP.js";
import { a as v } from "/build/_shared/chunk-XIHPQXCX.js";
import { f as m } from "/build/_shared/chunk-IYNQWWEV.js";
import { c as n } from "/build/_shared/chunk-P4KF3DFI.js";
import { d as o } from "/build/_shared/chunk-G5WX4PPA.js";
var S = o(v()),
  t = o(n()),
  f = 15;
var y = () => ({ title: "\u56E2\u961F\u9898\u5355 - HITwh OJ" });
function P() {
  let a = l(),
    h = e(() => a.value.problemSets),
    b = e(() => a.value.hasEditPerm),
    E = e(() => a.value.totalProblemSets),
    s = e(() => a.value.currentPage),
    w = e(() => Math.ceil(E.value / f));
  return (0, t.jsxs)(t.Fragment, {
    children: [
      (0, t.jsxs)("h2", {
        className: "flex items-center justify-between",
        children: [
          (0, t.jsx)("span", { children: "\u9898\u5355\u5217\u8868" }),
          b.value &&
            (0, t.jsxs)(m, {
              className: "btn btn-primary gap-2",
              to: "new",
              children: [
                (0, t.jsx)(i, { className: "h-4 w-4" }),
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
            children: h.value.map((r, g) =>
              (0, t.jsxs)(
                "tr",
                {
                  children: [
                    (0, t.jsx)("th", {
                      className: "text-center",
                      children: g + 1 + (Number(s) - 1) * f,
                    }),
                    (0, t.jsx)("td", {
                      children: (0, t.jsx)(d, {
                        problemset: r,
                        teamId: a.value.teamId,
                      }),
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
      (0, t.jsx)(u, {
        action: "/problemset",
        totalPages: w.value,
        currentPage: s.value,
      }),
    ],
  });
}
export { p as CatchBoundary, c as ErrorBoundary, P as default, y as meta };
