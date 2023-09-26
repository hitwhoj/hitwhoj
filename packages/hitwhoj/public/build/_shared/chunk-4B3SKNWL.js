import { c as a } from "/build/_shared/chunk-P4KF3DFI.js";
import { d as n } from "/build/_shared/chunk-G5WX4PPA.js";
var r = n(a());
function d({ beginTime: s, endTime: o }) {
  let e = new Date(s),
    t = new Date(o),
    g =
      e > new Date()
        ? "\u672A\u5F00\u59CB"
        : t < new Date()
        ? "\u5DF2\u7ED3\u675F"
        : "\u8FDB\u884C\u4E2D",
    c =
      e > new Date()
        ? "badge-primary"
        : t < new Date()
        ? "badge-secondary"
        : "badge-accent";
  return (0, r.jsx)("span", { className: `badge ${c}`, children: g });
}
export { d as a };
