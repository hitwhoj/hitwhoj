import { a as u } from "/build/_shared/chunk-PUHPCD76.js";
import { b as d } from "/build/_shared/chunk-WF674727.js";
import "/build/_shared/chunk-YFBG3YAE.js";
import { a as m, c as f } from "/build/_shared/chunk-33FVQFAB.js";
import { d as l } from "/build/_shared/chunk-ASHX7EDV.js";
import { i as c } from "/build/_shared/chunk-KLFOMCVP.js";
import { a as g } from "/build/_shared/chunk-XIHPQXCX.js";
import { c as s, f as r, j as n } from "/build/_shared/chunk-IYNQWWEV.js";
import { b as I, c as i } from "/build/_shared/chunk-P4KF3DFI.js";
import { d as a } from "/build/_shared/chunk-G5WX4PPA.js";
var k = a(g());
var p = a(I()),
  t = a(i());
function b() {
  let x = f(),
    N = l(() => x.value.problems),
    { contestId: v } = s(),
    o = m(),
    w = d();
  return (
    (0, p.useEffect)(() => {
      o.actionSuccess && w.success("\u63D0\u4EA4\u6210\u529F");
    }, [o.actionSuccess]),
    (0, t.jsx)(u, {
      visible: !0,
      className: "bg-base-100 flex flex-col items-center justify-start",
      children: (0, t.jsxs)("div", {
        className: "w-full max-w-2xl p-4",
        children: [
          (0, t.jsx)("div", {
            children: (0, t.jsxs)(r, {
              className: "btn btn-ghost gap-2",
              to: `/contest/${v}/clarification`,
              children: [
                (0, t.jsx)(c, {}),
                (0, t.jsx)("span", { children: "\u8FD4\u56DE" }),
              ],
            }),
          }),
          (0, t.jsx)("h2", { children: "\u63D0\u4EA4\u53CD\u9988" }),
          (0, t.jsxs)(n, {
            method: "post",
            className: "form-control gap-4",
            children: [
              (0, t.jsxs)("div", {
                className: "form-control w-full max-w-xs",
                children: [
                  (0, t.jsx)("label", {
                    className: "label",
                    children: (0, t.jsx)("span", {
                      className: "label-text",
                      children: "\u53CD\u9988\u9898\u76EE",
                    }),
                  }),
                  (0, t.jsxs)("select", {
                    className: "select select-bordered",
                    name: "rank",
                    defaultValue: "",
                    required: !0,
                    children: [
                      (0, t.jsx)("option", {
                        value: "",
                        disabled: !0,
                        children: "\u8BF7\u9009\u62E9\u9898\u76EE",
                      }),
                      N.value.map((e) =>
                        (0, t.jsx)(
                          "option",
                          {
                            value: e.rank,
                            children: `${String.fromCharCode(64 + e.rank)} - ${
                              e.problem.title
                            }`,
                          },
                          e.rank
                        )
                      ),
                    ],
                  }),
                ],
              }),
              (0, t.jsxs)("div", {
                className: "form-control",
                children: [
                  (0, t.jsx)("label", {
                    className: "label",
                    children: (0, t.jsx)("span", {
                      className: "label-text",
                      children: "\u53CD\u9988\u5185\u5BB9",
                    }),
                  }),
                  (0, t.jsx)("textarea", {
                    className: "textarea textarea-bordered h-24",
                    name: "content",
                    required: !0,
                  }),
                ],
              }),
              (0, t.jsx)("div", {
                className: "form-control w-full max-w-xs",
                children: (0, t.jsx)("button", {
                  className: "btn btn-primary",
                  type: "submit",
                  disabled: o.isRunning,
                  children: "\u63D0\u4EA4",
                }),
              }),
            ],
          }),
        ],
      }),
    })
  );
}
export { b as default };
