import { a as A } from "/build/_shared/chunk-JCTKAXWK.js";
import { a as w } from "/build/_shared/chunk-7WG4REHK.js";
import { b as c } from "/build/_shared/chunk-WF674727.js";
import { d as p } from "/build/_shared/chunk-YFBG3YAE.js";
import { a as h } from "/build/_shared/chunk-KUDQOE27.js";
import "/build/_shared/chunk-NPZ34MRD.js";
import "/build/_shared/chunk-5CMXDJBZ.js";
import "/build/_shared/chunk-M6DBAY7B.js";
import { a as l, b as f } from "/build/_shared/chunk-ZPF2YCTJ.js";
import { a as u, c as d } from "/build/_shared/chunk-33FVQFAB.js";
import { d as i } from "/build/_shared/chunk-ASHX7EDV.js";
import "/build/_shared/chunk-KLFOMCVP.js";
import { a as g } from "/build/_shared/chunk-XIHPQXCX.js";
import { j as s } from "/build/_shared/chunk-IYNQWWEV.js";
import { b as R, c as m } from "/build/_shared/chunk-P4KF3DFI.js";
import { d as o } from "/build/_shared/chunk-G5WX4PPA.js";
var M = o(g());
var n = o(A());
var v = o(R()),
  t = o(m());
var N = ({ data: r }) => ({
  title: `\u56E2\u961F: ${r?.team.name} - HITwh OJ`,
});
function b() {
  let r = d(),
    e = i(() => r.value.team),
    y = i(() => r.value.hasViewPerm),
    I = p(),
    a = u(),
    T = i(() => I.value && !y.value),
    E = c();
  return (
    (0, v.useEffect)(() => {
      a.actionSuccess && E.success("\u6210\u529F\u52A0\u5165\u56E2\u961F");
    }, [a.actionSuccess]),
    (0, t.jsxs)(t.Fragment, {
      children: [
        (0, t.jsxs)("table", {
          children: [
            (0, t.jsx)("thead", {
              children: (0, t.jsx)("tr", {
                children: (0, t.jsx)("th", {
                  children: "\u56E2\u961F\u4FE1\u606F",
                }),
              }),
            }),
            (0, t.jsxs)("tbody", {
              children: [
                (0, t.jsxs)("tr", {
                  children: [
                    (0, t.jsx)("th", { children: "\u521B\u5EFA\u65F6\u95F4" }),
                    (0, t.jsx)("td", { children: w(e.value.createdAt) }),
                  ],
                }),
                (0, t.jsxs)("tr", {
                  children: [
                    (0, t.jsx)("th", { children: "\u6210\u5458\u6570\u91CF" }),
                    (0, t.jsx)("td", { children: e.value._count.members }),
                  ],
                }),
                (0, t.jsxs)("tr", {
                  children: [
                    (0, t.jsx)("th", { children: "\u9898\u76EE\u6570\u91CF" }),
                    (0, t.jsx)("td", { children: e.value._count.problems }),
                  ],
                }),
                (0, t.jsxs)("tr", {
                  children: [
                    (0, t.jsx)("th", { children: "\u9898\u5355\u6570\u91CF" }),
                    (0, t.jsx)("td", { children: e.value._count.problemSets }),
                  ],
                }),
                (0, t.jsxs)("tr", {
                  children: [
                    (0, t.jsx)("th", { children: "\u6BD4\u8D5B\u6570\u91CF" }),
                    (0, t.jsx)("td", { children: e.value._count.contests }),
                  ],
                }),
              ],
            }),
          ],
        }),
        (0, t.jsx)(h, { children: e.value.description }),
        T &&
          (e.value.invitationType === n.InvitationType.NONE
            ? (0, t.jsx)("div", {
                className: "alert alert-info",
                children:
                  "\u8BE5\u56E2\u961F\u672A\u5F00\u653E\u7533\u8BF7\u52A0\u5165",
              })
            : (0, t.jsxs)(s, {
                method: "post",
                className: "flex gap-4",
                children: [
                  e.value.invitationType === n.InvitationType.CODE &&
                    (0, t.jsx)("input", {
                      className: "input input-bordered",
                      name: "code",
                      placeholder: "\u8BF7\u8F93\u5165\u9080\u8BF7\u7801",
                      required: !0,
                      disabled: a.isRunning,
                    }),
                  (0, t.jsx)("button", {
                    className: "btn btn-primary",
                    type: "submit",
                    disabled: a.isRunning,
                    children: "\u52A0\u5165\u56E2\u961F",
                  }),
                ],
              })),
      ],
    })
  );
}
export { f as CatchBoundary, l as ErrorBoundary, b as default, N as meta };
