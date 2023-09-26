import { t as o } from "/build/_shared/chunk-KLFOMCVP.js";
import { f as r } from "/build/_shared/chunk-IYNQWWEV.js";
import { c as n } from "/build/_shared/chunk-P4KF3DFI.js";
import { d as t } from "/build/_shared/chunk-G5WX4PPA.js";
var i = t(n());
function m({ problem: e }) {
  return (0, i.jsxs)(r, {
    to: `/problem/${e.id}`,
    className: "link inline-flex items-center gap-2",
    children: [
      (0, i.jsx)("span", { children: e.title }),
      e.private && (0, i.jsx)(o, { className: "inline-block" }),
    ],
  });
}
export { m as a };
