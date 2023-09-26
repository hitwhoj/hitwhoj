import "/build/_shared/chunk-M6DBAY7B.js";
import { a as c, b as u } from "/build/_shared/chunk-ZPF2YCTJ.js";
import { a as p, c as d } from "/build/_shared/chunk-33FVQFAB.js";
import { d as m } from "/build/_shared/chunk-ASHX7EDV.js";
import { w as n } from "/build/_shared/chunk-KLFOMCVP.js";
import { a as l } from "/build/_shared/chunk-XIHPQXCX.js";
import { j as s } from "/build/_shared/chunk-IYNQWWEV.js";
import { c as i } from "/build/_shared/chunk-P4KF3DFI.js";
import { d as e } from "/build/_shared/chunk-G5WX4PPA.js";
var w = e(l()),
  o = e(i());
var h = ({ data: r }) => ({
  title: `\u52A0\u5165\u804A\u5929\u5BA4: ${r?.room.name} - HITwh OJ`,
  description: r?.room.description,
});
function f() {
  let r = d(),
    t = m(() => r.value.room),
    a = p();
  return (0, o.jsxs)(o.Fragment, {
    children: [
      (0, o.jsxs)("h1", {
        className: "flex gap-4",
        children: [
          t.value.private && (0, o.jsx)(n, { className: "shrink-0" }),
          (0, o.jsx)("span", { children: t.value.name }),
        ],
      }),
      (0, o.jsx)("p", { children: t.value.description }),
      (0, o.jsxs)(s, {
        method: "post",
        className: "flex gap-4",
        children: [
          t.value.private &&
            (0, o.jsx)("input", {
              className: "input input-bordered",
              type: "password",
              name: "password",
              placeholder: "\u8BF7\u8F93\u5165\u623F\u95F4\u5BC6\u7801",
              disabled: a.isRunning,
            }),
          (0, o.jsx)("button", {
            className: "btn btn-primary",
            type: "submit",
            disabled: a.isRunning,
            children: "\u52A0\u5165\u623F\u95F4",
          }),
        ],
      }),
    ],
  });
}
export { u as CatchBoundary, c as ErrorBoundary, f as default, h as meta };
