import { m as e, n as i } from "/build/_shared/chunk-5CMXDJBZ.js";
import { b as n, c as o } from "/build/_shared/chunk-P4KF3DFI.js";
import { d as r } from "/build/_shared/chunk-G5WX4PPA.js";
var g = r(n()),
  l = r(o());
function s({ children: h, language: t }) {
  let p = i.highlight(t, h);
  return (0, l.jsx)("pre", {
    children: (0, l.jsx)("code", {
      className: `hljs language-${t}`,
      children: e(g.createElement, p),
    }),
  });
}
export { s as a };
