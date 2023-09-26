import { c as p } from "/build/_shared/chunk-7WG4REHK.js";
import { l as s, m as i } from "/build/_shared/chunk-KLFOMCVP.js";
import { c as e } from "/build/_shared/chunk-P4KF3DFI.js";
import { d as o } from "/build/_shared/chunk-G5WX4PPA.js";
var n = o(e());
function t({ memory: r }) {
  return (0, n.jsxs)("span", {
    className: "badge gap-1",
    children: [
      (0, n.jsx)(s, {}),
      (0, n.jsx)("span", {
        children:
          r < 0
            ? "N/A"
            : r < 1024
            ? `${p(r)} B`
            : r < 1024 * 1024
            ? `${p(r / 1024)} KB`
            : r < 1024 * 1024 * 1024
            ? `${p(r / 1024 / 1024)} MB`
            : `${p(r / 1024 / 1024 / 1024)} GB`,
      }),
    ],
  });
}
var m = o(e());
function f({ time: r }) {
  return (0, m.jsxs)("span", {
    className: "badge gap-1",
    children: [
      (0, m.jsx)(i, {}),
      (0, m.jsx)("span", { children: r < 0 ? "N/A" : `${p(r)} ms` }),
    ],
  });
}
var a = o(e());
function $({ time: r, memory: u }) {
  return (0, a.jsxs)("span", {
    className: "inline-flex gap-2",
    children: [(0, a.jsx)(f, { time: r }), (0, a.jsx)(t, { memory: u })],
  });
}
export { $ as a };
