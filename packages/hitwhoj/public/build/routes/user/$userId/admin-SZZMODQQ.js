import { a as g } from "/build/_shared/chunk-JCTKAXWK.js";
import { a as n } from "/build/_shared/chunk-M6DBAY7B.js";
import { a as P, c as v } from "/build/_shared/chunk-33FVQFAB.js";
import { d as t } from "/build/_shared/chunk-ASHX7EDV.js";
import { J as E, g as d, x as R } from "/build/_shared/chunk-KLFOMCVP.js";
import { a as h } from "/build/_shared/chunk-XIHPQXCX.js";
import { j as s } from "/build/_shared/chunk-IYNQWWEV.js";
import { c as p } from "/build/_shared/chunk-P4KF3DFI.js";
import { d as i } from "/build/_shared/chunk-G5WX4PPA.js";
var r = i(g());
var w = i(h()),
  e = i(p());
function f() {
  let o = v(),
    a = t(() => o.value.user),
    u = t(() => o.value.hasEditPrivPerm),
    l = t(() => o.value.hasEditRolePerm),
    c = P(),
    m = t(() => !(a.value.privilege & n.PRIV_OPERATE));
  return (0, e.jsxs)(e.Fragment, {
    children: [
      u.value &&
        (0, e.jsxs)(e.Fragment, {
          children: [
            (0, e.jsx)("h2", { children: "\u7BA1\u7406\u5458\u64CD\u4F5C" }),
            (0, e.jsxs)(s, {
              method: "post",
              children: [
                (0, e.jsx)("input", {
                  type: "hidden",
                  name: "privilege",
                  value: a.value.privilege ^ n.PRIV_OPERATE,
                }),
                (0, e.jsxs)("button", {
                  className: "btn btn-primary gap-2",
                  type: "submit",
                  name: "_action",
                  value: "setPrivilege",
                  disabled: c.isRunning,
                  children: [
                    m.value ? (0, e.jsx)(R, {}) : (0, e.jsx)(E, {}),
                    (0, e.jsx)("span", {
                      children: m.value
                        ? "\u53D6\u6D88\u5C01\u7981"
                        : "\u5C01\u7981\u7528\u6237",
                    }),
                  ],
                }),
              ],
            }),
          ],
        }),
      l.value &&
        (0, e.jsxs)(e.Fragment, {
          children: [
            (0, e.jsx)("h2", {
              children: "\u4FEE\u6539\u7528\u6237\u7CFB\u7EDF\u89D2\u8272",
            }),
            (0, e.jsxs)(s, {
              method: "post",
              className: "flex gap-4",
              children: [
                (0, e.jsxs)("select", {
                  className: "select select-bordered",
                  name: "role",
                  defaultValue: a.value.role,
                  children: [
                    (0, e.jsx)("option", {
                      value: r.SystemUserRole.Root,
                      children: "\u8D85\u7EA7\u7BA1\u7406\u5458",
                    }),
                    (0, e.jsx)("option", {
                      value: r.SystemUserRole.Admin,
                      children: "\u7CFB\u7EDF\u7BA1\u7406\u5458",
                    }),
                    (0, e.jsx)("option", {
                      value: r.SystemUserRole.User,
                      children: "\u666E\u901A\u7528\u6237",
                    }),
                  ],
                }),
                (0, e.jsxs)("button", {
                  className: "btn btn-primary gap-2",
                  type: "submit",
                  name: "_action",
                  value: "setRole",
                  disabled: c.isRunning,
                  children: [(0, e.jsx)(d, {}), "\u786E\u8BA4\u4FEE\u6539"],
                }),
              ],
            }),
          ],
        }),
      !u.value &&
        !l.value &&
        (0, e.jsx)("p", {
          children:
            "\u4F60\u662F\u600E\u4E48\u8FDB\u5230\u8FD9\u4E2A\u9875\u9762\u7684\uFF1F",
        }),
    ],
  });
}
export { f as default };
