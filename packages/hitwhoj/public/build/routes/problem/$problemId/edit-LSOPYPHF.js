import { a as w } from "/build/_shared/chunk-QTGCURF2.js";
import "/build/_shared/chunk-F7TWK4YF.js";
import { a as g } from "/build/_shared/chunk-55TVTKSM.js";
import { a as y } from "/build/_shared/chunk-KAFADMKS.js";
import "/build/_shared/chunk-XCRF7VPJ.js";
import "/build/_shared/chunk-C6VOOSKL.js";
import { b as d } from "/build/_shared/chunk-WF674727.js";
import { d as b } from "/build/_shared/chunk-YFBG3YAE.js";
import "/build/_shared/chunk-KUDQOE27.js";
import "/build/_shared/chunk-NPZ34MRD.js";
import "/build/_shared/chunk-5CMXDJBZ.js";
import "/build/_shared/chunk-M6DBAY7B.js";
import { a as f, b as v } from "/build/_shared/chunk-ZPF2YCTJ.js";
import { a as u, c as p } from "/build/_shared/chunk-33FVQFAB.js";
import { d as i } from "/build/_shared/chunk-ASHX7EDV.js";
import "/build/_shared/chunk-KLFOMCVP.js";
import { a as R } from "/build/_shared/chunk-XIHPQXCX.js";
import { j as m } from "/build/_shared/chunk-IYNQWWEV.js";
import { b as L, c } from "/build/_shared/chunk-P4KF3DFI.js";
import { d as l } from "/build/_shared/chunk-G5WX4PPA.js";
var h = l(L());
var S = l(R());
var e = l(c());
var E = ({ data: o }) => ({
  title: `\u7F16\u8F91\u9898\u76EE: ${o?.problem.title} - HITwh OJ`,
});
function x() {
  let o = p(),
    t = i(() => o.value.problem),
    a = u(),
    k = d();
  (0, h.useEffect)(() => {
    a.actionSuccess && k.success("\u66F4\u65B0\u6210\u529F");
  }, [a.actionSuccess]);
  let n = b(),
    s = i(() => t.value.lockedBy !== null),
    r = i(() => n.value && t.value.lockedBy?.id === n.value);
  return (0, e.jsxs)(m, {
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
              children: "\u9898\u76EE\u540D\u79F0",
            }),
          }),
          (0, e.jsx)("input", {
            className: "input input-bordered",
            name: "title",
            required: !0,
            defaultValue: t.value.title,
            disabled: a.isRunning,
          }),
        ],
      }),
      (0, e.jsx)(g, {
        label: "\u9898\u76EE\u6807\u7B7E",
        name: "tag",
        defaultTags: t.value.tags.map(({ name: N }) => N),
      }),
      (0, e.jsxs)("div", {
        className: "form-control",
        children: [
          (0, e.jsx)("label", {
            className: "label",
            children: (0, e.jsx)("span", {
              className: "label-text",
              children: "\u9898\u76EE\u6B63\u6587",
            }),
          }),
          (0, e.jsx)(y, {
            name: "description",
            defaultValue: t.value.description,
          }),
        ],
      }),
      (0, e.jsxs)("div", {
        className: "form-control w-full max-w-xs",
        children: [
          (0, e.jsx)("label", {
            className: "label",
            children: (0, e.jsx)("span", {
              className: "label-text",
              children:
                "\u65F6\u95F4\u9650\u5236 (ms, \u4EC5\u4F9B\u9898\u9762\u53C2\u8003)",
            }),
          }),
          (0, e.jsx)("input", {
            className: "input input-bordered",
            name: "timeLimit",
            type: "number",
            required: !0,
            defaultValue: String(t.value.timeLimit),
            disabled: a.isRunning,
          }),
        ],
      }),
      (0, e.jsxs)("div", {
        className: "form-control w-full max-w-xs",
        children: [
          (0, e.jsx)("label", {
            className: "label",
            children: (0, e.jsx)("span", {
              className: "label-text",
              children:
                "\u5185\u5B58\u9650\u5236 (byte, \u4EC5\u4F9B\u9898\u9762\u53C2\u8003)",
            }),
          }),
          (0, e.jsx)("input", {
            className: "input input-bordered",
            name: "memoryLimit",
            type: "number",
            required: !0,
            defaultValue: String(t.value.memoryLimit),
            disabled: a.isRunning,
          }),
        ],
      }),
      (0, e.jsxs)("div", {
        className: "form-control",
        children: [
          (0, e.jsxs)("label", {
            className: "label cursor-pointer justify-start gap-2",
            children: [
              (0, e.jsx)("input", {
                className: "checkbox checkbox-primary",
                type: "checkbox",
                name: "private",
                defaultChecked: t.value.private,
                disabled: a.isRunning,
              }),
              (0, e.jsx)("span", {
                className: "label-text",
                children: "\u4FDD\u6301\u9898\u76EE\u9690\u85CF",
              }),
            ],
          }),
          (0, e.jsxs)("label", {
            className: "label cursor-pointer justify-start gap-2",
            children: [
              (0, e.jsx)("input", {
                className: "checkbox checkbox-primary",
                type: "checkbox",
                name: "allowSubmit",
                defaultChecked: t.value.allowSubmit,
                disabled: a.isRunning,
              }),
              (0, e.jsx)("span", {
                className: "label-text",
                children: "\u5141\u8BB8\u7528\u6237\u63D0\u4EA4",
              }),
            ],
          }),
          (0, e.jsxs)("label", {
            className: "label cursor-pointer justify-start gap-2",
            children: [
              (0, e.jsx)("input", {
                className: "checkbox checkbox-primary",
                type: "checkbox",
                name: "lock",
                defaultChecked: s.value,
                disabled: a.isRunning || (s && !r),
              }),
              (0, e.jsx)("span", {
                className: "label-text",
                children: "\u9501\u5B9A\u9898\u76EE",
              }),
              (0, e.jsx)("div", {
                className: "tooltip h-10",
                "data-tip":
                  "\u9501\u5B9A\u540E\uFF0C\u53EA\u6709\u9501\u5B9A\u4EBA\u53EF\u4EE5\u7F16\u8F91\u672C\u9898",
                children: (0, e.jsx)("button", {
                  className: "btn-link h-10 p-0",
                  type: "button",
                  children: "?",
                }),
              }),
              s.value &&
                (r.value
                  ? (0, e.jsx)("span", {
                      className: "label-text text-success",
                      children: "\u60A8\u5DF2\u9501\u5B9A\u8BE5\u9898\u76EE",
                    })
                  : (0, e.jsxs)("span", {
                      className: "label-text text-error",
                      children: [
                        "\u8BE5\u9898\u76EE\u5DF2\u88AB",
                        (0, e.jsx)(w, { user: t.value.lockedBy }),
                        "\u9501\u5B9A",
                      ],
                    })),
            ],
          }),
        ],
      }),
      (0, e.jsx)("div", {
        className: "form-control w-full max-w-xs",
        children: (0, e.jsx)("button", {
          className: "btn btn-primary",
          type: "submit",
          disabled: a.isRunning || (s.value && !r.value),
          children: "\u786E\u8BA4\u4FEE\u6539",
        }),
      }),
    ],
  });
}
export { v as CatchBoundary, f as ErrorBoundary, x as default, E as meta };
