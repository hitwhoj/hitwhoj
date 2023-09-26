import { a as d } from "/build/_shared/chunk-6WF7NKYL.js";
import { a as l, b as i } from "/build/_shared/chunk-ZPF2YCTJ.js";
import { c as n } from "/build/_shared/chunk-33FVQFAB.js";
import { d as s } from "/build/_shared/chunk-ASHX7EDV.js";
import "/build/_shared/chunk-KLFOMCVP.js";
import { a as f } from "/build/_shared/chunk-XIHPQXCX.js";
import { c as a } from "/build/_shared/chunk-IYNQWWEV.js";
import { c as m } from "/build/_shared/chunk-P4KF3DFI.js";
import { d as r } from "/build/_shared/chunk-G5WX4PPA.js";
var h = r(f());
var t = r(m());
var b = ({ params: o }) => ({
  title: `\u9898\u76EE\u6807\u7B7E: ${o.tag} - HITwh OJ`,
});
function c() {
  let o = n(),
    p = s(() => o.value.problems),
    u = a();
  return (0, t.jsxs)(t.Fragment, {
    children: [
      (0, t.jsxs)("h1", {
        children: ["\u9898\u76EE\u6807\u7B7E\uFF1A", u.tag],
      }),
      (0, t.jsxs)("table", {
        className: "not-prose table-compact table w-full",
        children: [
          (0, t.jsx)("thead", {
            children: (0, t.jsxs)("tr", {
              children: [
                (0, t.jsx)("th", { className: "w-16" }),
                (0, t.jsx)("th", { children: "\u9898\u76EE" }),
                (0, t.jsx)("th", { children: "\u63D0\u4EA4" }),
              ],
            }),
          }),
          (0, t.jsx)("tbody", {
            children: p.value.map((e) =>
              (0, t.jsxs)(
                "tr",
                {
                  children: [
                    (0, t.jsx)("th", {
                      className: "text-center",
                      children: e.id,
                    }),
                    (0, t.jsx)("td", {
                      children: (0, t.jsx)(d, { problem: e }),
                    }),
                    (0, t.jsx)("td", { children: e._count.relatedRecords }),
                  ],
                },
                e.id
              )
            ),
          }),
        ],
      }),
    ],
  });
}
export { i as CatchBoundary, l as ErrorBoundary, c as default, b as meta };
