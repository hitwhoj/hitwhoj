import { a as d } from "/build/_shared/chunk-IC4EQTIY.js";
import { a as f } from "/build/_shared/chunk-WH23UYJB.js";
import "/build/_shared/chunk-4B3SKNWL.js";
import { a as s } from "/build/_shared/chunk-7WG4REHK.js";
import "/build/_shared/chunk-ANJHU2RD.js";
import { a as p } from "/build/_shared/chunk-TWYVBWDW.js";
import { a as c, b as u } from "/build/_shared/chunk-ZPF2YCTJ.js";
import { c as l } from "/build/_shared/chunk-33FVQFAB.js";
import { d as a } from "/build/_shared/chunk-ASHX7EDV.js";
import { C as i } from "/build/_shared/chunk-KLFOMCVP.js";
import { a as T } from "/build/_shared/chunk-XIHPQXCX.js";
import { f as n } from "/build/_shared/chunk-IYNQWWEV.js";
import { c as m } from "/build/_shared/chunk-P4KF3DFI.js";
import { d as r } from "/build/_shared/chunk-G5WX4PPA.js";
var v = r(T());
var t = r(m()),
  E = 15;
var b = () => ({ title: "\u6BD4\u8D5B\u5217\u8868 - HITwh OJ" });
function h() {
  let o = l(),
    P = a(() => o.value.contests),
    g = a(() => o.value.hasCreatePerm),
    w = a(() => o.value.totalTeams),
    y = a(() => o.value.currentPage),
    C = a(() => Math.ceil(w.value / E));
  return (0, t.jsxs)(t.Fragment, {
    children: [
      (0, t.jsxs)("h1", {
        className: "flex items-center justify-between",
        children: [
          (0, t.jsx)("span", { children: "\u6BD4\u8D5B\u5217\u8868" }),
          g.value &&
            (0, t.jsxs)(n, {
              className: "btn btn-primary gap-2",
              to: "/contest/new",
              children: [
                (0, t.jsx)(i, { className: "h-4 w-4" }),
                (0, t.jsx)("span", { children: "\u65B0\u5EFA\u6BD4\u8D5B" }),
              ],
            }),
        ],
      }),
      (0, t.jsxs)("table", {
        className: "not-prose table-compact table w-full",
        children: [
          (0, t.jsx)("thead", {
            children: (0, t.jsxs)("tr", {
              children: [
                (0, t.jsx)("th", { className: "w-16" }),
                (0, t.jsx)("th", { children: "\u6807\u9898" }),
                (0, t.jsx)("th", { children: "\u8D5B\u5236" }),
                (0, t.jsx)("th", { children: "\u5F00\u59CB\u65F6\u95F4" }),
                (0, t.jsx)("th", { children: "\u7ED3\u675F\u65F6\u95F4" }),
              ],
            }),
          }),
          (0, t.jsx)("tbody", {
            children: P.value.map((e) =>
              (0, t.jsxs)(
                "tr",
                {
                  children: [
                    (0, t.jsx)("th", {
                      className: "text-center",
                      children: e.id,
                    }),
                    (0, t.jsx)("td", {
                      children: (0, t.jsx)(d, { contest: e }),
                    }),
                    (0, t.jsx)("td", {
                      children: (0, t.jsx)(f, { system: e.system }),
                    }),
                    (0, t.jsx)("td", { children: s(e.beginTime) }),
                    (0, t.jsx)("td", { children: s(e.endTime) }),
                  ],
                },
                e.id
              )
            ),
          }),
        ],
      }),
      (0, t.jsx)(p, {
        action: "/contest",
        totalPages: C.value,
        currentPage: y.value,
      }),
    ],
  });
}
export { u as CatchBoundary, c as ErrorBoundary, h as default, b as meta };
