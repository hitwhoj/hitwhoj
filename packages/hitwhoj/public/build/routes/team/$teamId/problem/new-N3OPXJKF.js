import "/build/_shared/chunk-M6DBAY7B.js";
import { a as n, b as s } from "/build/_shared/chunk-ZPF2YCTJ.js";
import { a as i } from "/build/_shared/chunk-33FVQFAB.js";
import "/build/_shared/chunk-ASHX7EDV.js";
import "/build/_shared/chunk-KLFOMCVP.js";
import { a as l } from "/build/_shared/chunk-XIHPQXCX.js";
import { j as r } from "/build/_shared/chunk-IYNQWWEV.js";
import { c as a } from "/build/_shared/chunk-P4KF3DFI.js";
import { d as o } from "/build/_shared/chunk-G5WX4PPA.js";
var c = o(l()),
  t = o(a());
function m() {
  let e = i();
  return (0, t.jsxs)(t.Fragment, {
    children: [
      (0, t.jsx)("h2", { children: "\u65B0\u5EFA\u9898\u76EE" }),
      (0, t.jsxs)(r, {
        method: "post",
        className: "form-control w-full max-w-xs gap-4",
        children: [
          (0, t.jsxs)("div", {
            className: "form-control",
            children: [
              (0, t.jsx)("label", {
                className: "label",
                children: (0, t.jsx)("span", {
                  className: "label-text",
                  children: "\u9898\u76EE\u540D\u79F0",
                }),
              }),
              (0, t.jsx)("input", {
                className: "input input-bordered",
                type: "text",
                name: "title",
                required: !0,
                disabled: e.isRunning,
              }),
            ],
          }),
          (0, t.jsx)("div", {
            className: "form-control",
            children: (0, t.jsx)("button", {
              className: "btn btn-primary",
              type: "submit",
              disabled: e.isRunning,
              children: "\u521B\u5EFA\u9898\u76EE",
            }),
          }),
        ],
      }),
    ],
  });
}
export { s as CatchBoundary, n as ErrorBoundary, m as default };
