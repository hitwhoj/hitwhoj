import {
  a as n,
  c as N,
  d as w,
  e as g,
} from "/build/_shared/chunk-7WG4REHK.js";
import { a as f } from "/build/_shared/chunk-KUDQOE27.js";
import "/build/_shared/chunk-NPZ34MRD.js";
import "/build/_shared/chunk-5CMXDJBZ.js";
import { a as v, b as p } from "/build/_shared/chunk-ZPF2YCTJ.js";
import { c as u } from "/build/_shared/chunk-33FVQFAB.js";
import { d as s } from "/build/_shared/chunk-ASHX7EDV.js";
import { e as c, m as r } from "/build/_shared/chunk-KLFOMCVP.js";
import { a as h } from "/build/_shared/chunk-XIHPQXCX.js";
import { f as d } from "/build/_shared/chunk-IYNQWWEV.js";
import { c as m } from "/build/_shared/chunk-P4KF3DFI.js";
import { d as o } from "/build/_shared/chunk-G5WX4PPA.js";
var y = o(h());
var t = o(m());
var C = ({ data: a }) => ({
  title: `\u6BD4\u8D5B: ${a?.contest.title} - HITwh OJ`,
  description: a?.contest.description,
});
function T() {
  let a = u(),
    e = s(() => a.value.contest),
    i = s(() => a.value.registered),
    l = s(() => a.value.status);
  return (0, t.jsxs)(t.Fragment, {
    children: [
      (0, t.jsxs)("div", {
        className: "stats bg-base-200 text-base-content w-full",
        children: [
          (0, t.jsxs)("div", {
            className: "stat",
            children: [
              (0, t.jsx)("div", {
                className: "stat-figure text-secondary",
                children: (0, t.jsx)(r, { className: "h-8 w-8" }),
              }),
              (0, t.jsx)("div", {
                className: "stat-title",
                children: "\u5F00\u59CB\u65F6\u95F4",
              }),
              (0, t.jsx)("div", {
                className: "stat-value",
                children: g(e.value.beginTime),
              }),
              (0, t.jsx)("div", {
                className: "stat-desc",
                children: n(e.value.beginTime),
              }),
            ],
          }),
          (0, t.jsxs)("div", {
            className: "stat",
            children: [
              (0, t.jsx)("div", {
                className: "stat-figure text-secondary",
                children: (0, t.jsx)(r, { className: "h-8 w-8" }),
              }),
              (0, t.jsx)("div", {
                className: "stat-title",
                children: "\u6BD4\u8D5B\u65F6\u957F",
              }),
              (0, t.jsx)("div", {
                className: "stat-value",
                children: w(
                  new Date(e.value.endTime).getTime() -
                    new Date(e.value.beginTime).getTime()
                ),
              }),
              (0, t.jsx)("div", {
                className: "stat-desc",
                children: n(e.value.endTime),
              }),
            ],
          }),
          (0, t.jsxs)("div", {
            className: "stat",
            children: [
              (0, t.jsx)("div", {
                className: "stat-figure text-secondary",
                children: (0, t.jsx)(c, { className: "h-8 w-8" }),
              }),
              (0, t.jsx)("div", {
                className: "stat-title",
                children: "\u9898\u76EE\u6570\u91CF",
              }),
              (0, t.jsx)("div", {
                className: "stat-value",
                children: N(e.value._count.problems),
              }),
              (0, t.jsx)("div", {
                className: "stat-desc",
                children: "\u8FD9\u91CC\u53EF\u4EE5\u8BF4\u4EC0\u4E48",
              }),
            ],
          }),
        ],
      }),
      (0, t.jsx)(f, { children: e.value.description }),
      i.value === "Mod"
        ? (0, t.jsx)("p", {
            className: "alert alert-info shadow-lg",
            children:
              "\u60A8\u5DF2\u7ECF\u662F\u6BD4\u8D5B\u7684\u7BA1\u7406\u5458",
          })
        : i.value === "Jury"
        ? (0, t.jsx)("p", {
            className: "alert alert-info shadow-lg",
            children: "\u60A8\u5DF2\u7ECF\u662F\u6BD4\u8D5B\u7684\u88C1\u5224",
          })
        : i.value === "Contestant"
        ? (0, t.jsx)("p", {
            className: "alert alert-info shadow-lg",
            children: "\u60A8\u5DF2\u7ECF\u62A5\u540D\u4E86\u8BE5\u6BD4\u8D5B",
          })
        : e.value.private
        ? (0, t.jsx)("p", {
            className: "alert alert-info shadow-lg",
            children: "\u65E0\u6CD5\u62A5\u540D\u79C1\u6709\u6BD4\u8D5B",
          })
        : l.value === "Running" && !e.value.allowJoinAfterStart
        ? (0, t.jsx)("p", {
            className: "alert alert-info shadow-lg",
            children:
              "\u8BE5\u6BD4\u8D5B\u4E0D\u5141\u8BB8\u4E2D\u9014\u52A0\u5165",
          })
        : l.value === "Ended"
        ? (0, t.jsx)("p", {
            className: "alert alert-info shadow-lg",
            children: "\u6BD4\u8D5B\u5DF2\u7ECF\u7ED3\u675F",
          })
        : e.value.registrationType === "Disallow"
        ? (0, t.jsx)("p", {
            className: "alert alert-info shadow-lg",
            children: "\u62A5\u540D\u5DF2\u7ECF\u5173\u95ED",
          })
        : (0, t.jsx)(d, {
            className: "btn btn-primary",
            to: `/contest/${e.value.id}/register`,
            children: "\u62A5\u540D\u6BD4\u8D5B",
          }),
    ],
  });
}
export { p as CatchBoundary, v as ErrorBoundary, T as default, C as meta };
