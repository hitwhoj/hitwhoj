import { a as f } from "/build/_shared/chunk-TWYVBWDW.js";
import { a as c, b as u } from "/build/_shared/chunk-ZPF2YCTJ.js";
import { c as l } from "/build/_shared/chunk-33FVQFAB.js";
import { d as a } from "/build/_shared/chunk-ASHX7EDV.js";
import { C as i, I as p } from "/build/_shared/chunk-KLFOMCVP.js";
import { a as L } from "/build/_shared/chunk-XIHPQXCX.js";
import { f as o } from "/build/_shared/chunk-IYNQWWEV.js";
import { c as n } from "/build/_shared/chunk-P4KF3DFI.js";
import { d as r } from "/build/_shared/chunk-G5WX4PPA.js";
var T = r(L());
var s = r(n());
function d({ team: e }) {
  return (0, s.jsxs)(o, {
    className: "link inline-flex items-center gap-2",
    to: `/team/${e.id}`,
    children: [(0, s.jsx)(p, {}), (0, s.jsx)("span", { children: e.name })],
  });
}
var t = r(n()),
  b = () => ({ title: "\u56E2\u961F\u5217\u8868 - HITwh OJ" }),
  v = 15;
function h() {
  let e = l(),
    P = a(() => e.value.teams),
    g = a(() => e.value.totalTeams),
    y = a(() => e.value.currentPage),
    w = a(() => e.value.hasCreatePerm),
    k = a(() => Math.ceil(g.value / v));
  return (0, t.jsxs)(t.Fragment, {
    children: [
      (0, t.jsxs)("h1", {
        className: "flex items-center justify-between",
        children: [
          (0, t.jsx)("span", { children: "\u56E2\u961F\u5217\u8868" }),
          w.value &&
            (0, t.jsxs)(o, {
              className: "btn btn-primary",
              to: "new",
              children: [
                (0, t.jsx)(i, {}),
                (0, t.jsx)("span", { children: "\u65B0\u5EFA\u56E2\u961F" }),
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
                (0, t.jsx)("th", { children: "\u56E2\u961F" }),
              ],
            }),
          }),
          (0, t.jsx)("tbody", {
            children: P.value.map((m) =>
              (0, t.jsxs)(
                "tr",
                {
                  children: [
                    (0, t.jsx)("th", {
                      className: "text-center",
                      children: m.id,
                    }),
                    (0, t.jsx)("td", { children: (0, t.jsx)(d, { team: m }) }),
                  ],
                },
                m.id
              )
            ),
          }),
        ],
      }),
      (0, t.jsx)(f, {
        action: "/team",
        totalPages: k.value,
        currentPage: y.value,
      }),
    ],
  });
}
export { u as CatchBoundary, c as ErrorBoundary, h as default, b as meta };
