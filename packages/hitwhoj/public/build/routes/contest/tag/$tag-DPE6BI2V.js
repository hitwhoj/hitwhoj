import { a as f } from "/build/_shared/chunk-IC4EQTIY.js";
import { a as c } from "/build/_shared/chunk-WH23UYJB.js";
import "/build/_shared/chunk-4B3SKNWL.js";
import { a as r } from "/build/_shared/chunk-7WG4REHK.js";
import "/build/_shared/chunk-ANJHU2RD.js";
import { a as d, b as l } from "/build/_shared/chunk-ZPF2YCTJ.js";
import { c as i } from "/build/_shared/chunk-33FVQFAB.js";
import { d as n } from "/build/_shared/chunk-ASHX7EDV.js";
import "/build/_shared/chunk-KLFOMCVP.js";
import { a as y } from "/build/_shared/chunk-XIHPQXCX.js";
import { c as s } from "/build/_shared/chunk-IYNQWWEV.js";
import { c as m } from "/build/_shared/chunk-P4KF3DFI.js";
import { d as a } from "/build/_shared/chunk-G5WX4PPA.js";
var g = a(y());
var t = a(m());
var C = ({ params: o }) => ({
  title: `\u6BD4\u8D5B\u6807\u7B7E: ${o.tag} - HITwh OJ`,
});
function p() {
  let o = i(),
    u = n(() => o.value.contests),
    { tag: h } = s();
  return (0, t.jsxs)(t.Fragment, {
    children: [
      (0, t.jsxs)("h1", { children: ["\u6BD4\u8D5B\u6807\u7B7E\uFF1A", h] }),
      (0, t.jsxs)("table", {
        className: "not-prose table-compact table w-full",
        children: [
          (0, t.jsx)("thead", {
            children: (0, t.jsxs)("tr", {
              children: [
                (0, t.jsx)("th", { className: "w-16" }),
                (0, t.jsx)("th", { children: "\u6807\u9898" }),
                (0, t.jsx)("th", { children: "\u8D5B\u5236" }),
                (0, t.jsx)("th", { children: "\u5F00\u59CB\u65F6\u95F4" }),
                (0, t.jsx)("th", { children: "\u7ED3\u675F\u65F6\u95F4" }),
              ],
            }),
          }),
          (0, t.jsx)("tbody", {
            children: u.value.map((e) =>
              (0, t.jsxs)(
                "tr",
                {
                  children: [
                    (0, t.jsx)("th", {
                      className: "text-center",
                      children: e.id,
                    }),
                    (0, t.jsx)("td", {
                      children: (0, t.jsx)(f, { contest: e }),
                    }),
                    (0, t.jsx)("td", {
                      children: (0, t.jsx)(c, { system: e.system }),
                    }),
                    (0, t.jsx)("td", { children: r(e.beginTime) }),
                    (0, t.jsx)("td", { children: r(e.endTime) }),
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
export { l as CatchBoundary, d as ErrorBoundary, p as default, C as meta };
