import { a as u } from "/build/_shared/chunk-TWYVBWDW.js";
import { a as c } from "/build/_shared/chunk-KUDQOE27.js";
import "/build/_shared/chunk-NPZ34MRD.js";
import { a as p } from "/build/_shared/chunk-6WF7NKYL.js";
import "/build/_shared/chunk-5CMXDJBZ.js";
import { a as n, b as i } from "/build/_shared/chunk-ZPF2YCTJ.js";
import { c as m } from "/build/_shared/chunk-33FVQFAB.js";
import { d as t } from "/build/_shared/chunk-ASHX7EDV.js";
import "/build/_shared/chunk-KLFOMCVP.js";
import { a as g } from "/build/_shared/chunk-XIHPQXCX.js";
import "/build/_shared/chunk-IYNQWWEV.js";
import { c as l } from "/build/_shared/chunk-P4KF3DFI.js";
import { d as s } from "/build/_shared/chunk-G5WX4PPA.js";
var h = s(g()),
  e = s(l()),
  w = 15;
function d() {
  let r = m(),
    o = t(() => r.value.problemSet),
    f = t(() => r.value.totalProblems),
    b = t(() => r.value.currentPage),
    P = t(() => Math.ceil(f.value / w));
  return (0, e.jsxs)(e.Fragment, {
    children: [
      (0, e.jsx)(c, { children: o.value.description }),
      (0, e.jsxs)("table", {
        className: "not-prose table-compact table w-full",
        children: [
          (0, e.jsx)("thead", {
            children: (0, e.jsxs)("tr", {
              children: [
                (0, e.jsx)("th", { className: "w-16" }),
                (0, e.jsx)("th", { children: "\u9898\u76EE" }),
              ],
            }),
          }),
          (0, e.jsx)("tbody", {
            children: o.value.problems.map((a) =>
              (0, e.jsxs)(
                "tr",
                {
                  children: [
                    (0, e.jsx)("td", {
                      className: "text-center",
                      children: a.rank,
                    }),
                    (0, e.jsx)("td", {
                      children: (0, e.jsx)(p, { problem: a.problem }),
                    }),
                  ],
                },
                a.problem.id
              )
            ),
          }),
        ],
      }),
      (0, e.jsx)(u, {
        action: `/problemset/${o.value.id}/problem`,
        totalPages: P.value,
        currentPage: b.value,
      }),
    ],
  });
}
export { i as CatchBoundary, n as ErrorBoundary, d as default };
