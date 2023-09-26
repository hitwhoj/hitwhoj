import "/build/_shared/chunk-M6DBAY7B.js";
import { a as n, b as m } from "/build/_shared/chunk-ZPF2YCTJ.js";
import { a as i } from "/build/_shared/chunk-33FVQFAB.js";
import "/build/_shared/chunk-ASHX7EDV.js";
import "/build/_shared/chunk-KLFOMCVP.js";
import { a as l } from "/build/_shared/chunk-XIHPQXCX.js";
import { j as e } from "/build/_shared/chunk-IYNQWWEV.js";
import { c as a } from "/build/_shared/chunk-P4KF3DFI.js";
import { d as t } from "/build/_shared/chunk-G5WX4PPA.js";
var c = t(l()),
  r = t(a());
function s() {
  let o = i();
  return (0, r.jsxs)(r.Fragment, {
    children: [
      (0, r.jsx)("h1", { children: "\u65B0\u5EFA\u9898\u76EE" }),
      (0, r.jsxs)(e, {
        method: "post",
        className: "form-control w-full max-w-xs gap-4",
        children: [
          (0, r.jsxs)("div", {
            className: "form-control",
            children: [
              (0, r.jsx)("label", {
                className: "label",
                children: (0, r.jsx)("span", {
                  className: "label-text",
                  children: "\u9898\u76EE\u540D\u79F0",
                }),
              }),
              (0, r.jsx)("input", {
                className: "input input-bordered",
                type: "text",
                name: "title",
                required: !0,
                disabled: o.isRunning,
              }),
            ],
          }),
          (0, r.jsx)("div", {
            className: "form-control",
            children: (0, r.jsx)("button", {
              className: "btn btn-primary",
              type: "submit",
              disabled: o.isRunning,
              children: "\u521B\u5EFA\u9898\u76EE",
            }),
          }),
        ],
      }),
    ],
  });
}
export { m as CatchBoundary, n as ErrorBoundary, s as default };
