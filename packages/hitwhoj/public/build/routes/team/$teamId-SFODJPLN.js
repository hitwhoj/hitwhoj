import { a as u, b as d } from "/build/_shared/chunk-ZPF2YCTJ.js";
import { c as l } from "/build/_shared/chunk-33FVQFAB.js";
import { d as o } from "/build/_shared/chunk-ASHX7EDV.js";
import { I as n } from "/build/_shared/chunk-KLFOMCVP.js";
import { a as N } from "/build/_shared/chunk-XIHPQXCX.js";
import { a as m, e as a } from "/build/_shared/chunk-IYNQWWEV.js";
import { c as i } from "/build/_shared/chunk-P4KF3DFI.js";
import { d as s } from "/build/_shared/chunk-G5WX4PPA.js";
var v = s(N());
var e = s(i());
function p() {
  let r = l(),
    c = o(() => r.value.team),
    f = o(() => r.value.hasEditPerm),
    t = o(() => r.value.hasViewPerm);
  return (0, e.jsxs)(e.Fragment, {
    children: [
      (0, e.jsxs)("h1", {
        className: "flex items-center gap-4",
        children: [
          (0, e.jsx)(n, { className: "shrink-0" }),
          (0, e.jsx)("span", { children: c.value.name }),
        ],
      }),
      (0, e.jsxs)("div", {
        className: "not-prose tabs tabs-boxed bg-base-100",
        children: [
          (0, e.jsx)(a, {
            className: "tab",
            to: "profile",
            children: "\u4FE1\u606F",
          }),
          t.value &&
            (0, e.jsx)(a, {
              className: "tab",
              to: "members",
              children: "\u6210\u5458",
            }),
          t.value &&
            (0, e.jsx)(a, {
              className: "tab",
              to: "contest",
              children: "\u6BD4\u8D5B",
            }),
          f.value &&
            (0, e.jsx)(a, {
              className: "tab",
              to: "settings",
              children: "\u8BBE\u7F6E",
            }),
          t.value &&
            (0, e.jsx)(a, {
              className: "tab",
              to: "problemset",
              children: "\u9898\u5355",
            }),
          t.value &&
            (0, e.jsx)(a, {
              className: "tab",
              to: "problem",
              children: "\u9898\u76EE",
            }),
        ],
      }),
      (0, e.jsx)(m, {}),
    ],
  });
}
export { d as CatchBoundary, u as ErrorBoundary, p as default };
