import { a as c } from "/build/_shared/chunk-IC4EQTIY.js";
import { a as f } from "/build/_shared/chunk-WH23UYJB.js";
import "/build/_shared/chunk-4B3SKNWL.js";
import { a } from "/build/_shared/chunk-7WG4REHK.js";
import "/build/_shared/chunk-ANJHU2RD.js";
import { a as l, b as p } from "/build/_shared/chunk-ZPF2YCTJ.js";
import { c as d } from "/build/_shared/chunk-33FVQFAB.js";
import { d as o } from "/build/_shared/chunk-ASHX7EDV.js";
import { C as n } from "/build/_shared/chunk-KLFOMCVP.js";
import { a as E } from "/build/_shared/chunk-XIHPQXCX.js";
import { f as m } from "/build/_shared/chunk-IYNQWWEV.js";
import { c as i } from "/build/_shared/chunk-P4KF3DFI.js";
import { d as r } from "/build/_shared/chunk-G5WX4PPA.js";
var w = r(E());
var t = r(i());
var C = () => ({ title: "\u56E2\u961F\u6BD4\u8D5B\u5217\u8868 - HITwh OJ" });
function u() {
  let s = d(),
    h = o(() => s.value.contests),
    y = o(() => s.value.hasCreatePerm);
  return (0, t.jsxs)(t.Fragment, {
    children: [
      (0, t.jsxs)("h2", {
        className: "flex items-center justify-between",
        children: [
          (0, t.jsx)("span", { children: "\u56E2\u961F\u6BD4\u8D5B" }),
          y.value &&
            (0, t.jsxs)(m, {
              className: "btn btn-primary gap-2",
              to: "new",
              children: [
                (0, t.jsx)(n, {}),
                (0, t.jsx)("span", { children: "\u521B\u5EFA\u6BD4\u8D5B" }),
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
                (0, t.jsx)("th", { children: "\u6807\u9898" }),
                (0, t.jsx)("th", { children: "\u8D5B\u5236" }),
                (0, t.jsx)("th", { children: "\u5F00\u59CB\u65F6\u95F4" }),
                (0, t.jsx)("th", { children: "\u7ED3\u675F\u65F6\u95F4" }),
              ],
            }),
          }),
          (0, t.jsx)("tbody", {
            children: h.value.map((e) =>
              (0, t.jsxs)(
                "tr",
                {
                  children: [
                    (0, t.jsx)("th", {
                      className: "text-center",
                      children: e.id,
                    }),
                    (0, t.jsx)("td", {
                      children: (0, t.jsx)(c, { contest: e }),
                    }),
                    (0, t.jsx)("td", {
                      children: (0, t.jsx)(f, { system: e.system }),
                    }),
                    (0, t.jsx)("td", { children: a(e.beginTime) }),
                    (0, t.jsx)("td", { children: a(e.endTime) }),
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
export { p as CatchBoundary, l as ErrorBoundary, u as default, C as meta };
