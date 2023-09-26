import "/build/_shared/chunk-JCTKAXWK.js";
import { b as c } from "/build/_shared/chunk-WF674727.js";
import "/build/_shared/chunk-M6DBAY7B.js";
import { a as d, b as u } from "/build/_shared/chunk-ZPF2YCTJ.js";
import { a as n, c as i } from "/build/_shared/chunk-33FVQFAB.js";
import { d as a } from "/build/_shared/chunk-ASHX7EDV.js";
import "/build/_shared/chunk-KLFOMCVP.js";
import { a as h } from "/build/_shared/chunk-XIHPQXCX.js";
import { j as s } from "/build/_shared/chunk-IYNQWWEV.js";
import { b as g, c as r } from "/build/_shared/chunk-P4KF3DFI.js";
import { d as o } from "/build/_shared/chunk-G5WX4PPA.js";
var p = o(g());
var R = o(h());
var t = o(r());
function f() {
  let m = i(),
    w = a(() => m.value.contest),
    e = n(),
    l = c();
  return (
    (0, p.useEffect)(() => {
      e.actionSuccess && l.success("\u62A5\u540D\u6210\u529F");
    }, [e.actionSuccess]),
    (0, t.jsxs)(t.Fragment, {
      children: [
        (0, t.jsx)("h2", { children: "\u62A5\u540D\u6BD4\u8D5B" }),
        (0, t.jsx)("p", {
          children:
            "\u8BF7\u6CE8\u610F\u8BDA\u4FE1\u53C2\u8D5B\uFF0C\u4E0D\u8981\u4F7F\u7528\u4EFB\u4F55\u5916\u6302\u3001\u4F5C\u5F0A\u5DE5\u5177\u53C2\u8D5B\u3002",
        }),
        (0, t.jsxs)(s, {
          method: "post",
          className: "flex gap-4",
          children: [
            w.value.registrationType === "Password" &&
              (0, t.jsx)("input", {
                className: "input input-bordered",
                placeholder: "\u5BC6\u7801",
                name: "password",
                disabled: e.isRunning,
                required: !0,
              }),
            (0, t.jsx)("button", {
              className: "btn btn-primary",
              type: "submit",
              disabled: e.isRunning,
              children: "\u540C\u610F\u5E76\u62A5\u540D",
            }),
          ],
        }),
      ],
    })
  );
}
export { u as CatchBoundary, d as ErrorBoundary, f as default };
