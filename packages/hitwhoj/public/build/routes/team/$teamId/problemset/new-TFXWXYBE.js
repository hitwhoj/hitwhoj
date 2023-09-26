import "/build/_shared/chunk-M6DBAY7B.js";
import { a as n, b as m } from "/build/_shared/chunk-ZPF2YCTJ.js";
import { a as i } from "/build/_shared/chunk-33FVQFAB.js";
import "/build/_shared/chunk-ASHX7EDV.js";
import "/build/_shared/chunk-KLFOMCVP.js";
import { a as l } from "/build/_shared/chunk-XIHPQXCX.js";
import { j as o } from "/build/_shared/chunk-IYNQWWEV.js";
import { c as r } from "/build/_shared/chunk-P4KF3DFI.js";
import { d as e } from "/build/_shared/chunk-G5WX4PPA.js";
var c = e(l()),
  t = e(r());
var d = () => ({ title: "\u521B\u5EFA\u9898\u5355 - HITwh OJ" });
function s() {
  let a = i();
  return (0, t.jsxs)(t.Fragment, {
    children: [
      (0, t.jsx)("h2", { children: "\u521B\u5EFA\u56E2\u961F\u9898\u5355" }),
      (0, t.jsxs)(o, {
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
                  children: "\u6807\u9898",
                }),
              }),
              (0, t.jsx)("input", {
                className: "input input-bordered",
                type: "text",
                name: "title",
                disabled: a.isRunning,
                required: !0,
              }),
            ],
          }),
          (0, t.jsx)("div", {
            className: "form-control",
            children: (0, t.jsx)("button", {
              className: "btn btn-primary",
              type: "submit",
              disabled: a.isRunning,
              children: "\u521B\u5EFA\u9898\u5355",
            }),
          }),
        ],
      }),
    ],
  });
}
export { m as CatchBoundary, n as ErrorBoundary, s as default, d as meta };
