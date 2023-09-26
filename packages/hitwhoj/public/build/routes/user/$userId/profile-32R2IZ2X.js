import { a as d, b as i } from "/build/_shared/chunk-ZPF2YCTJ.js";
import { c as n } from "/build/_shared/chunk-33FVQFAB.js";
import { d as u } from "/build/_shared/chunk-ASHX7EDV.js";
import "/build/_shared/chunk-KLFOMCVP.js";
import { a as m } from "/build/_shared/chunk-XIHPQXCX.js";
import "/build/_shared/chunk-IYNQWWEV.js";
import { c as a } from "/build/_shared/chunk-P4KF3DFI.js";
import { d as o } from "/build/_shared/chunk-G5WX4PPA.js";
var l = o(m());
var t = o(a());
var f = ({ data: r }) => ({
  title: `\u7528\u6237: ${r?.user.nickname || r?.user.username} - HITwh OJ`,
  description: r?.user.bio,
});
function s() {
  let r = n(),
    e = u(() => r.value.user);
  return (0, t.jsxs)("table", {
    children: [
      (0, t.jsx)("thead", {
        children: (0, t.jsx)("tr", {
          children: (0, t.jsx)("th", { children: "\u7528\u6237\u8D44\u6599" }),
        }),
      }),
      (0, t.jsxs)("tbody", {
        children: [
          (0, t.jsxs)("tr", {
            children: [
              (0, t.jsx)("th", { children: "\u7528\u6237\u540D" }),
              (0, t.jsx)("td", { children: e.value.username }),
            ],
          }),
          (0, t.jsxs)("tr", {
            children: [
              (0, t.jsx)("th", { children: "\u7528\u6237\u6635\u79F0" }),
              (0, t.jsx)("td", { children: e.value.nickname || "-" }),
            ],
          }),
          (0, t.jsxs)("tr", {
            children: [
              (0, t.jsx)("th", { children: "\u7535\u5B50\u90AE\u7BB1" }),
              (0, t.jsx)("td", {
                children: e.value.email
                  ? (0, t.jsx)("a", {
                      href: `mailto:${e.value.email}`,
                      children: e.value.email,
                    })
                  : "-",
              }),
            ],
          }),
          (0, t.jsxs)("tr", {
            children: [
              (0, t.jsx)("th", { children: "\u5DE5\u4F5C\u5355\u4F4D" }),
              (0, t.jsx)("td", { children: e.value.department || "-" }),
            ],
          }),
          (0, t.jsxs)("tr", {
            children: [
              (0, t.jsx)("th", { children: "\u5B66\u53F7" }),
              (0, t.jsx)("td", { children: e.value.studentId || "-" }),
            ],
          }),
        ],
      }),
    ],
  });
}
export { i as CatchBoundary, d as ErrorBoundary, s as default, f as meta };
