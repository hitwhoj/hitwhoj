import { a as f, b as c } from "/build/_shared/chunk-ZPF2YCTJ.js";
import { c as u } from "/build/_shared/chunk-33FVQFAB.js";
import { d as s } from "/build/_shared/chunk-ASHX7EDV.js";
import { F as d, t as l } from "/build/_shared/chunk-KLFOMCVP.js";
import { a as E } from "/build/_shared/chunk-XIHPQXCX.js";
import { a as n, e as i, f as m } from "/build/_shared/chunk-IYNQWWEV.js";
import { c as p } from "/build/_shared/chunk-P4KF3DFI.js";
import { d as r } from "/build/_shared/chunk-G5WX4PPA.js";
var P = r(E());
var e = r(p());
var g = ({ data: t }) => ({
  title: `\u9898\u5355: ${t?.problemSet.title} - HITwh OJ`,
  description: t?.problemSet.description,
});
function b() {
  let t = u(),
    a = s(() => t.value.problemSet),
    v = s(() => t.value.hasEditPerm);
  return (0, e.jsxs)(e.Fragment, {
    children: [
      (0, e.jsx)("h1", { children: a.value.title }),
      (a.value.tags.length > 0 || a.value.private) &&
        (0, e.jsxs)("div", {
          className: "not-prose flex flex-wrap gap-2",
          children: [
            a.value.private &&
              (0, e.jsxs)("span", {
                className: "badge badge-warning gap-1",
                children: [
                  (0, e.jsx)(l, {}),
                  (0, e.jsx)("span", { children: "\u9690\u85CF" }),
                ],
              }),
            a.value.tags.map(({ name: o }) =>
              (0, e.jsxs)(
                m,
                {
                  className: "badge gap-1",
                  to: `/problemset/tag/${o}`,
                  children: [
                    (0, e.jsx)(d, {}),
                    (0, e.jsx)("span", { children: o }),
                  ],
                },
                o
              )
            ),
          ],
        }),
      (0, e.jsxs)("p", {
        className: "not-prose tabs tabs-boxed bg-base-100",
        children: [
          (0, e.jsx)(i, {
            className: "tab",
            to: "problem",
            children: "\u8BE6\u60C5",
          }),
          v.value &&
            (0, e.jsx)(i, {
              className: "tab",
              to: "edit",
              children: "\u7F16\u8F91",
            }),
        ],
      }),
      (0, e.jsx)(n, {}),
    ],
  });
}
export { c as CatchBoundary, f as ErrorBoundary, b as default, g as meta };
