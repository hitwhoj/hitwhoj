import { b as w } from "/build/_shared/chunk-WF674727.js";
import { a as D } from "/build/_shared/chunk-6WF7NKYL.js";
import { b as d } from "/build/_shared/chunk-33FVQFAB.js";
import { c as b, d as c } from "/build/_shared/chunk-ASHX7EDV.js";
import {
  C as y,
  G as N,
  h as P,
  k as A,
} from "/build/_shared/chunk-KLFOMCVP.js";
import { b as x, c as u } from "/build/_shared/chunk-P4KF3DFI.js";
import { d as l } from "/build/_shared/chunk-G5WX4PPA.js";
var p = l(x());
var r = l(u());
function v(e) {
  let o = d(),
    m = w(),
    f = b([]);
  (0, p.useEffect)(() => {
    let n = new AbortController(),
      a = n.signal;
    return (
      fetch("/problem/data", { signal: a })
        .then((s) => s.json())
        .then((s) => (f.value = s.problems)),
      () => n.abort()
    );
  }, []);
  let i = b(""),
    h = c(() => f.value.filter(({ id: n }) => !e.existProblem.includes(n))),
    E = c(() =>
      h.value.filter(
        ({ title: n, tags: a, id: s }) =>
          s.toString().includes(i.value) ||
          n.includes(i.value) ||
          a.some(({ name: C }) => C.includes(i.value))
      )
    ),
    g = c(() => {
      let n = i.value.indexOf(".");
      if (n === -1) return 0;
      let a = parseInt(i.value.slice(0, n));
      return h.value.some((s) => s.id === a) ? a : 0;
    });
  return (
    (0, p.useEffect)(() => {
      o.actionSuccess &&
        ((i.value = ""), m.success("\u66F4\u65B0\u6210\u529F"));
    }, [o.actionSuccess]),
    (0, r.jsxs)(o.Form, {
      method: "post",
      className: "not-prose inline-flex gap-4",
      children: [
        (0, r.jsx)("input", {
          type: "hidden",
          name: "pid",
          value: g.value,
          required: !0,
        }),
        (0, r.jsxs)("label", {
          className: "input-group",
          children: [
            (0, r.jsxs)("div", {
              className: "dropdown",
              children: [
                (0, r.jsx)("input", {
                  className: "input input-bordered",
                  placeholder: "\u641C\u7D22\u9898\u76EE...",
                  list: "search-problem",
                  value: i.value,
                  disabled: o.isRunning,
                  onChange: (n) => (i.value = n.target.value),
                }),
                (0, r.jsx)("datalist", {
                  id: "search-problem",
                  children: E.value.map(({ id: n, title: a }) =>
                    (0, r.jsx)("option", { value: `${n}. ${a}` }, n)
                  ),
                }),
              ],
            }),
            (0, r.jsxs)("button", {
              className: "btn gap-2",
              type: "submit",
              name: "_action",
              value: e.createAction,
              disabled: o.isRunning || !g,
              children: [(0, r.jsx)(y, {}), "\u6DFB\u52A0"],
            }),
          ],
        }),
      ],
    })
  );
}
var t = l(u());
function O(e) {
  let o = d();
  return (0, t.jsxs)(o.Form, {
    method: "post",
    className: "inline-flex gap-2",
    children: [
      (0, t.jsx)("input", { type: "hidden", name: "pid", value: e.pid }),
      (0, t.jsx)("button", {
        className: "btn btn-primary btn-error btn-square btn-sm",
        type: "submit",
        name: "_action",
        value: e.deleteAction,
        disabled: o.isRunning,
        children: (0, t.jsx)(N, {}),
      }),
      (0, t.jsx)("button", {
        className: "btn btn-ghost btn-square btn-sm",
        type: "submit",
        name: "_action",
        value: e.moveUpAction,
        disabled: e.first || o.isRunning,
        children: (0, t.jsx)(A, {}),
      }),
      (0, t.jsx)("button", {
        className: "btn btn-ghost btn-square btn-sm",
        type: "submit",
        name: "_action",
        value: e.moveDownAction,
        disabled: e.last || o.isRunning,
        children: (0, t.jsx)(P, {}),
      }),
    ],
  });
}
function T(e) {
  return (0, t.jsxs)(t.Fragment, {
    children: [
      (0, t.jsx)(v, {
        createAction: e.createAction,
        existProblem: e.problems.map(({ id: o }) => o),
      }),
      (0, t.jsxs)("table", {
        className: "not-prose table w-full",
        children: [
          (0, t.jsx)("thead", {
            children: (0, t.jsxs)("tr", {
              children: [
                (0, t.jsx)("th", { className: "w-16" }),
                (0, t.jsx)("th", { children: "\u516C\u5171\u9898\u76EE" }),
                (0, t.jsx)("th", {
                  className: "w-16 text-center",
                  children: "\u64CD\u4F5C",
                }),
              ],
            }),
          }),
          (0, t.jsx)("tbody", {
            children: e.problems.map((o, m) =>
              (0, t.jsxs)(
                "tr",
                {
                  children: [
                    (0, t.jsx)("th", {
                      className: "text-center",
                      children: o.id,
                    }),
                    (0, t.jsx)("td", {
                      children: (0, t.jsx)(D, { problem: o }),
                    }),
                    (0, t.jsx)("td", {
                      children: (0, t.jsx)(O, {
                        pid: o.id,
                        first: m === 0,
                        last: m === e.problems.length - 1,
                        deleteAction: e.deleteAction,
                        moveUpAction: e.moveUpAction,
                        moveDownAction: e.moveDownAction,
                      }),
                    }),
                  ],
                },
                o.id
              )
            ),
          }),
        ],
      }),
    ],
  });
}
export { T as a };
