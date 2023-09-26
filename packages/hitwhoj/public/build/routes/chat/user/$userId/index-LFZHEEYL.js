import { a as u, b as d } from "/build/_shared/chunk-7WG4REHK.js";
import { a as g } from "/build/_shared/chunk-BQKSLDHG.js";
import { a as w } from "/build/_shared/chunk-F7TWK4YF.js";
import "/build/_shared/chunk-M6DBAY7B.js";
import { a as A, b as E } from "/build/_shared/chunk-ZPF2YCTJ.js";
import { a as y, c as N, d as I } from "/build/_shared/chunk-33FVQFAB.js";
import { d as c, e as x } from "/build/_shared/chunk-ASHX7EDV.js";
import { B as b } from "/build/_shared/chunk-KLFOMCVP.js";
import { a as T } from "/build/_shared/chunk-XIHPQXCX.js";
import { j as v } from "/build/_shared/chunk-IYNQWWEV.js";
import { b as P, c as h } from "/build/_shared/chunk-P4KF3DFI.js";
import { d as i } from "/build/_shared/chunk-G5WX4PPA.js";
var U = i(T());
var m = i(P());
var e = i(h()),
  _ = ({ data: a }) => ({
    title: `\u804A\u5929: ${
      a?.target.nickname || a?.target.username
    } - HITwh OJ`,
  });
function R() {
  let a = N(),
    s = c(() => a.value.target),
    k = c(() => a.value.source),
    S = c(() => a.value.msgs),
    r = I(() => S.value);
  x(() => {
    let t = g(`./${s.value.id}/events`).subscribe((o) => {
      r.value = [...r.value, o];
    });
    return () => t.unsubscribe();
  });
  let p = (0, m.useRef)(null),
    n = y();
  return (
    (0, m.useEffect)(() => {
      n.actionSuccess && p.current?.reset();
    }, [n.actionSuccess]),
    (0, e.jsxs)("div", {
      className: "flex h-full w-full flex-col",
      children: [
        (0, e.jsx)("header", {
          className: "bg-base-100 sticky top-0 z-10 py-4",
          children: (0, e.jsx)("h1", {
            className: "text-2xl font-bold",
            children: s.value.nickname || s.value.username,
          }),
        }),
        (0, e.jsx)("div", {
          className: "flex-1",
          children:
            r.value.length > 0
              ? r.value.map((t, o, f) => {
                  let M =
                      o === 0 ||
                      f[o - 1].fromId !== t.fromId ||
                      new Date(t.sentAt).getTime() -
                        new Date(f[o - 1].sentAt).getTime() >
                        3e5,
                    l = t.fromId === s.value.id ? s : k;
                  return M
                    ? (0, e.jsxs)(
                        "div",
                        {
                          className:
                            "hover:bg-base-200 flex gap-4 px-2 pt-2 transition",
                          children: [
                            (0, e.jsx)(w, {
                              className:
                                "bg-base-300 h-12 w-12 flex-shrink-0 text-2xl",
                              user: l.value,
                            }),
                            (0, e.jsxs)("div", {
                              className: "flex-1",
                              children: [
                                (0, e.jsx)("div", {
                                  className: "flex w-full justify-between",
                                  children: (0, e.jsx)("span", {
                                    className: "text-primary",
                                    children:
                                      l.value.nickname || l.value.username,
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
                                "data-tip": u(t.sentAt),
                                children: (0, e.jsx)("time", {
                                  className:
                                    "text-base-content text-sm opacity-60",
                                  children: d(t.sentAt),
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
                                "data-tip": u(t.sentAt),
                                children: (0, e.jsx)("time", {
                                  className:
                                    "text-sm opacity-0 transition group-hover:opacity-60",
                                  children: d(t.sentAt),
                                }),
                              }),
                            }),
                          ],
                        },
                        t.id
                      );
                })
              : (0, e.jsx)("div", {
                  className: "grid h-full w-full place-items-center",
                  children: (0, e.jsx)("span", {
                    className: "text-base-content",
                    children:
                      "\u5FEB\u6765\u8DDF TA \u6253\u4E2A\u62DB\u547C\u5427",
                  }),
                }),
        }),
        (0, e.jsxs)(v, {
          method: "post",
          ref: p,
          className: "bg-base-100 sticky bottom-0 z-10 flex gap-4 py-4",
          autoComplete: "off",
          children: [
            (0, e.jsx)("input", {
              type: "hidden",
              name: "to",
              value: s.value.id,
            }),
            (0, e.jsx)("input", {
              className: "input input-bordered flex-1",
              type: "text",
              placeholder: "\u8F93\u5165\u6D88\u606F...",
              name: "content",
              required: !0,
              disabled: n.isRunning,
              autoComplete: "false",
            }),
            (0, e.jsxs)("button", {
              className: "btn btn-primary gap-2",
              type: "submit",
              disabled: n.isRunning,
              children: [
                (0, e.jsx)(b, { className: "rotate-90" }),
                (0, e.jsx)("span", { children: "\u53D1\u9001" }),
              ],
            }),
          ],
        }),
      ],
    })
  );
}
export { E as CatchBoundary, A as ErrorBoundary, R as default, _ as meta };
