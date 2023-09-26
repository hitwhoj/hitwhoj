import { a as G } from "/build/_shared/chunk-MDGTQBQV.js";
import { a as D } from "/build/_shared/chunk-MVNZUVNE.js";
import { a as z } from "/build/_shared/chunk-LGBCQJ4S.js";
import { a as V } from "/build/_shared/chunk-RE2DFUAK.js";
import { a as F } from "/build/_shared/chunk-PUHPCD76.js";
import "/build/_shared/chunk-7WG4REHK.js";
import { b as _ } from "/build/_shared/chunk-ANJHU2RD.js";
import { a as I } from "/build/_shared/chunk-BQKSLDHG.js";
import { a as A } from "/build/_shared/chunk-XCRF7VPJ.js";
import "/build/_shared/chunk-C6VOOSKL.js";
import { b as M } from "/build/_shared/chunk-WF674727.js";
import "/build/_shared/chunk-YFBG3YAE.js";
import { a as B } from "/build/_shared/chunk-KUDQOE27.js";
import "/build/_shared/chunk-NPZ34MRD.js";
import "/build/_shared/chunk-5CMXDJBZ.js";
import "/build/_shared/chunk-M6DBAY7B.js";
import { a as x, b as $ } from "/build/_shared/chunk-ZPF2YCTJ.js";
import { a as C, c as O, d as L } from "/build/_shared/chunk-33FVQFAB.js";
import { c as E, d as f } from "/build/_shared/chunk-ASHX7EDV.js";
import { B as T, i as P } from "/build/_shared/chunk-KLFOMCVP.js";
import { a as J } from "/build/_shared/chunk-XIHPQXCX.js";
import {
  c as N,
  f as p,
  j as k,
  k as S,
} from "/build/_shared/chunk-IYNQWWEV.js";
import { b as H, c as R } from "/build/_shared/chunk-P4KF3DFI.js";
import { d as s } from "/build/_shared/chunk-G5WX4PPA.js";
var q = s(J()),
  K = s(z()),
  n = s(H());
