import { a as N } from "/build/_shared/chunk-RE2DFUAK.js";
import { a as x } from "/build/_shared/chunk-QTGCURF2.js";
import { a as v, e as g } from "/build/_shared/chunk-7WG4REHK.js";
import "/build/_shared/chunk-ANJHU2RD.js";
import "/build/_shared/chunk-F7TWK4YF.js";
import { a as h } from "/build/_shared/chunk-TWYVBWDW.js";
import { a as b } from "/build/_shared/chunk-6WF7NKYL.js";
import { a as p, b as f } from "/build/_shared/chunk-ZPF2YCTJ.js";
import { c } from "/build/_shared/chunk-33FVQFAB.js";
import { d as a } from "/build/_shared/chunk-ASHX7EDV.js";
import { u } from "/build/_shared/chunk-KLFOMCVP.js";
import { a as R } from "/build/_shared/chunk-XIHPQXCX.js";
import { f as n, j as d } from "/build/_shared/chunk-IYNQWWEV.js";
import { c as m } from "/build/_shared/chunk-P4KF3DFI.js";
import { d as l } from "/build/_shared/chunk-G5WX4PPA.js";
var k = l(R());
var e = l(m()),
  A = 15;
var B = () => ({ title: "\u8BC4\u6D4B\u8BB0\u5F55 - HITwh OJ" });
function y() {
  let r = c(),
    P = a(() => r.value.records),
    w = a(() => r.value.totalRecords),
    I = a(() => r.value.currentPage),
    o = a(() => r.value.uid),
    s = a(() => r.value.pid),
    i = a(() => r.value.cid),
    L = a(() => Math.ceil(w.value / A));
  return (0, e.jsxs)(e.Fragment, {
    children: [
      (0, e.jsx)("h1", { children: "\u8BC4\u6D4B\u8BB0\u5F55" }),
      (0, e.jsxs)(d, {
        className: "flex flex-row flex-wrap items-end justify-between gap-4",
        method: "get",
        action: "/record",
        children: [
          (0, e.jsxs)("div", {
            className: "form-control flex-1",
            children: [
              (0, e.jsx)("label", {
                className: "label",
                children: (0, e.jsx)("span", {
                  className: "label-text",
                  children: "\u7531\u7528\u6237",
                }),
              }),
              (0, e.jsx)("input", {
                type: "text",
                className: "input input-bordered",
                name: "uid",
                defaultValue: o.value || "",
              }),
            ],
          }),
          (0, e.jsxs)("div", {
            className: "form-control flex-1",
            children: [
              (0, e.jsx)("label", {
                className: "label",
                children: (0, e.jsx)("span", {
                  className: "label-text",
                  children: "\u7531\u9898\u76EE",
                }),
              }),
              (0, e.jsx)("input", {
                type: "text",
                className: "input input-bordered",
                name: "pid",
                defaultValue: s.value || "",
              }),
            ],
          }),
          (0, e.jsxs)("div", {
            className: "form-control flex-1",
            children: [
              (0, e.jsx)("label", {
                className: "label",
                children: (0, e.jsx)("span", {
                  className: "label-text",
                  children: "\u7531\u6BD4\u8D5B",
                }),
              }),
              (0, e.jsx)("input", {
                type: "text",
                className: "input input-bordered",
                name: "cid",
                defaultValue: i.value || "",
              }),
            ],
          }),
          (0, e.jsxs)("button", {
            className: "btn btn-primary gap-2",
            children: [
              (0, e.jsx)(u, {}),
              (0, e.jsx)("span", { children: "\u8FC7\u6EE4" }),
            ],
          }),
        ],
      }),
      (0, e.jsxs)("table", {
        className: "not-prose table-compact table w-full",
        children: [
          (0, e.jsx)("thead", {
            children: (0, e.jsxs)("tr", {
              children: [
                (0, e.jsx)("th", { className: "w-16" }),
                (0, e.jsx)("th", { children: "\u72B6\u6001" }),
                (0, e.jsx)("th", {
                  className: "hidden md:table-cell",
                  children: "\u9898\u76EE",
                }),
                (0, e.jsx)("th", { children: "\u7528\u6237" }),
                (0, e.jsx)("th", {
                  className: "hidden xl:table-cell",
                  children: "\u63D0\u4EA4\u65F6\u95F4",
                }),
              ],
            }),
          }),
          (0, e.jsx)("tbody", {
            children: P.value.map((t) =>
              (0, e.jsxs)(
                "tr",
                {
                  children: [
                    (0, e.jsx)("th", {
                      className: "text-center",
                      children: t.id,
                    }),
                    (0, e.jsx)("td", {
                      children: (0, e.jsx)(n, {
                        to: `/record/${t.id}`,
                        children: (0, e.jsx)(N, { status: t.status }),
                      }),
                    }),
                    (0, e.jsx)("td", {
                      className: "hidden md:table-cell",
                      children: (0, e.jsx)(b, { problem: t.problem }),
                    }),
                    (0, e.jsx)("td", {
                      children: (0, e.jsx)(x, { user: t.submitter }),
                    }),
                    (0, e.jsx)("td", {
                      className: "hidden xl:table-cell",
                      children: (0, e.jsx)("span", {
                        className: "tooltip",
                        "data-tip": v(t.submittedAt),
                        children: g(t.submittedAt),
                      }),
                    }),
                  ],
                },
                t.id
              )
            ),
          }),
        ],
      }),
      (0, e.jsx)(h, {
        action: `/record?uid=${o.value || ""}&pid=${s.value || ""}&cid=${
          i.value || ""
        }`,
        totalPages: L.value,
        currentPage: I.value,
      }),
    ],
  });
}
export { f as CatchBoundary, p as ErrorBoundary, y as default, B as meta };
