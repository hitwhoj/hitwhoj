import { c as a } from "/build/_shared/chunk-ANJHU2RD.js";
import {
  A as o,
  D as u,
  K as p,
  g as c,
} from "/build/_shared/chunk-KLFOMCVP.js";
import { c as n } from "/build/_shared/chunk-P4KF3DFI.js";
import { d as i } from "/build/_shared/chunk-G5WX4PPA.js";
var e = i(n());
function l({ status: r }) {
  let t, s;
  switch (r) {
    case "Accepted": {
      (t = "text-success"), (s = (0, e.jsx)(c, {}));
      break;
    }
    case "Compile Error":
    case "Memory Limit Exceeded":
    case "Output Limit Exceeded":
    case "Runtime Error":
    case "System Error":
    case "Time Limit Exceeded":
    case "Unknown Error":
    case "Wrong Answer": {
      (t = "text-error"), (s = (0, e.jsx)(p, {}));
      break;
    }
    case "Compiling":
    case "Judging":
    case "Running": {
      (t = "text-warning"), (s = (0, e.jsx)(a, { className: "animate-spin" }));
      break;
    }
    case "Pending": {
      (t = ""), (s = (0, e.jsx)(a, { className: "animate-spin" }));
      break;
    }
    case "Skipped": {
      (t = ""), (s = (0, e.jsx)(o, {}));
      break;
    }
    default: {
      (t = "text-primary"), (s = (0, e.jsx)(u, {}));
      break;
    }
  }
  return (0, e.jsxs)("span", {
    className: `inline-flex items-center gap-2 ${t}`,
    children: [s, (0, e.jsx)("span", { children: r })],
  });
}
export { l as a };
