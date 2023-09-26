import { a as u } from "/build/_shared/chunk-VA6CUZ65.js";
import { a as i, b as l } from "/build/_shared/chunk-ZPF2YCTJ.js";
import { c as s } from "/build/_shared/chunk-33FVQFAB.js";
import { d as n } from "/build/_shared/chunk-ASHX7EDV.js";
import "/build/_shared/chunk-KLFOMCVP.js";
import { a as f } from "/build/_shared/chunk-XIHPQXCX.js";
import { c as a } from "/build/_shared/chunk-IYNQWWEV.js";
import { c as m } from "/build/_shared/chunk-P4KF3DFI.js";
import { d as r } from "/build/_shared/chunk-G5WX4PPA.js";
var h = r(f());
var t = r(m());
var b = ({ params: o }) => ({
  title: `\u9898\u5355\u6807\u7B7E: ${o.tag} - HITwh OJ`,
});
function d() {
  let { tag: o } = a(),
    p = s(),
    c = n(() => p.value.problemSets);
  return (0, t.jsxs)(t.Fragment, {
    children: [
      (0, t.jsxs)("h1", { children: ["\u9898\u5355\u6807\u7B7E\uFF1A", o] }),
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
            children: c.value.map((e) =>
              (0, t.jsxs)(
                "tr",
                {
                  children: [
                    (0, t.jsx)("th", {
                      className: "text-center",
                      children: e.id,
                    }),
                    (0, t.jsx)("td", {
                      children: (0, t.jsx)(u, { problemset: e }),
                    }),
                    (0, t.jsx)("td", { children: e._count.problems }),
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
export { l as CatchBoundary, i as ErrorBoundary, d as default, b as meta };
