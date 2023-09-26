import { f as u } from "/build/_shared/chunk-7WG4REHK.js";
import { b as c } from "/build/_shared/chunk-WF674727.js";
import "/build/_shared/chunk-M6DBAY7B.js";
import { a as p } from "/build/_shared/chunk-33FVQFAB.js";
import { c as m } from "/build/_shared/chunk-ASHX7EDV.js";
import { a as g } from "/build/_shared/chunk-XIHPQXCX.js";
import { f as t, j as n, m as i } from "/build/_shared/chunk-IYNQWWEV.js";
import { b as v, c as l } from "/build/_shared/chunk-P4KF3DFI.js";
import { d as s } from "/build/_shared/chunk-G5WX4PPA.js";
var N = s(g());
var d = s(v()),
  e = s(l());
function f() {
  let o = i(),
    a = p(),
    b = c();
  (0, d.useEffect)(() => {
    a.actionSuccess && b.success("\u767B\u5F55\u6210\u529F");
  }, [a.actionSuccess]);
  let r = m("");
  return (0, e.jsxs)(e.Fragment, {
    children: [
      (0, e.jsx)("h1", { children: "\u767B\u5F55" }),
      (0, e.jsx)("p", {
        children:
          "\u7F51\u7AD9\u5185\u6D4B\u4E2D\uFF0C\u968F\u65F6\u5220\u6863\uFF0C\u8BF7\u4E0D\u8981\u4E0A\u4F20\u4EFB\u4F55\u8FDD\u53CD\u6CD5\u5F8B\u6CD5\u89C4\u7684\u5185\u5BB9\u3002",
      }),
      (0, e.jsxs)(n, {
        method: "post",
        className: "not-prose form-control w-full max-w-xs gap-4",
        children: [
          (0, e.jsxs)("div", {
            className: "form-control",
            children: [
              (0, e.jsx)("label", {
                className: "label",
                children: (0, e.jsx)("span", {
                  className: "label-text",
                  children: "\u7528\u6237\u540D",
                }),
              }),
              (0, e.jsx)("input", {
                className: "input input-bordered w-full max-w-xs",
                type: "text",
                name: "username",
                required: !0,
                disabled: a.isRunning,
                pattern: "\\w+",
              }),
            ],
          }),
          (0, e.jsxs)("div", {
            className: "form-control",
            children: [
              (0, e.jsx)("input", {
                type: "hidden",
                name: "password",
                value: u(r.value),
              }),
              (0, e.jsx)("label", {
                className: "label",
                children: (0, e.jsx)("span", {
                  className: "label-text",
                  children: "\u5BC6\u7801",
                }),
              }),
              (0, e.jsx)("input", {
                className: "input input-bordered w-full max-w-xs",
                type: "password",
                value: r.value,
                onChange: (w) => (r.value = w.currentTarget.value),
                required: !0,
                disabled: a.isRunning,
              }),
            ],
          }),
          (0, e.jsxs)("div", {
            className: "form-control",
            children: [
              (0, e.jsx)("button", {
                className: "btn btn-primary",
                type: "submit",
                children: "\u767B\u5F55",
              }),
              (0, e.jsxs)("label", {
                className: "label",
                children: [
                  (0, e.jsx)(t, {
                    className: "link link-hover label-text-alt",
                    to: "/register",
                    children: "\u6CE8\u518C",
                  }),
                  (0, e.jsx)(t, {
                    className: "link link-hover label-text-alt",
                    to: "/reset",
                    children: "\u5FD8\u8BB0\u5BC6\u7801",
                  }),
                ],
              }),
            ],
          }),
          o?.reason &&
            (0, e.jsx)("p", {
              className: "alert alert-error shadow-lg",
              children: o.reason,
            }),
        ],
      }),
    ],
  });
}
export { f as default };
