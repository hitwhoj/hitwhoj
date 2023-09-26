import { f as a } from "/build/_shared/chunk-ANJHU2RD.js";
import { c as o } from "/build/_shared/chunk-P4KF3DFI.js";
import { d as s } from "/build/_shared/chunk-G5WX4PPA.js";
var e = s(o()),
  n = {
    ACM: "badge-primary",
    OI: "badge-secondary",
    IOI: "badge-accent",
    Homework: "badge-neutral",
  };
function p({ system: t }) {
  return (0, e.jsxs)("span", {
    className: `badge ${n[t]} gap-1`,
    children: [(0, e.jsx)(a, {}), (0, e.jsx)("span", { children: t })],
  });
}
export { p as a };
