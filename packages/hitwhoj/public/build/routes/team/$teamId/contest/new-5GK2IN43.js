import "/build/_shared/chunk-KU4RERCW.js";
import { a as x } from "/build/_shared/chunk-JCTKAXWK.js";
import { a as d } from "/build/_shared/chunk-KAFADMKS.js";
import "/build/_shared/chunk-XCRF7VPJ.js";
import "/build/_shared/chunk-C6VOOSKL.js";
import { b as m } from "/build/_shared/chunk-WF674727.js";
import "/build/_shared/chunk-YFBG3YAE.js";
import "/build/_shared/chunk-KUDQOE27.js";
import "/build/_shared/chunk-NPZ34MRD.js";
import "/build/_shared/chunk-5CMXDJBZ.js";
import "/build/_shared/chunk-M6DBAY7B.js";
import { a as l, b as c } from "/build/_shared/chunk-ZPF2YCTJ.js";
import { a as r } from "/build/_shared/chunk-33FVQFAB.js";
import "/build/_shared/chunk-ASHX7EDV.js";
import "/build/_shared/chunk-KLFOMCVP.js";
import { a as N } from "/build/_shared/chunk-XIHPQXCX.js";
import { j as i } from "/build/_shared/chunk-IYNQWWEV.js";
import { b, c as n } from "/build/_shared/chunk-P4KF3DFI.js";
import { d as a } from "/build/_shared/chunk-G5WX4PPA.js";
var g = a(N());
var o = a(x());
var p = a(b()),
  e = a(n());
var w = () => ({ title: "\u521B\u5EFA\u56E2\u961F\u6BD4\u8D5B - HITwh OJ" });
function u() {
  let t = r(),
    f = m();
  return (
    (0, p.useEffect)(() => {
      t.actionSuccess && f.success("\u521B\u5EFA\u6210\u529F");
    }, [t.actionSuccess]),
    (0, e.jsxs)(e.Fragment, {
      children: [
        (0, e.jsx)("h2", { children: "\u521B\u5EFA\u56E2\u961F\u6BD4\u8D5B" }),
        (0, e.jsxs)(i, {
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
                  required: !0,
                  disabled: t.isRunning,
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
                    children: "\u6BD4\u8D5B\u4ECB\u7ECD",
                  }),
                }),
                (0, e.jsx)(d, { name: "description" }),
              ],
            }),
            (0, e.jsxs)("div", {
              className: "form-control w-full max-w-xs",
              children: [
                (0, e.jsxs)("label", {
                  className: "label",
                  children: [
                    (0, e.jsx)("span", {
                      className: "label-text",
                      children: "\u6BD4\u8D5B\u5F00\u59CB\u65F6\u95F4",
                    }),
                    (0, e.jsx)("span", {
                      className: "label-text-alt",
                      children:
                        Intl.DateTimeFormat().resolvedOptions().timeZone,
                    }),
                  ],
                }),
                (0, e.jsx)("input", {
                  className: "input input-bordered",
                  type: "datetime-local",
                  name: "beginTime",
                  required: !0,
                  disabled: t.isRunning,
                }),
              ],
            }),
            (0, e.jsxs)("div", {
              className: "form-control w-full max-w-xs",
              children: [
                (0, e.jsxs)("label", {
                  className: "label",
                  children: [
                    (0, e.jsx)("span", {
                      className: "label-text",
                      children: "\u6BD4\u8D5B\u7ED3\u675F\u65F6\u95F4",
                    }),
                    (0, e.jsx)("span", {
                      className: "label-text-alt",
                      children:
                        Intl.DateTimeFormat().resolvedOptions().timeZone,
                    }),
                  ],
                }),
                (0, e.jsx)("input", {
                  className: "input input-bordered",
                  type: "datetime-local",
                  name: "endTime",
                  required: !0,
                  disabled: t.isRunning,
                }),
                (0, e.jsx)("input", {
                  type: "hidden",
                  name: "timezone",
                  value: new Date().getTimezoneOffset(),
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
                    children: "\u6BD4\u8D5B\u8D5B\u5236",
                  }),
                }),
                (0, e.jsxs)("select", {
                  className: "select select-bordered",
                  name: "system",
                  required: !0,
                  disabled: t.isRunning,
                  defaultValue: "",
                  children: [
                    (0, e.jsx)("option", {
                      value: "",
                      disabled: !0,
                      children:
                        "\u8BF7\u9009\u62E9\u6BD4\u8D5B\u7684\u8D5B\u5236",
                    }),
                    Object.keys(o.ContestSystem).map((s) =>
                      (0, e.jsx)("option", { value: s, children: s }, s)
                    ),
                  ],
                }),
              ],
            }),
            (0, e.jsx)("div", {
              className: "form-control w-full max-w-xs",
              children: (0, e.jsx)("button", {
                className: "btn btn-primary",
                type: "submit",
                disabled: t.isRunning,
                children: "\u521B\u5EFA\u6BD4\u8D5B",
              }),
            }),
          ],
        }),
      ],
    })
  );
}
export { c as CatchBoundary, l as ErrorBoundary, u as default, w as meta };
