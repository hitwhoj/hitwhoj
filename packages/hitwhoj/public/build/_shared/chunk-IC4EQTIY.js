import { a as p } from "/build/_shared/chunk-4B3SKNWL.js";
import { f as n } from "/build/_shared/chunk-ANJHU2RD.js";
import { t as m } from "/build/_shared/chunk-KLFOMCVP.js";
import { f as o } from "/build/_shared/chunk-IYNQWWEV.js";
import { c as r } from "/build/_shared/chunk-P4KF3DFI.js";
import { d as t } from "/build/_shared/chunk-G5WX4PPA.js";
var e = t(r());
function T({ contest: i }) {
  return (0, e.jsxs)(o, {
    className: "link inline-flex items-center gap-2",
    to: `/contest/${i.id}`,
    children: [
      (0, e.jsx)(n, {}),
      i.title,
      i.private && (0, e.jsx)(m, {}),
      (0, e.jsx)(p, { beginTime: i.beginTime, endTime: i.endTime }),
    ],
  });
}
export { T as a };
