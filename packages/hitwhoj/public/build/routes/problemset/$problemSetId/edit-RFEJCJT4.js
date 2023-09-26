import { a as u } from "/build/_shared/chunk-2QKU57KM.js";
import { a as w } from "/build/_shared/chunk-55TVTKSM.js";
import { a as f } from "/build/_shared/chunk-KAFADMKS.js";
import "/build/_shared/chunk-XCRF7VPJ.js";
import "/build/_shared/chunk-C6VOOSKL.js";
import { b as c } from "/build/_shared/chunk-WF674727.js";
import "/build/_shared/chunk-YFBG3YAE.js";
import "/build/_shared/chunk-KUDQOE27.js";
import "/build/_shared/chunk-NPZ34MRD.js";
import "/build/_shared/chunk-6WF7NKYL.js";
import "/build/_shared/chunk-5CMXDJBZ.js";
import "/build/_shared/chunk-M6DBAY7B.js";
import { a as d, b } from "/build/_shared/chunk-ZPF2YCTJ.js";
import { a as s, c as p } from "/build/_shared/chunk-33FVQFAB.js";
import { d as i } from "/build/_shared/chunk-ASHX7EDV.js";
import "/build/_shared/chunk-KLFOMCVP.js";
import { a as v } from "/build/_shared/chunk-XIHPQXCX.js";
import { j as l } from "/build/_shared/chunk-IYNQWWEV.js";
import { b as h, c as m } from "/build/_shared/chunk-P4KF3DFI.js";
import { d as a } from "/build/_shared/chunk-G5WX4PPA.js";
var y = a(v());
var P = a(h()),
  e = a(m());
var I = ({ data: r }) => ({
  title: `\u7F16\u8F91\u9898\u5355: ${r?.problemSet.title} - HITwh OJ`,
});
function S() {
  let r = p(),
    t = i(() => r.value.problemSet),
    o = s(),
    g = c();
  return (
    (0, P.useEffect)(() => {
      o.actionSuccess && g.success("\u66F4\u65B0\u6210\u529F");
    }, [o.actionSuccess]),
    (0, e.jsxs)(e.Fragment, {
      children: [
        (0, e.jsx)("h2", {
          children: "\u7F16\u8F91\u516C\u5171\u9898\u5355\u4FE1\u606F",
        }),
        (0, e.jsxs)(l, {
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
                    children: "\u6807\u9898",
                  }),
                }),
                (0, e.jsx)("input", {
                  className: "input input-bordered",
                  type: "text",
                  name: "title",
                  defaultValue: t.value.title,
                  disabled: o.isRunning,
                  required: !0,
                }),
              ],
            }),
            (0, e.jsx)(w, {
              label: "\u9898\u5355\u6807\u7B7E",
              name: "tag",
              defaultTags: t.value.tags.map(({ name: n }) => n),
            }),
            (0, e.jsxs)("div", {
              className: "form-control",
              children: [
                (0, e.jsx)("label", {
                  className: "label",
                  children: (0, e.jsx)("span", {
                    className: "label-text",
                    children: "\u7B80\u4ECB",
                  }),
                }),
                (0, e.jsx)(f, {
                  name: "description",
                  defaultValue: t.value.description,
                }),
              ],
            }),
            (0, e.jsx)("div", {
              className: "form-control",
              children: (0, e.jsxs)("label", {
                className: "label cursor-pointer justify-start gap-2",
                children: [
                  (0, e.jsx)("input", {
                    className: "checkbox checkbox-primary",
                    type: "checkbox",
                    name: "private",
                    defaultChecked: t.value.private,
                    disabled: o.isRunning,
                  }),
                  (0, e.jsx)("span", {
                    className: "label-text",
                    children: "\u4FDD\u6301\u9898\u5355\u9690\u85CF",
                  }),
                ],
              }),
            }),
            (0, e.jsx)("div", {
              className: "form-control w-full max-w-xs",
              children: (0, e.jsx)("button", {
                className: "btn btn-primary",
                type: "submit",
                name: "_action",
                value: "updateInformation",
                disabled: o.isRunning,
                children: "\u786E\u8BA4\u4FEE\u6539",
              }),
            }),
          ],
        }),
        (0, e.jsx)("h2", { children: "\u9898\u76EE" }),
        (0, e.jsx)(u, {
          problems: t.value.problems.map(({ problem: n }) => n),
          createAction: "createProblem",
          deleteAction: "deleteProblem",
          moveUpAction: "moveProblemUp",
          moveDownAction: "moveProblemDown",
        }),
      ],
    })
  );
}
export { b as CatchBoundary, d as ErrorBoundary, S as default, I as meta };
