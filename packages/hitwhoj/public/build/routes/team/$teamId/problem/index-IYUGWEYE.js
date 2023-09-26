import { a as d } from "/build/_shared/chunk-TWYVBWDW.js";
import { a as u } from "/build/_shared/chunk-6WF7NKYL.js";
import { a as c, b as p } from "/build/_shared/chunk-ZPF2YCTJ.js";
import { c as i } from "/build/_shared/chunk-33FVQFAB.js";
import { d as t } from "/build/_shared/chunk-ASHX7EDV.js";
import { C as l } from "/build/_shared/chunk-KLFOMCVP.js";
import { a as v } from "/build/_shared/chunk-XIHPQXCX.js";
import { f as n } from "/build/_shared/chunk-IYNQWWEV.js";
import { c as m } from "/build/_shared/chunk-P4KF3DFI.js";
import { d as o } from "/build/_shared/chunk-G5WX4PPA.js";
var E = o(v()),
  e = o(m()),
  f = 15;
var I = () => ({ title: "\u56E2\u961F\u9898\u76EE - HITwh OJ" });
function P() {
  let a = i(),
    h = t(() => a.value.problems),
    b = t(() => a.value.hasCreatePerm),
    w = t(() => a.value.totalProblems),
    s = t(() => a.value.currentPage),
    g = t(() => Math.ceil(w.value / f));
  return (0, e.jsxs)(e.Fragment, {
    children: [
      (0, e.jsxs)("h2", {
        className: "flex items-center justify-between",
        children: [
          (0, e.jsx)("span", { children: "\u9898\u76EE\u5217\u8868" }),
          b.value &&
            (0, e.jsxs)(n, {
              to: "new",
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
            children: h.value.map((r, y) =>
              (0, e.jsxs)(
                "tr",
                {
                  children: [
                    (0, e.jsx)("th", {
                      className: "text-center",
                      children: y + 1 + (Number(s) - 1) * f,
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
      (0, e.jsx)(d, {
        action: "/problem",
        totalPages: g.value,
        currentPage: s.value,
      }),
    ],
  });
}
export { p as CatchBoundary, c as ErrorBoundary, P as default, I as meta };
