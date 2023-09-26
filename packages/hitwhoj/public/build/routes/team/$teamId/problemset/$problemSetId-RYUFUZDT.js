import { a as f, b as c } from "/build/_shared/chunk-ZPF2YCTJ.js";
import { c as u } from "/build/_shared/chunk-33FVQFAB.js";
import { d as s } from "/build/_shared/chunk-ASHX7EDV.js";
import { F as d, t as l } from "/build/_shared/chunk-KLFOMCVP.js";
import { a as E } from "/build/_shared/chunk-XIHPQXCX.js";
import { a as m, e as o, f as n } from "/build/_shared/chunk-IYNQWWEV.js";
import { c as p } from "/build/_shared/chunk-P4KF3DFI.js";
import { d as r } from "/build/_shared/chunk-G5WX4PPA.js";
var g = r(E()),
  e = r(p());
function b() {
  let i = u(),
    t = s(() => i.value.problemSet),
    v = s(() => i.value.hasEditPerm);
  return (0, e.jsxs)(e.Fragment, {
    children: [
      (0, e.jsx)("h2", { children: t.value.title }),
      (t.value.tags.length > 0 || t.value.private) &&
        (0, e.jsxs)("div", {
          className: "not-prose flex flex-wrap gap-2",
          children: [
            t.value.private &&
              (0, e.jsxs)("span", {
                className: "badge badge-warning gap-1",
                children: [
                  (0, e.jsx)(l, {}),
                  (0, e.jsx)("span", { children: "\u9690\u85CF" }),
                ],
              }),
            t.value.tags.map(({ name: a }) =>
              (0, e.jsxs)(
                n,
                {
                  className: "badge gap-1",
                  to: `team/$teamId/problemset/tag/${a}`,
                  children: [
                    (0, e.jsx)(d, {}),
                    (0, e.jsx)("span", { children: a }),
                  ],
                },
                a
              )
            ),
          ],
        }),
      (0, e.jsxs)("p", {
        className: "not-prose tabs tabs-boxed bg-base-100",
        children: [
          (0, e.jsx)(o, {
            className: "tab",
            to: "problem",
            children: "\u8BE6\u60C5",
          }),
          v.value &&
            (0, e.jsx)(o, {
              className: "tab",
              to: "edit",
              children: "\u7F16\u8F91",
            }),
        ],
      }),
      (0, e.jsx)(m, {}),
    ],
  });
}
export { c as CatchBoundary, f as ErrorBoundary, b as default };