var Q = s(G());
var e = s(R());
var X = ({ data: i, params: a }) => ({
  title: `${a.rank} - ${i?.problem.title} - HITwh OJ`,
});
function U() {
  let i = O(),
    a = f(() => i.value.problem),
    y = f(() => i.value.contest),
    l = L(() => i.value.records),
    { contestId: g, rank: u } = N(),
    v = C(),
    b = E(!1),
    W = M();
  (0, n.useEffect)(() => {
    v.actionSuccess && (W.success("\u63D0\u4EA4\u6210\u529F"), (b.value = !0));
  }, [v.actionSuccess]);
  let o = E("cpp"),
    c = E(`#include <bits/stdc++.h>
using namespace std;

int main() {
  int a, b;
  cin >> a >> b;
  cout << a + b << endl;
  return 0;
}
`);
  (0, n.useEffect)(() => {
    let t = localStorage.getItem(`C#${g}#${u}#language`);
    t && (o.value = t);
    let r = localStorage.getItem(`C#${g}#${u}#code`);
    r && (c.value = r);
  }, []),
    S(
      (0, n.useCallback)(() => {
        localStorage.setItem(`C#${g}#${u}#language`, o.value),
          localStorage.setItem(`C#${g}#${u}#code`, c.value);
      }, [o.value, c.value])
    );
  let w = f(() => {
      let t = new Date();
      return {
        isNotStarted: t < new Date(y.value.beginTime),
        isEnded: t > new Date(y.value.endTime),
      };
    }),
    h = f(() =>
      l.value
        .filter(
          (t) =>
            t.status === "Pending" ||
            t.status === "Compiling" ||
            t.status === "Judging" ||
            t.status === "Running"
        )
        .map(({ id: t }) => t)
    );
  return (
    (0, n.useEffect)(() => {
      let t = h.value.map((r) =>
        I(`/record/${r}/events`).subscribe((m) => {
          let d = l.value.find((j) => j.id === m.id);
          d &&
            ((d.time = m.time),
            (d.score = m.score),
            (d.memory = m.memory),
            (d.status = m.status)),
            (l.value = [...l.value]);
        })
      );
      return () => {
        t.forEach((r) => r.unsubscribe());
      };
    }, [h.value.join(" ")]),
    (0, e.jsxs)(F, {
      visible: !0,
      className: "drawer drawer-end bg-base-100 h-full w-full",
      children: [
        (0, e.jsx)("input", {
          type: "checkbox",
          id: "records",
          className: "drawer-toggle",
          checked: b.value,
          readOnly: !0,
        }),
        (0, e.jsxs)("div", {
          className: "drawer-content grid grid-cols-2 grid-rows-1",
          children: [
            (0, e.jsxs)("div", {
              className: "flex flex-col overflow-y-auto",
              children: [
                (0, e.jsx)("nav", {
                  className: "bg-base-100 sticky top-0 z-10 flex-shrink-0 p-4",
                  children: (0, e.jsxs)(p, {
                    className: "btn btn-ghost gap-2",
                    to: `/contest/${y.value.id}/problem`,
                    children: [
                      (0, e.jsx)(P, { className: "" }),
                      (0, e.jsx)("span", {
                        children: "\u8FD4\u56DE\u9898\u76EE\u5217\u8868",
                      }),
                    ],
                  }),
                }),
                (0, e.jsxs)("article", {
                  className: "p-4",
                  children: [
                    (0, e.jsxs)("h1", { children: [u, " - ", a.value.title] }),
                    (0, e.jsx)("p", {
                      children: (0, e.jsx)(D, {
                        time: a.value.timeLimit,
                        memory: a.value.memoryLimit,
                      }),
                    }),
                    w.value.isNotStarted &&
                      (0, e.jsx)("p", {
                        className: "alert alert-warning shadow-lg",
                        children: "\u6BD4\u8D5B\u8FD8\u6CA1\u6709\u5F00\u59CB",
                      }),
                    w.value.isEnded &&
                      (0, e.jsx)("p", {
                        className: "alert alert-warning shadow-lg",
                        children:
                          "\u6BD4\u8D5B\u5DF2\u7ECF\u7ED3\u675F\uFF0C\u672C\u9875\u9762\u4EC5\u4F9B\u67E5\u770B",
                      }),
                    (0, e.jsx)(B, { children: a.value.description }),
                    a.value.files.length > 0 &&
                      (0, e.jsxs)(e.Fragment, {
                        children: [
                          (0, e.jsx)("h2", {
                            children:
                              "\u53EF\u4F9B\u4E0B\u8F7D\u7684\u6587\u4EF6",
                          }),
                          (0, e.jsx)("ol", {
                            children: a.value.files.map((t) =>
                              (0, e.jsx)(
                                "li",
                                {
                                  children: (0, e.jsx)(p, {
                                    to: `/file/${t.id}`,
                                    target: "_blank",
                                    children: t.filename,
                                  }),
                                },
                                t.id
                              )
                            ),
                          }),
                        ],
                      }),
                  ],
                }),
              ],
            }),
            (0, e.jsxs)("div", {
              className: "flex flex-col",
              children: [
                (0, e.jsx)(A, { code: c, language: o.value }),
                (0, e.jsxs)(k, {
                  method: "post",
                  className: "flex flex-shrink-0 justify-between p-2",
                  children: [
                    (0, e.jsx)("textarea", {
                      name: "code",
                      hidden: !0,
                      value: c.value,
                      readOnly: !0,
                    }),
                    (0, e.jsx)("div", {
                      children: (0, e.jsxs)("select", {
                        className: "select select-bordered",
                        name: "language",
                        value: o.value,
                        onChange: (t) => (o.value = t.currentTarget.value),
                        disabled: v.isRunning,
                        children: [
                          (0, e.jsx)("option", { value: "c", children: "C" }),
                          (0, e.jsx)("option", {
                            value: "cpp",
                            children: "C++",
                          }),
                          (0, e.jsx)("option", {
                            value: "java",
                            children: "Java",
                          }),
                        ],
                      }),
                    }),
                    (0, e.jsxs)("div", {
                      className: "inline-flex gap-4",
                      children: [
                        (0, e.jsxs)("button", {
                          className: "btn btn-ghost gap-2",
                          type: "button",
                          onClick: () => (b.value = !0),
                          children: [
                            (0, e.jsx)(_, {}),
                            (0, e.jsx)("span", {
                              children: "\u67E5\u770B\u63D0\u4EA4\u8BB0\u5F55",
                            }),
                          ],
                        }),
                        !w.value.isNotStarted && !w.value.isEnded
                          ? (0, e.jsxs)("button", {
                              className: "btn btn-primary gap-2",
                              type: "submit",
                              disabled: v.isRunning,
                              children: [
                                (0, e.jsx)(T, { className: "rotate-90" }),
                                (0, e.jsx)("span", {
                                  children: "\u63D0\u4EA4",
                                }),
                              ],
                            })
                          : (0, e.jsx)(p, {
                              className: "btn btn-primary",
                              to: `/problem/${a.value.id}`,
                              children:
                                "\u8DF3\u8F6C\u5230\u9898\u76EE\u9875\u9762",
                            }),
                      ],
                    }),
                  ],
                }),
              ],
            }),
          ],
        }),
        (0, e.jsxs)("div", {
          className: "drawer-side",
          children: [
            (0, e.jsx)("label", {
              className: "drawer-overlay",
              onClick: () => (b.value = !1),
            }),
            (0, e.jsxs)("aside", {
              className: "not-prose bg-base-200 p-4",
              children: [
                (0, e.jsx)("h3", {
                  className: "text-lg font-bold",
                  children: "\u63D0\u4EA4\u8BB0\u5F55",
                }),
                (0, e.jsx)("ul", {
                  className: "menu menu-compact my-4 w-96",
                  children: l.value.map((t) =>
                    (0, e.jsx)(
                      "li",
                      {
                        children: (0, e.jsx)(p, {
                          to: `/record/${t.id}`,
                          className: "block p-4",
                          target: "_blank",
                          children: (0, e.jsx)(V, { status: t.status }),
                        }),
                      },
                      t.id
                    )
                  ),
                }),
              ],
            }),
          ],
        }),
      ],
    })
  );
}
export { $ as CatchBoundary, x as ErrorBoundary, U as default, X as meta };
