import { a as d } from "/build/_shared/chunk-F7TWK4YF.js";
import { a as c, b as E } from "/build/_shared/chunk-ZPF2YCTJ.js";
import { c as l } from "/build/_shared/chunk-33FVQFAB.js";
import { d as s } from "/build/_shared/chunk-ASHX7EDV.js";
import "/build/_shared/chunk-KLFOMCVP.js";
import { a as p } from "/build/_shared/chunk-XIHPQXCX.js";
import { a as m, e as r, f as n } from "/build/_shared/chunk-IYNQWWEV.js";
import { c as u } from "/build/_shared/chunk-P4KF3DFI.js";
import { d as o } from "/build/_shared/chunk-G5WX4PPA.js";
var P = o(p());
var e = o(u());
var h = ({ data: a }) => ({
  title: `\u7528\u6237: ${a?.user.nickname || a?.user.username} - HITwh OJ`,
});
function f() {
  let a = l(),
    t = s(() => a.value.user),
    i = s(() => a.value.hasEditPerm),
    v = s(() => a.value.hasAdminPerm);
  return (0, e.jsxs)("div", {
    children: [
      (0, e.jsxs)("header", {
        className: "not-prose my-4 text-center",
        children: [
          (0, e.jsx)(d, {
            user: t.value,
            className: "bg-base-200 mx-auto h-20 w-20 text-3xl",
          }),
          (0, e.jsx)("h1", {
            className: "mt-4 text-lg font-bold",
            children: t.value.nickname || t.value.username,
          }),
          t.value.bio &&
            (0, e.jsx)("p", {
              className: "mt-3 text-sm",
              children: t.value.bio,
            }),
          (0, e.jsxs)("div", {
            className: "tabs tabs-boxed bg-base-100 mt-5 justify-center",
            children: [
              (0, e.jsx)(r, {
                className: "tab",
                to: "profile",
                children: "\u8D44\u6599",
              }),
              (0, e.jsx)(r, {
                className: "tab",
                to: "statistics",
                children: "\u7EDF\u8BA1",
              }),
              i.value &&
                (0, e.jsx)(r, {
                  className: "tab",
                  to: "files",
                  children: "\u6587\u4EF6",
                }),
              i.value &&
                (0, e.jsx)(r, {
                  className: "tab",
                  to: "edit",
                  children: "\u7F16\u8F91",
                }),
              v.value &&
                (0, e.jsx)(r, {
                  className: "tab",
                  to: "admin",
                  children: "\u6EE5\u6743",
                }),
              (0, e.jsx)(n, {
                className: "tab",
                to: `/chat/user/${t.value.id}`,
                children: "\u804A\u5929",
              }),
            ],
          }),
        ],
      }),
      (0, e.jsx)("div", { children: (0, e.jsx)(m, {}) }),
    ],
  });
}
export { E as CatchBoundary, c as ErrorBoundary, f as default, h as meta };
