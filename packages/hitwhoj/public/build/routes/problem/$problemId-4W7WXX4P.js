import { a as f, b as v } from "/build/_shared/chunk-ZPF2YCTJ.js";
import { c as b } from "/build/_shared/chunk-33FVQFAB.js";
import { d as n } from "/build/_shared/chunk-ASHX7EDV.js";
import { F as u, K as c, t as d } from "/build/_shared/chunk-KLFOMCVP.js";
import { a as P } from "/build/_shared/chunk-XIHPQXCX.js";
import { a as l, e as t, f as s } from "/build/_shared/chunk-IYNQWWEV.js";
import { c as p } from "/build/_shared/chunk-P4KF3DFI.js";
import { d as i } from "/build/_shared/chunk-G5WX4PPA.js";
var N = i(P());
var a = i(p());
var L = ({ data: o }) => ({
  title: `\u9898\u76EE: ${o?.problem.title} - HITwh OJ`,
  description: o?.problem.description,
});
function g() {
  let o = b(),
    e = n(() => o.value.problem),
    m = n(() => o.value.hasEditPerm);
  return (0, a.jsxs)(a.Fragment, {
    children: [
      (0, a.jsx)("h1", { children: e.value.title }),
      (e.value.tags.length > 0 || e.value.private) &&
        (0, a.jsxs)("div", {
          className: "not-prose flex flex-wrap gap-2",
          children: [
            e.value.private &&
              (0, a.jsxs)("span", {
                className: "badge badge-warning gap-1",
                children: [
                  (0, a.jsx)(d, {}),
                  (0, a.jsx)("span", { children: "\u9690\u85CF" }),
                ],
              }),
            !e.value.allowSubmit &&
              (0, a.jsxs)("span", {
                className: "badge badge-error gap-1",
                children: [
                  (0, a.jsx)(c, {}),
                  (0, a.jsx)("span", { children: "\u7981\u6B62\u63D0\u4EA4" }),
                ],
              }),
            e.value.tags.map(({ name: r }) =>
              (0, a.jsxs)(
                s,
                {
                  className: "badge gap-1",
                  to: `/problem/tag/${r}`,
                  children: [
                    (0, a.jsx)(u, {}),
                    (0, a.jsx)("span", { children: r }),
                  ],
                },
                r
              )
            ),
          ],
        }),
      (0, a.jsxs)("p", {
        className: "not-prose tabs tabs-boxed bg-base-100",
        children: [
          (0, a.jsx)(t, {
            className: "tab",
            to: "desc",
            children: "\u9898\u9762",
          }),
          (0, a.jsx)(t, {
            className: "tab",
            to: "submit",
            children: "\u63D0\u4EA4",
          }),
          m.value &&
            (0, a.jsx)(t, {
              className: "tab",
              to: "data",
              children: "\u6570\u636E",
            }),
          m.value &&
            (0, a.jsx)(t, {
              className: "tab",
              to: "edit",
              children: "\u7F16\u8F91",
            }),
          (0, a.jsx)(t, {
            className: "tab",
            to: "board",
            children: "\u699C\u5355",
          }),
          (0, a.jsx)(s, {
            className: "tab",
            to: `/record?pid=${e.value.id}`,
            children: "\u63D0\u4EA4\u8BB0\u5F55",
          }),
        ],
      }),
      (0, a.jsx)(l, {}),
    ],
  });
}
export { v as CatchBoundary, f as ErrorBoundary, g as default, L as meta };
