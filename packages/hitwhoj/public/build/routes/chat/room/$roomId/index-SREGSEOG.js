import { a as S } from "/build/_shared/chunk-PUHPCD76.js";
import { a as d, b as p } from "/build/_shared/chunk-7WG4REHK.js";
import { a as h } from "/build/_shared/chunk-BQKSLDHG.js";
import { a as g } from "/build/_shared/chunk-F7TWK4YF.js";
import "/build/_shared/chunk-YFBG3YAE.js";
import "/build/_shared/chunk-M6DBAY7B.js";
import { a as I, b as E } from "/build/_shared/chunk-ZPF2YCTJ.js";
import { a as A, c as M, d as R } from "/build/_shared/chunk-33FVQFAB.js";
import { d as c, e as y } from "/build/_shared/chunk-ASHX7EDV.js";
import { B as N, i as w, y as x } from "/build/_shared/chunk-KLFOMCVP.js";
import { a as C } from "/build/_shared/chunk-XIHPQXCX.js";
import { f as b, j as l } from "/build/_shared/chunk-IYNQWWEV.js";
import { b as T, c as v } from "/build/_shared/chunk-P4KF3DFI.js";
import { d as n } from "/build/_shared/chunk-G5WX4PPA.js";
var F = n(C());
var i = n(T());
var e = n(v());
var O = ({ data: a }) => ({
  title: `\u804A\u5929\u5BA4: ${a?.room.name} - HITwh OJ`,
});
function k() {
  let a = M(),
    r = c(() => a.value.room),
    P = c(() => a.value.isMember),
    m = R(() => r.value.chatMessage);
  y(() => {
    let t = h(`./${r.value.id}/events`).subscribe((o) => {
      m.value = [...m.value, o];
    });
    return () => t.unsubscribe();
  });
  let s = A(),
    u = (0, i.useRef)(null);
  return (
    (0, i.useEffect)(() => {
      s.actionSuccess && u.current?.reset();
    }, [s.actionSuccess]),
    (0, e.jsx)(S, {
      visible: !0,
      className: "not-prose",
      children: (0, e.jsxs)("div", {
        className: "drawer-mobile drawer",
        children: [
          (0, e.jsx)("input", { type: "checkbox", className: "drawer-toggle" }),
          (0, e.jsxs)("div", {
            className:
              "not-prose drawer-content bg-base-100 flex min-h-full flex-col overflow-auto px-4",
            children: [
              (0, e.jsx)("header", {
                className: "bg-base-100 sticky top-0 z-10 py-4",
                children: (0, e.jsx)("h1", {
                  className: "text-2xl font-bold",
                  children: r.value.name,
                }),
              }),
              (0, e.jsx)("div", {
                className: "flex-1",
                children: m.value.map((t, o, f) =>
                  o === 0 ||
                  f[o - 1].sender.id !== t.sender.id ||
                  new Date(t.sentAt).getTime() -
                    new Date(f[o - 1].sentAt).getTime() >
                    3e5
                    ? (0, e.jsxs)(
                        "div",
                        {
                          className:
                            "hover:bg-base-200 flex gap-4 px-2 pt-2 transition",
                          children: [
                            (0, e.jsx)(g, {
                              className:
                                "bg-base-300 h-12 w-12 flex-shrink-0 text-2xl",
                              user: t.sender,
                            }),
                            (0, e.jsxs)("div", {
                              className: "flex-1",
                              children: [
                                (0, e.jsx)("div", {
                                  className: "flex w-full justify-between",
                                  children: (0, e.jsxs)("span", {
                                    className: "inline-flex items-center gap-2",
                                    children: [
                                      (0, e.jsx)("span", {
                                        className: "text-primary",
                                        children:
                                          t.sender.nickname ||
                                          t.sender.username,
                                      }),
                                      t.role === "Owner" &&
                                        (0, e.jsx)("span", {
                                          className: "badge badge-primary",
                                          children: "\u6240\u6709\u4EBA",
                                        }),
                                      t.role === "Admin" &&
                                        (0, e.jsx)("span", {
                                          className: "badge badge-primary",
                                          children: "\u7BA1\u7406\u5458",
                                        }),
                                      !t.role &&
                                        (0, e.jsx)("span", {
                                          className: "badge",
                                          children: "\u6E38\u5BA2",
                                        }),
                                    ],
                                  }),
                                }),
                                (0, e.jsx)("div", {
                                  className: "min-w-0 break-words",
                                  children: t.content,
                                }),
                              ],
                            }),
                            (0, e.jsx)("div", {
                              children: (0, e.jsx)("span", {
                                className: "tooltip tooltip-left",
                                "data-tip": d(t.sentAt),
                                children: (0, e.jsx)("time", {
                                  className:
                                    "text-base-content text-sm opacity-60",
                                  children: p(t.sentAt),
                                }),
                              }),
                            }),
                          ],
                        },
                        t.id
                      )
                    : (0, e.jsxs)(
                        "div",
                        {
                          className:
                            "hover:bg-base-200 group flex gap-4 px-2 transition",
                          children: [
                            (0, e.jsx)("div", {
                              className: "h-0 w-12 flex-shrink-0",
                            }),
                            (0, e.jsx)("span", {
                              className: "min-w-0 flex-1 break-words",
                              children: t.content,
                            }),
                            (0, e.jsx)("div", {
                              children: (0, e.jsx)("span", {
                                className: "tooltip tooltip-left",
                                "data-tip": d(t.sentAt),
                                children: (0, e.jsx)("time", {
                                  className:
                                    "text-sm opacity-0 transition group-hover:opacity-60",
                                  children: p(t.sentAt),
                                }),
                              }),
                            }),
                          ],
                        },
                        t.id
                      )
                ),
              }),
              (0, e.jsxs)(l, {
                method: "post",
                className: "bg-base-100 sticky bottom-0 z-10 flex gap-4 py-4",
                ref: u,
                autoComplete: "off",
                children: [
                  (0, e.jsx)("input", {
                    type: "hidden",
                    name: "roomId",
                    value: r.value.id,
                  }),
                  (0, e.jsx)("input", {
                    className: "input input-bordered flex-1",
                    type: "text",
                    placeholder: "\u8F93\u5165\u6D88\u606F...",
                    name: "content",
                    disabled: s.isRunning,
                    required: !0,
                    autoComplete: "false",
                  }),
                  (0, e.jsxs)("button", {
                    className: "btn btn-primary gap-2",
                    type: "submit",
                    disabled: s.isRunning,
                    children: [
                      (0, e.jsx)(N, { className: "rotate-90" }),
                      (0, e.jsx)("span", { children: "\u53D1\u9001" }),
                    ],
                  }),
                ],
              }),
            ],
          }),
          (0, e.jsxs)("div", {
            className: "drawer-side",
            children: [
              (0, e.jsx)("div", { className: "drawer-overlay" }),
              (0, e.jsxs)("aside", {
                className: "bg-base-200 flex w-72 flex-col justify-between p-4",
                children: [
                  (0, e.jsx)("div", {
                    children: (0, e.jsxs)(b, {
                      className: "btn btn-ghost gap-2",
                      to: "/",
                      children: [
                        (0, e.jsx)(w, {}),
                        (0, e.jsx)("span", {
                          children: "\u8FD4\u56DE\u4E0A\u4E00\u9875",
                        }),
                      ],
                    }),
                  }),
                  P &&
                    (0, e.jsx)(l, {
                      method: "post",
                      action: "exit",
                      children: (0, e.jsxs)("button", {
                        className: "btn btn-error w-full gap-2",
                        children: [
                          (0, e.jsx)(x, {}),
                          (0, e.jsx)("span", {
                            children: "\u9000\u51FA\u7FA4\u7EC4",
                          }),
                        ],
                      }),
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
export { E as CatchBoundary, I as ErrorBoundary, k as default, O as meta };
