import { a as i } from "/build/_shared/chunk-RE2DFUAK.js";
import { a as c } from "/build/_shared/chunk-QTGCURF2.js";
import { a as l, c as a } from "/build/_shared/chunk-7WG4REHK.js";
import "/build/_shared/chunk-ANJHU2RD.js";
import "/build/_shared/chunk-F7TWK4YF.js";
import { c as d } from "/build/_shared/chunk-33FVQFAB.js";
import { d as o } from "/build/_shared/chunk-ASHX7EDV.js";
import "/build/_shared/chunk-KLFOMCVP.js";
import { a as p } from "/build/_shared/chunk-XIHPQXCX.js";
import { f as m } from "/build/_shared/chunk-IYNQWWEV.js";
import { c as s } from "/build/_shared/chunk-P4KF3DFI.js";
import { d as r } from "/build/_shared/chunk-G5WX4PPA.js";
var f = r(p());
var t = r(s());
function n() {
  let u = d(),
    h = o(() => u.value.records);
  return (0, t.jsxs)(t.Fragment, {
    children: [
      (0, t.jsx)("h2", { children: "\u8C01\u8DD1\u7684\u6700\u5FEB" }),
      (0, t.jsxs)("table", {
        className: "not-prose table-compact table w-full",
        children: [
          (0, t.jsx)("thead", {
            children: (0, t.jsxs)("tr", {
              children: [
                (0, t.jsx)("th", { className: "w-16" }),
                (0, t.jsx)("th", { children: "\u72B6\u6001" }),
                (0, t.jsx)("th", { children: "\u7528\u6237" }),
                (0, t.jsx)("th", {
                  className: "hidden sm:table-cell",
                  children: "\u65F6\u95F4",
                }),
                (0, t.jsx)("th", {
                  className: "hidden sm:table-cell",
                  children: "\u5185\u5B58",
                }),
                (0, t.jsx)("th", {
                  className: "hidden md:table-cell",
                  children: "\u63D0\u4EA4\u65F6\u95F4",
                }),
              ],
            }),
          }),
          (0, t.jsx)("tbody", {
            children: h.value.map((e, b) =>
              (0, t.jsxs)(
                "tr",
                {
                  children: [
                    (0, t.jsx)("th", {
                      className: "text-center",
                      children: b + 1,
                    }),
                    (0, t.jsx)("td", {
                      children: (0, t.jsx)(m, {
                        to: `/record/${e.id}`,
                        children: (0, t.jsx)(i, { status: e.status }),
                      }),
                    }),
                    (0, t.jsx)("td", {
                      children: (0, t.jsx)(c, { user: e.submitter }),
                    }),
                    (0, t.jsxs)("td", {
                      className: "hidden sm:table-cell",
                      children: [a(e.time), "ms"],
                    }),
                    (0, t.jsxs)("td", {
                      className: "hidden sm:table-cell",
                      children: [a(e.memory), "bytes"],
                    }),
                    (0, t.jsx)("td", {
                      className: "hidden md:table-cell",
                      children: l(e.submittedAt),
                    }),
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
export { n as default };
