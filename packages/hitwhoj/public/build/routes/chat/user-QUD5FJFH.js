import { a as N } from "/build/_shared/chunk-PUHPCD76.js";
import { a as m } from "/build/_shared/chunk-BQKSLDHG.js";
import { a as p } from "/build/_shared/chunk-F7TWK4YF.js";
import { d as h } from "/build/_shared/chunk-YFBG3YAE.js";
import { a as b, b as x } from "/build/_shared/chunk-ZPF2YCTJ.js";
import { c as v, d as w } from "/build/_shared/chunk-33FVQFAB.js";
import { d as u, e as f } from "/build/_shared/chunk-ASHX7EDV.js";
import { i as c } from "/build/_shared/chunk-KLFOMCVP.js";
import { a as I } from "/build/_shared/chunk-XIHPQXCX.js";
import { a as i, e as n, f as d } from "/build/_shared/chunk-IYNQWWEV.js";
import { c as l } from "/build/_shared/chunk-P4KF3DFI.js";
import { d as a } from "/build/_shared/chunk-G5WX4PPA.js";
var L = a(I());
var e = a(l());
function g() {
  let y = v(),
    o = h(),
    t = w(() => y.value.messages),
    k = u(() => {
      let s = new Set();
      return t.value
        .map((r) => ({
          user: r.from.id === o.value ? r.to : r.from,
          message: r,
        }))
        .filter(({ user: r }) => (s.has(r.id) ? !1 : (s.add(r.id), !0)));
    });
  return (
    f(() => {
      if (o.value) {
        let s = m("/chat/events").subscribe((r) => {
          t.value = [r, ...t.value];
        });
        return () => s.unsubscribe();
      }
    }),
    (0, e.jsx)(N, {
      visible: !0,
      className: "not-prose bg-base-100 flex",
      children: (0, e.jsxs)("div", {
        className: "drawer-mobile drawer",
        children: [
          (0, e.jsx)("input", { type: "checkbox", className: "drawer-toggle" }),
          (0, e.jsx)("div", {
            className: "drawer-content overflow-hidden px-4",
            children: (0, e.jsx)(i, {}),
          }),
          (0, e.jsxs)("div", {
            className: "drawer-side",
            children: [
              (0, e.jsx)("div", { className: "drawer-overlay" }),
              (0, e.jsxs)("aside", {
                className: "bg-base-200 p-4",
                children: [
                  (0, e.jsxs)(d, {
                    className: "btn btn-ghost gap-2",
                    to: "/",
                    children: [
                      (0, e.jsx)(c, {}),
                      (0, e.jsx)("span", {
                        children: "\u8FD4\u56DE\u5230\u4E0A\u4E00\u9875",
                      }),
                    ],
                  }),
                  (0, e.jsx)("ul", {
                    className: "menu mt-4 w-72 p-0",
                    children: k.value.map(({ user: s, message: r }) =>
                      (0, e.jsx)(
                        "li",
                        {
                          children: (0, e.jsx)(n, {
                            to: `/chat/user/${s.id}`,
                            className: "w-full p-4",
                            children: (0, e.jsxs)("div", {
                              className: "flex w-full items-center gap-3",
                              children: [
                                (0, e.jsx)(p, {
                                  user: s,
                                  className:
                                    "bg-base-300 h-16 w-16 flex-shrink-0 text-3xl",
                                }),
                                (0, e.jsxs)("div", {
                                  className: "overflow-hidden",
                                  children: [
                                    (0, e.jsx)("div", {
                                      className:
                                        "overflow-hidden text-ellipsis whitespace-nowrap text-xl font-bold",
                                      children: s.nickname || s.username,
                                    }),
                                    (0, e.jsx)("div", {
                                      className:
                                        "overflow-hidden text-ellipsis whitespace-nowrap",
                                      children: r.content,
                                    }),
                                  ],
                                }),
                              ],
                            }),
                          }),
                        },
                        s.id
                      )
                    ),
                  }),
                ],
              }),
            ],
          }),
        ],
      }),
    })
  );
}
export { x as CatchBoundary, b as ErrorBoundary, g as default };
