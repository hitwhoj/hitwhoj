import { a as d, b as l, c as m } from "/build/_shared/chunk-H2W53GLY.js";
import "/build/_shared/chunk-7WG4REHK.js";
import "/build/_shared/chunk-M6DBAY7B.js";
import { a, b as n } from "/build/_shared/chunk-ZPF2YCTJ.js";
import { c as s } from "/build/_shared/chunk-33FVQFAB.js";
import { d as i } from "/build/_shared/chunk-ASHX7EDV.js";
import "/build/_shared/chunk-KLFOMCVP.js";
import { a as f } from "/build/_shared/chunk-XIHPQXCX.js";
import "/build/_shared/chunk-IYNQWWEV.js";
import { c as o } from "/build/_shared/chunk-P4KF3DFI.js";
import { d as r } from "/build/_shared/chunk-G5WX4PPA.js";
var p = r(f());
var F = r(d());
var e = r(o());
var w = ({ data: t }) => ({
  title: `\u7528\u6237\u6587\u4EF6: ${
    t?.user.nickname || t?.user.username
  } - HITwh OJ`,
});
function c() {
  let t = s(),
    u = i(() => t.value.user.createdFiles);
  return (0, e.jsxs)(e.Fragment, {
    children: [
      (0, e.jsxs)("h2", {
        className: "flex items-center justify-between",
        children: [
          (0, e.jsx)("span", { children: "\u7528\u6237\u6587\u4EF6" }),
          (0, e.jsx)(m, { uploadAction: "uploadFile" }),
        ],
      }),
      (0, e.jsx)("p", {
        children:
          "\u4E0A\u4F20\u5373\u4EE3\u8868\u540C\u610F\u6211\u4EEC\u7684\u7528\u6237\u624B\u518C\uFF08\u867D\u7136\u6CA1\u6709\u8FD9\u4E2A\u4E1C\u897F\uFF09",
      }),
      (0, e.jsx)(l, { files: u.value, deleteAction: "removeFile" }),
    ],
  });
}
export { n as CatchBoundary, a as ErrorBoundary, c as default, w as meta };
