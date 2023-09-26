import "/build/_shared/chunk-JCTKAXWK.js";
import { b as s } from "/build/_shared/chunk-WF674727.js";
import "/build/_shared/chunk-M6DBAY7B.js";
import { a as m, b as n } from "/build/_shared/chunk-ZPF2YCTJ.js";
import { a as i } from "/build/_shared/chunk-33FVQFAB.js";
import "/build/_shared/chunk-ASHX7EDV.js";
import "/build/_shared/chunk-KLFOMCVP.js";
import { a as u } from "/build/_shared/chunk-XIHPQXCX.js";
import { j as o } from "/build/_shared/chunk-IYNQWWEV.js";
import { b as p, c as a } from "/build/_shared/chunk-P4KF3DFI.js";
import { d as r } from "/build/_shared/chunk-G5WX4PPA.js";
var d = r(u());
var c = r(p()),
  e = r(a());
var b = () => ({ title: "\u65B0\u5EFA\u56E2\u961F - HITwh OJ" });
function l() {
  let t = i(),
    f = s();
  return (
    (0, c.useEffect)(() => {
      t.actionSuccess && f.success("\u521B\u5EFA\u6210\u529F");
    }, [t.actionSuccess]),
    (0, e.jsxs)(e.Fragment, {
      children: [
        (0, e.jsx)("h1", { children: "\u521B\u5EFA\u56E2\u961F" }),
        (0, e.jsx)("p", {
          children: "\u521B\u5EFA\u4E00\u4E2A\u65B0\u7684\u56E2\u961F\uFF01",
        }),
        (0, e.jsxs)(o, {
          method: "post",
          className: "form-control w-full max-w-xs gap-4",
          children: [
            (0, e.jsxs)("div", {
              className: "form-control",
              children: [
                (0, e.jsx)("label", {
                  className: "label",
                  children: (0, e.jsx)("span", {
                    className: "label-text",
                    children: "\u56E2\u961F\u540D\u79F0",
                  }),
                }),
                (0, e.jsx)("input", {
                  className: "input input-bordered",
                  type: "text",
                  name: "name",
                  required: !0,
                  disabled: t.actionSuccess,
                }),
              ],
            }),
            (0, e.jsx)("div", {
              className: "form-control",
              children: (0, e.jsx)("button", {
                className: "btn btn-primary",
                type: "submit",
                disabled: t.actionSuccess,
                children: "\u521B\u5EFA\u56E2\u961F",
              }),
            }),
          ],
        }),
      ],
    })
  );
}
export { n as CatchBoundary, m as ErrorBoundary, l as default, b as meta };
