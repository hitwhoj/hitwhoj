import { a as M } from "/build/_shared/chunk-WH23UYJB.js";
import { a as C } from "/build/_shared/chunk-4B3SKNWL.js";
import { f as g } from "/build/_shared/chunk-ANJHU2RD.js";
import { a as r } from "/build/_shared/chunk-BQKSLDHG.js";
import { b as E } from "/build/_shared/chunk-WF674727.js";
import { a as N, b as P } from "/build/_shared/chunk-ZPF2YCTJ.js";
import { c as y } from "/build/_shared/chunk-33FVQFAB.js";
import { d as n } from "/build/_shared/chunk-ASHX7EDV.js";
import { F as T, t as v } from "/build/_shared/chunk-KLFOMCVP.js";
import { a as O } from "/build/_shared/chunk-XIHPQXCX.js";
import {
  a as u,
  c as f,
  e as s,
  f as d,
} from "/build/_shared/chunk-IYNQWWEV.js";
import { b as L, c as b } from "/build/_shared/chunk-P4KF3DFI.js";
import { d as i } from "/build/_shared/chunk-G5WX4PPA.js";
var I = i(O());
var m = i(L());
var e = i(b());
var S = ({ data: o }) => ({
  title: `\u6BD4\u8D5B: ${o?.contest.title} - HITwh OJ`,
});
function R() {
  let o = y(),
    a = n(() => o.value.contest),
    l = n(() => o.value.hasEditPerm),
    _ = n(() => o.value.hasViewProblemPerm),
    h = n(() => o.value.isContestants),
    { contestId: c } = f(),
    p = E();
  return (
    (0, m.useEffect)(() => {
      let t = r(`/contest/${c}/clarification/events/resolve`).subscribe(() =>
        p.info(
          "\u60A8\u63D0\u4EA4\u7684\u53CD\u9988\u5DF2\u7ECF\u88AB\u6807\u8BB0\u4E3A\u89E3\u51B3"
        )
      );
      return () => t.unsubscribe();
    }, []),
    (0, m.useEffect)(() => {
      let t = r(`/contest/${c}/clarification/events/reply`).subscribe(
        ({ content: w }) =>
          p.info(`\u6536\u5230\u65B0\u7684\u53CD\u9988\u56DE\u590D\uFF1A${w}`)
      );
      return () => t.unsubscribe();
    }, []),
    (0, m.useEffect)(() => {
      let t = r(`/contest/${c}/clarification/events/assign`).subscribe(() =>
        p.info(
          "\u60A8\u63D0\u4EA4\u7684\u53CD\u9988\u6B63\u5728\u88AB\u5BA1\u7406"
        )
      );
      return () => t.unsubscribe();
    }, []),
    (0, e.jsxs)(e.Fragment, {
      children: [
        (0, e.jsxs)("h1", {
          className: "flex gap-4",
          children: [
            (0, e.jsx)(g, { className: "flex-shrink-0" }),
            (0, e.jsx)("span", { children: a.value.title }),
          ],
        }),
        (0, e.jsxs)("p", {
          className: "not-prose flex flex-wrap gap-2",
          children: [
            (0, e.jsx)(C, {
              beginTime: a.value.beginTime,
              endTime: a.value.endTime,
            }),
            (0, e.jsx)(M, { system: a.value.system }),
            a.value.private &&
              (0, e.jsxs)("span", {
                className: "badge badge-warning gap-1",
                children: [
                  (0, e.jsx)(v, {}),
                  (0, e.jsx)("span", { children: "\u9690\u85CF" }),
                ],
              }),
            a.value.tags.map(({ name: t }) =>
              (0, e.jsxs)(
                d,
                {
                  className: "badge gap-1",
                  to: `/contest/tag/${t}`,
                  children: [
                    (0, e.jsx)(T, {}),
                    (0, e.jsx)("span", { children: t }),
                  ],
                },
                t
              )
            ),
          ],
        }),
        (0, e.jsxs)("p", {
          className: "not-prose tabs tabs-boxed bg-base-100",
          children: [
            (0, e.jsx)(s, {
              className: "tab",
              to: "desc",
              children: "\u8BE6\u60C5",
            }),
            (_.value || h.value) &&
              (0, e.jsx)(s, {
                className: "tab",
                to: "problem",
                children: "\u9898\u76EE",
              }),
            l.value &&
              (0, e.jsx)(s, {
                className: "tab",
                to: "edit",
                children: "\u7F16\u8F91",
              }),
            l.value &&
              (0, e.jsx)(s, {
                className: "tab",
                to: "members",
                children: "\u6210\u5458",
              }),
            (0, e.jsx)(s, {
              className: "tab",
              to: "board",
              children: "\u6392\u884C\u699C",
            }),
            (0, e.jsx)(s, {
              className: "tab",
              to: "clarification",
              children: "\u53CD\u9988",
            }),
            (0, e.jsx)(s, {
              className: "tab",
              to: `/record?cid=${a.value.id}`,
              children: "\u63D0\u4EA4\u8BB0\u5F55",
            }),
          ],
        }),
        (0, e.jsx)(u, {}),
      ],
    })
  );
}
export { P as CatchBoundary, N as ErrorBoundary, R as default, S as meta };
