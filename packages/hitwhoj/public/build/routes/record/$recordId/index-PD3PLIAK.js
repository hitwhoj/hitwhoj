import { a as p } from "/build/_shared/chunk-RGCNEZEZ.js";
import { a as k } from "/build/_shared/chunk-IC4EQTIY.js";
import { a as l } from "/build/_shared/chunk-MVNZUVNE.js";
import { a as D } from "/build/_shared/chunk-LGBCQJ4S.js";
import { a as i } from "/build/_shared/chunk-RE2DFUAK.js";
import "/build/_shared/chunk-4B3SKNWL.js";
import { a as S } from "/build/_shared/chunk-QTGCURF2.js";
import "/build/_shared/chunk-7WG4REHK.js";
import { a as h } from "/build/_shared/chunk-ANJHU2RD.js";
import { a as g } from "/build/_shared/chunk-BQKSLDHG.js";
import "/build/_shared/chunk-F7TWK4YF.js";
import { b as x } from "/build/_shared/chunk-WF674727.js";
import { a as N } from "/build/_shared/chunk-6WF7NKYL.js";
import "/build/_shared/chunk-5CMXDJBZ.js";
import { a as C, b as E } from "/build/_shared/chunk-ZPF2YCTJ.js";
import { c as R, d as w } from "/build/_shared/chunk-33FVQFAB.js";
import { d as u, e as b } from "/build/_shared/chunk-ASHX7EDV.js";
import { j as y } from "/build/_shared/chunk-KLFOMCVP.js";
import { a as T } from "/build/_shared/chunk-XIHPQXCX.js";
import "/build/_shared/chunk-IYNQWWEV.js";
import { c as v } from "/build/_shared/chunk-P4KF3DFI.js";
import { d as m } from "/build/_shared/chunk-G5WX4PPA.js";
var I = m(T()),
  M = m(D());
var e = m(v());
var P = ({ data: o }) => ({
  title: `\u63D0\u4EA4\u8BB0\u5F55: ${o?.record.status} - HITwh OJ`,
});
function L() {
  let o = R(),
    t = w(() => o.value.record),
    n = u(() => o.value.code);
  b(() => {
    let a = g(`./${t.value.id}/events`).subscribe((s) => {
      t.value = {
        ...t.value,
        time: s.time,
        memory: s.memory,
        status: s.status,
        subtasks: s.subtasks,
        message: s.message,
      };
    });
    return () => a.unsubscribe();
  });
  let c = x(),
    d = u(() => t.value.subtasks);
  return (0, e.jsxs)(e.Fragment, {
    children: [
      (0, e.jsx)("h1", { children: (0, e.jsx)(i, { status: t.value.status }) }),
      (0, e.jsx)("p", {
        children: (0, e.jsx)(l, { time: t.value.time, memory: t.value.memory }),
      }),
      (0, e.jsxs)("div", {
        className: "my-4 flex flex-wrap gap-4",
        children: [
          (0, e.jsxs)("span", {
            children: [
              (0, e.jsx)("span", {
                className: "opacity-60",
                children: "\u7528\u6237\uFF1A",
              }),
              (0, e.jsx)(S, { user: t.value.submitter }),
            ],
          }),
          (0, e.jsxs)("span", {
            children: [
              (0, e.jsx)("span", {
                className: "opacity-60",
                children: "\u9898\u76EE\uFF1A",
              }),
              (0, e.jsx)(N, { problem: t.value.problem }),
            ],
          }),
          t.value.contest &&
            (0, e.jsxs)("span", {
              children: [
                (0, e.jsx)("span", {
                  className: "opacity-60",
                  children: "\u6BD4\u8D5B\uFF1A",
                }),
                (0, e.jsx)(k, { contest: t.value.contest }),
              ],
            }),
        ],
      }),
      t.value.message &&
        (0, e.jsxs)(e.Fragment, {
          children: [
            (0, e.jsx)("h2", { children: "\u8F93\u51FA\u4FE1\u606F" }),
            (0, e.jsx)(p, { language: "text", children: t.value.message }),
          ],
        }),
      d.value.length > 0 &&
        (0, e.jsxs)(e.Fragment, {
          children: [
            (0, e.jsx)("h2", { children: "\u6D4B\u8BD5\u70B9\u7ED3\u679C" }),
            d.value.map((a, s) =>
              (0, e.jsxs)(
                "div",
                {
                  className: "collapse-open collapse",
                  tabIndex: 0,
                  children: [
                    (0, e.jsxs)("div", {
                      className: "collapse-title flex gap-2",
                      children: [
                        (0, e.jsxs)("span", {
                          children: ["\u5B50\u4EFB\u52A1 ", s + 1],
                        }),
                        (0, e.jsx)(i, { status: a.status }),
                        (0, e.jsx)("span", { children: a.message }),
                      ],
                    }),
                    (0, e.jsx)("div", {
                      className: "collapse-content",
                      children: a.tasks.map((r, f) =>
                        (0, e.jsxs)(
                          "div",
                          {
                            className: "flex items-center gap-2",
                            children: [
                              (0, e.jsx)(y, {}),
                              (0, e.jsxs)("span", {
                                children: ["\u6D4B\u8BD5\u70B9 ", f + 1],
                              }),
                              (0, e.jsx)(i, { status: r.status }),
                              (0, e.jsx)("span", { children: r.message }),
                              (0, e.jsx)(l, { time: r.time, memory: r.memory }),
                            ],
                          },
                          f
                        )
                      ),
                    }),
                  ],
                },
                s
              )
            ),
          ],
        }),
      n.value &&
        (0, e.jsxs)(e.Fragment, {
          children: [
            (0, e.jsxs)("h2", {
              className: "flex gap-2",
              children: [
                (0, e.jsx)("span", { children: "\u6E90\u4EE3\u7801" }),
                (0, e.jsx)("button", {
                  className: "btn btn-square btn-ghost btn-sm",
                  onClick: () =>
                    navigator.clipboard.writeText(n.value).then(
                      () => c.success("\u590D\u5236\u6210\u529F"),
                      () => c.error("\u6743\u9650\u4E0D\u8DB3")
                    ),
                  children: (0, e.jsx)(h, { className: "text-info h-4 w-4" }),
                }),
              ],
            }),
            (0, e.jsx)(p, { language: t.value.language, children: n.value }),
          ],
        }),
    ],
  });
}
export { E as CatchBoundary, C as ErrorBoundary, L as default, P as meta };
