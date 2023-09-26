import { a as P, b as S } from "/build/_shared/chunk-ZPF2YCTJ.js";
import { c as x } from "/build/_shared/chunk-33FVQFAB.js";
import { c as w, d as v, e as C } from "/build/_shared/chunk-ASHX7EDV.js";
import { K as h, d as f, g as p } from "/build/_shared/chunk-KLFOMCVP.js";
import { a as R } from "/build/_shared/chunk-XIHPQXCX.js";
import { b as l, f as u } from "/build/_shared/chunk-IYNQWWEV.js";
import { b as N, c as m } from "/build/_shared/chunk-P4KF3DFI.js";
import { d as i } from "/build/_shared/chunk-G5WX4PPA.js";
var T = i(R());
var y = i(N());
var t = i(m());
function b(n) {
  let s = w(new Date());
  (0, y.useEffect)(() => {
    let e = setInterval(() => (s.value = new Date()), 1e3);
    return () => clearInterval(e);
  }, []);
  let o = v(() => {
    let e = n.date.getTime() - s.value.getTime(),
      a = Math.floor(e / 1e3 / 60 / 60 / 24),
      r = Math.floor(e / 1e3 / 60 / 60) % 24,
      d = Math.floor(e / 1e3 / 60) % 60,
      c = Math.floor(e / 1e3) % 60,
      g = e < 0;
    return { day: a, hour: r, minute: d, second: c, finished: g };
  });
  return (
    C(() => {
      o.value.finished && n.onFinish();
    }),
    (0, t.jsxs)("div", {
      className: "flex gap-5",
      children: [
        (0, t.jsxs)("div", {
          children: [
            (0, t.jsx)("span", {
              className: "countdown font-mono text-4xl",
              children: (0, t.jsx)("span", {
                style: { "--value": o.value.day },
              }),
            }),
            "days",
          ],
        }),
        (0, t.jsxs)("div", {
          children: [
            (0, t.jsx)("span", {
              className: "countdown font-mono text-4xl",
              children: (0, t.jsx)("span", {
                style: { "--value": o.value.hour },
              }),
            }),
            "hours",
          ],
        }),
        (0, t.jsxs)("div", {
          children: [
            (0, t.jsx)("span", {
              className: "countdown font-mono text-4xl",
              children: (0, t.jsx)("span", {
                style: { "--value": o.value.minute },
              }),
            }),
            "min",
          ],
        }),
        (0, t.jsxs)("div", {
          children: [
            (0, t.jsx)("span", {
              className: "countdown font-mono text-4xl",
              children: (0, t.jsx)("span", {
                style: { "--value": o.value.second },
              }),
            }),
            "sec",
          ],
        }),
      ],
    })
  );
}
function E() {
  let n = x(),
    s = l();
  return n.value.countdown
    ? (0, t.jsxs)("div", {
        className: "mx-auto w-full max-w-sm text-center",
        children: [
          (0, t.jsx)("h2", {
            children: "\u8DDD\u79BB\u6BD4\u8D5B\u5F00\u59CB\u8FD8\u6709",
          }),
          (0, t.jsx)(b, {
            date: new Date(n.value.contest.beginTime),
            onFinish: () => s("."),
          }),
        ],
      })
    : (0, t.jsxs)("table", {
        className: "not-prose table w-full",
        children: [
          (0, t.jsx)("thead", {
            children: (0, t.jsxs)("tr", {
              children: [
                (0, t.jsx)("th", { className: "w-16" }),
                (0, t.jsx)("th", { children: "\u9898\u76EE" }),
                (0, t.jsx)("th", { children: "\u72B6\u6001" }),
              ],
            }),
          }),
          (0, t.jsx)("tbody", {
            children: n.value.contest.problems.map(
              ({ rank: o, problem: e }) => {
                let a = String.fromCharCode(64 + o),
                  r = e.relatedRecords.some(
                    ({ status: c }) => c === "Accepted"
                  ),
                  d = e.relatedRecords.length > 0 && !r;
                return (0, t.jsxs)(
                  "tr",
                  {
                    children: [
                      (0, t.jsx)("th", {
                        className: "text-center",
                        children: a,
                      }),
                      (0, t.jsx)("td", {
                        children: (0, t.jsxs)(u, {
                          className: "link inline-flex items-center gap-2",
                          to: a,
                          children: [
                            (0, t.jsx)("span", { children: e.title }),
                            (0, t.jsx)(f, {}),
                          ],
                        }),
                      }),
                      (0, t.jsxs)("td", {
                        children: [
                          r &&
                            (0, t.jsx)(p, {
                              className: "text-success h-6 w-6",
                            }),
                          d &&
                            (0, t.jsx)(h, { className: "text-error h-6 w-6" }),
                        ],
                      }),
                    ],
                  },
                  o
                );
              }
            ),
          }),
        ],
      });
}
export { S as CatchBoundary, P as ErrorBoundary, E as default };
