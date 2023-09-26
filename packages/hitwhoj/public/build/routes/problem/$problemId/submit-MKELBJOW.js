import { a as c } from "/build/_shared/chunk-MDGTQBQV.js";
import { a as n } from "/build/_shared/chunk-LGBCQJ4S.js";
import "/build/_shared/chunk-M6DBAY7B.js";
import { a as r, b as i } from "/build/_shared/chunk-ZPF2YCTJ.js";
import "/build/_shared/chunk-KLFOMCVP.js";
import { a as m } from "/build/_shared/chunk-XIHPQXCX.js";
import { j as t } from "/build/_shared/chunk-IYNQWWEV.js";
import { c as a } from "/build/_shared/chunk-P4KF3DFI.js";
import { d as o } from "/build/_shared/chunk-G5WX4PPA.js";
var d = o(m()),
  u = o(n());
var p = o(c()),
  e = o(a());
var f = ({ data: s }) => ({
  title: `\u63D0\u4EA4\u9898\u76EE: ${s?.problem.title} - HITwh OJ`,
});
function l() {
  return (0, e.jsxs)(t, {
    method: "post",
    className: "form-control gap-4",
    children: [
      (0, e.jsxs)("div", {
        className: "form-control w-full max-w-xs",
        children: [
          (0, e.jsx)("label", {
            className: "label",
            children: (0, e.jsx)("span", {
              className: "label-text",
              children: "\u8BED\u8A00",
            }),
          }),
          (0, e.jsxs)("select", {
            className: "select select-bordered",
            name: "language",
            defaultValue: "",
            required: !0,
            children: [
              (0, e.jsx)("option", {
                value: "",
                disabled: !0,
                children: "\u9009\u62E9\u4EE3\u7801\u8BED\u8A00",
              }),
              (0, e.jsx)("option", { value: "c", children: "C" }),
              (0, e.jsx)("option", { value: "cpp", children: "C++" }),
              (0, e.jsx)("option", { value: "java", children: "Java" }),
            ],
          }),
        ],
      }),
      (0, e.jsxs)("div", {
        className: "form-control",
        children: [
          (0, e.jsx)("label", {
            className: "label",
            children: (0, e.jsx)("span", {
              className: "label-text",
              children: "\u4EE3\u7801",
            }),
          }),
          (0, e.jsx)("textarea", {
            className: "textarea textarea-bordered",
            name: "code",
            placeholder: "Paste your code here desu~",
            required: !0,
          }),
        ],
      }),
      (0, e.jsx)("div", {
        className: "form-control w-full max-w-xs",
        children: (0, e.jsx)("button", {
          className: "btn btn-primary",
          type: "submit",
          children: "\u63D0\u4EA4",
        }),
      }),
    ],
  });
}
export { i as CatchBoundary, r as ErrorBoundary, l as default, f as meta };
