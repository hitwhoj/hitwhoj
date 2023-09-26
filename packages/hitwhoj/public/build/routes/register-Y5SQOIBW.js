import { f } from "/build/_shared/chunk-7WG4REHK.js";
import { b as u } from "/build/_shared/chunk-WF674727.js";
import { a as p, b as d } from "/build/_shared/chunk-ZPF2YCTJ.js";
import { a as c } from "/build/_shared/chunk-33FVQFAB.js";
import { c as m } from "/build/_shared/chunk-ASHX7EDV.js";
import "/build/_shared/chunk-KLFOMCVP.js";
import { a as v } from "/build/_shared/chunk-XIHPQXCX.js";
import { f as o, j as n, m as i } from "/build/_shared/chunk-IYNQWWEV.js";
import { b as g, c as l } from "/build/_shared/chunk-P4KF3DFI.js";
import { d as s } from "/build/_shared/chunk-G5WX4PPA.js";
var N = s(v());
var w = s(g()),
  a = s(l());
function b() {
  let t = i(),
    e = c(),
    h = u();
  (0, w.useEffect)(() => {
    e.actionSuccess && h.success("\u767B\u5F55\u6210\u529F");
  }, [e.actionSuccess]);
  let r = m("");
  return (0, a.jsxs)(a.Fragment, {
    children: [
      (0, a.jsx)("h1", { children: "\u6CE8\u518C" }),
      (0, a.jsx)("p", {
        children:
          "\u7F51\u7AD9\u5185\u6D4B\u4E2D\uFF0C\u968F\u65F6\u5220\u6863\uFF0C\u8BF7\u4E0D\u8981\u4E0A\u4F20\u4EFB\u4F55\u8FDD\u53CD\u6CD5\u5F8B\u6CD5\u89C4\u7684\u5185\u5BB9\u3002",
      }),
      (0, a.jsxs)(n, {
        method: "post",
        className: "not-prose form-control w-full max-w-xs gap-4",
        children: [
          (0, a.jsxs)("div", {
            className: "form-control",
            children: [
              (0, a.jsx)("label", {
                className: "label",
                children: (0, a.jsx)("span", {
                  className: "label-text",
                  children:
                    "\u7528\u6237\u540D (\u8BF7\u4F7F\u7528\u5B57\u6BCD\u6570\u5B57\u4E0B\u5212\u7EBF)",
                }),
              }),
              (0, a.jsx)("input", {
                className: "input input-bordered w-full max-w-xs",
                type: "text",
                name: "username",
                required: !0,
                disabled: e.isRunning,
                pattern: "\\w+",
              }),
            ],
          }),
          (0, a.jsxs)("div", {
            className: "form-control",
            children: [
              (0, a.jsx)("input", {
                type: "hidden",
                name: "password",
                value: f(r.value),
              }),
              (0, a.jsx)("label", {
                className: "label",
                children: (0, a.jsx)("span", {
                  className: "label-text",
                  children: "\u5BC6\u7801",
                }),
              }),
              (0, a.jsx)("input", {
                className: "input input-bordered w-full max-w-xs",
                type: "password",
                value: r.value,
                onChange: (x) => (r.value = x.currentTarget.value),
                required: !0,
                disabled: e.isRunning,
              }),
            ],
          }),
          (0, a.jsxs)("div", {
            className: "form-control",
            children: [
              (0, a.jsx)("button", {
                className: "btn btn-primary",
                type: "submit",
                children: "\u6CE8\u518C",
              }),
              (0, a.jsx)("label", {
                className: "label",
                children: (0, a.jsx)(o, {
                  className: "link link-hover label-text-alt",
                  to: "/login",
                  children: "\u767B\u5F55",
                }),
              }),
            ],
          }),
        ],
      }),
      t?.reason &&
        (0, a.jsx)("p", {
          className: "alert alert-error shadow-lg",
          children: t.reason,
        }),
    ],
  });
}
export { d as CatchBoundary, p as ErrorBoundary, b as default };
