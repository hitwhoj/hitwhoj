import { a as u } from "/build/_shared/chunk-TWYVBWDW.js";
import { a as p } from "/build/_shared/chunk-KUDQOE27.js";
import "/build/_shared/chunk-NPZ34MRD.js";
import { a as c } from "/build/_shared/chunk-6WF7NKYL.js";
import "/build/_shared/chunk-5CMXDJBZ.js";
import { a as s, b as i } from "/build/_shared/chunk-ZPF2YCTJ.js";
import { c as l } from "/build/_shared/chunk-33FVQFAB.js";
import { d as o } from "/build/_shared/chunk-ASHX7EDV.js";
import "/build/_shared/chunk-KLFOMCVP.js";
import { a as S } from "/build/_shared/chunk-XIHPQXCX.js";
import "/build/_shared/chunk-IYNQWWEV.js";
import { c as n } from "/build/_shared/chunk-P4KF3DFI.js";
import { d as m } from "/build/_shared/chunk-G5WX4PPA.js";
var g = m(S());
var e = m(n()),
  h = 15;
var w = ({ data: t }) => ({
  title: `\u9898\u5355: ${t?.problemSet.title} - HITwh OJ`,
  description: t?.problemSet.description,
});
function d() {
  let t = l(),
    r = o(() => t.value.problemSet),
    f = o(() => t.value.totalProblems),
    b = o(() => t.value.currentPage),
    P = o(() => Math.ceil(f.value / h));
  return (0, e.jsxs)(e.Fragment, {
    children: [
      (0, e.jsx)(p, { children: r.value.description }),
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
            children: r.value.problems.map((a) =>
              (0, e.jsxs)(
                "tr",
                {
                  children: [
                    (0, e.jsx)("td", {
                      className: "text-center",
                      children: a.rank,
                    }),
                    (0, e.jsx)("td", {
                      children: (0, e.jsx)(c, { problem: a.problem }),
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
        action: `/problemset/${r.value.id}/problem`,
        totalPages: P.value,
        currentPage: b.value,
      }),
    ],
  });
}
export { i as CatchBoundary, s as ErrorBoundary, d as default, w as meta };
