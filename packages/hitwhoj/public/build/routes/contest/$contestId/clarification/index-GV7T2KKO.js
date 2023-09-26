import { a as u } from "/build/_shared/chunk-QTGCURF2.js";
import "/build/_shared/chunk-F7TWK4YF.js";
import { c as m } from "/build/_shared/chunk-33FVQFAB.js";
import { d as o } from "/build/_shared/chunk-ASHX7EDV.js";
import { C as l, d as i } from "/build/_shared/chunk-KLFOMCVP.js";
import { a as f } from "/build/_shared/chunk-XIHPQXCX.js";
import { f as n } from "/build/_shared/chunk-IYNQWWEV.js";
import { c as d } from "/build/_shared/chunk-P4KF3DFI.js";
import { d as r } from "/build/_shared/chunk-G5WX4PPA.js";
var h = r(f());
var t = r(d());
function c() {
  let s = m(),
    p = o(() => s.value.canSubmit),
    a = o(() => s.value.clarifications);
  return (0, t.jsxs)(t.Fragment, {
    children: [
      (0, t.jsxs)("table", {
        className: "not-prose table w-full",
        children: [
          (0, t.jsx)("thead", {
            children: (0, t.jsxs)("tr", {
              children: [
                (0, t.jsx)("th", { children: "\u7528\u6237" }),
                (0, t.jsx)("th", { children: "\u9898\u53F7" }),
                (0, t.jsx)("th", { children: "\u5185\u5BB9" }),
                (0, t.jsx)("th", { children: "\u72B6\u6001" }),
                (0, t.jsx)("th", { children: "\u56DE\u590D" }),
                (0, t.jsx)("th", { children: "\u64CD\u4F5C" }),
              ],
            }),
          }),
          (0, t.jsx)("tbody", {
            children:
              a.value.length === 0
                ? (0, t.jsx)("tr", {
                    children: (0, t.jsx)("td", {
                      colSpan: 5,
                      children: "\u6682\u65E0",
                    }),
                  })
                : a.value.map((e) =>
                    (0, t.jsxs)(
                      "tr",
                      {
                        children: [
                          (0, t.jsx)("td", {
                            children: (0, t.jsx)(u, { user: e.user }),
                          }),
                          (0, t.jsx)("td", {
                            children: String.fromCharCode(e.rank + 64),
                          }),
                          (0, t.jsx)("td", {
                            children:
                              e.content.length > 20
                                ? `${e.content.slice(0, 20)}...`
                                : e.content,
                          }),
                          (0, t.jsx)("td", {
                            children: e.resolved
                              ? "\u5DF2\u89E3\u51B3"
                              : "\u672A\u89E3\u51B3",
                          }),
                          (0, t.jsx)("td", { children: e.replies.length }),
                          (0, t.jsx)("td", {
                            children: (0, t.jsxs)(n, {
                              className: "link inline-flex items-center gap-2",
                              to: e.id.toString(),
                              children: [
                                (0, t.jsx)("span", {
                                  children: "\u67E5\u770B\u8BE6\u60C5",
                                }),
                                (0, t.jsx)(i, {}),
                              ],
                            }),
                          }),
                        ],
                      },
                      e.id
                    )
                  ),
          }),
        ],
      }),
      p.value &&
        (0, t.jsx)("div", {
          className: "flex justify-end",
          children: (0, t.jsxs)(n, {
            className: "btn btn-primary gap-2",
            to: "submit",
            children: [
              (0, t.jsx)(l, {}),
              (0, t.jsx)("span", { children: "\u63D0\u4EA4" }),
            ],
          }),
        }),
    ],
  });
}
export { c as default };
