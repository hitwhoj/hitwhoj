import { t as o } from "/build/_shared/chunk-KLFOMCVP.js";
import { f as r } from "/build/_shared/chunk-IYNQWWEV.js";
import { c as n } from "/build/_shared/chunk-P4KF3DFI.js";
import { d as t } from "/build/_shared/chunk-G5WX4PPA.js";
var e = t(n());
function m({ problemset: i }) {
  return (0, e.jsxs)(r, {
    className: "link inline-flex items-center gap-2",
    to: `/problemset/${i.id}`,
    children: [
      (0, e.jsx)("span", { children: i.title }),
      i.private && (0, e.jsx)(o, { className: "inline-block" }),
    ],
  });
}
export { m as a };
