import { a as N } from "/build/_shared/chunk-JCTKAXWK.js";
import { a as E } from "/build/_shared/chunk-F7TWK4YF.js";
import { b as u } from "/build/_shared/chunk-WF674727.js";
import "/build/_shared/chunk-M6DBAY7B.js";
import { a as v, b as _ } from "/build/_shared/chunk-ZPF2YCTJ.js";
import { b as l, c as I } from "/build/_shared/chunk-33FVQFAB.js";
import { d as i } from "/build/_shared/chunk-ASHX7EDV.js";
import { C as w, o as h, y as f } from "/build/_shared/chunk-KLFOMCVP.js";
import { a as P } from "/build/_shared/chunk-XIHPQXCX.js";
import { f as M } from "/build/_shared/chunk-IYNQWWEV.js";
import { b as g, c as p } from "/build/_shared/chunk-P4KF3DFI.js";
import { d as n } from "/build/_shared/chunk-G5WX4PPA.js";
var y = n(P()),
  d = n(N());
var b = n(g()),
  e = n(p());
function R({ id: r }) {
  let a = l(),
    s = u();
  return (
    (0, b.useEffect)(() => {
      a.actionSuccess && s.success("\u8E22\u51FA\u6210\u529F");
    }, [a.actionSuccess]),
    (0, e.jsxs)(a.Form, {
      method: "post",
      className: "tooltip tooltip-error",
      "data-tip": "\u8E22\u51FA\u56E2\u961F",
      children: [
        (0, e.jsx)("input", { type: "hidden", name: "member", value: r }),
        (0, e.jsx)("button", {
          className: "btn btn-square btn-error",
          type: "submit",
          name: "_action",
          value: "DeleteMember",
          disabled: a.isRunning,
          children: (0, e.jsx)(f, { className: "h-6 w-6" }),
        }),
      ],
    })
  );
}
function T({ id: r, role: a }) {
  let s = l(),
    c = u();
  (0, b.useEffect)(() => {
    s.actionSuccess &&
      c.success("\u8BBE\u5B9A\u6210\u5458\u89D2\u8272\u6210\u529F");
  }, [s.actionSuccess]);
  let o = a === "Owner",
    m = a === "Admin",
    t = a === "Member";
  return (0, e.jsxs)(s.Form, {
    method: "post",
    className: "dropdown dropdown-hover",
    children: [
      (0, e.jsx)("input", { type: "hidden", name: "member", value: r }),
      (0, e.jsx)("input", {
        type: "hidden",
        name: "_action",
        value: "ChangeRole",
      }),
      (0, e.jsx)("label", {
        tabIndex: 0,
        className: "btn btn-square",
        children: (0, e.jsx)(h, { className: "h-6 w-6" }),
      }),
      (0, e.jsxs)("ul", {
        className:
          "dropdown-content menu rounded-box bg-base-300 w-72 p-2 shadow-2xl",
        children: [
          (0, e.jsx)("li", {
            className: o ? "disabled" : "",
            children: (0, e.jsx)("button", {
              type: "submit",
              name: "role",
              value: d.TeamMemberRole.Owner,
              disabled: o || s.isRunning,
              children: "\u8BBE\u7F6E\u4E3A\u6240\u6709\u4EBA",
            }),
          }),
          (0, e.jsx)("li", {
            className: m ? "disabled" : "",
            children: (0, e.jsx)("button", {
              type: "submit",
              name: "role",
              value: d.TeamMemberRole.Admin,
              disabled: m || s.isRunning,
              children: "\u8BBE\u7F6E\u4E3A\u7BA1\u7406\u5458",
            }),
          }),
          (0, e.jsx)("li", {
            className: t ? "disabled" : "",
            children: (0, e.jsx)("button", {
              type: "submit",
              name: "role",
              value: d.TeamMemberRole.Member,
              disabled: t || s.isRunning,
              children: "\u8BBE\u7F6E\u4E3A\u6210\u5458",
            }),
          }),
        ],
      }),
    ],
  });
}
var k = {
  Owner: "\u6240\u6709\u4EBA",
  Admin: "\u7BA1\u7406\u5458",
  Member: "\u6210\u5458",
};
function A() {
  let r = I(),
    a = i(() => r.value.members),
    s = i(() => r.value.hasEditPerm),
    c = i(() => r.value.hasInvitePerm),
    o = i(() => r.value.hasKickAdminPerm),
    m = i(() => r.value.hasKickMemberPerm);
  return (0, e.jsxs)(e.Fragment, {
    children: [
      (0, e.jsxs)("h2", {
        className: "flex items-center justify-between",
        children: [
          (0, e.jsx)("span", { children: "\u56E2\u961F\u6210\u5458" }),
          c.value &&
            (0, e.jsxs)("button", {
              className: "btn btn-primary gap-2",
              children: [
                (0, e.jsx)(w, {}),
                (0, e.jsx)("span", { children: "\u6DFB\u52A0\u6210\u5458" }),
              ],
            }),
        ],
      }),
      (0, e.jsx)("div", {
        className: "not-prose grid grid-cols-1 gap-4 md:grid-cols-2",
        children: a.value.map((t) =>
          (0, e.jsx)(
            "div",
            {
              className: "card bg-base-200 overflow-visible",
              children: (0, e.jsx)("div", {
                className: "card-body",
                children: (0, e.jsxs)("div", {
                  className: "flex items-center justify-between",
                  children: [
                    (0, e.jsxs)("div", {
                      className: "flex items-center gap-4",
                      children: [
                        (0, e.jsx)(E, {
                          user: t.user,
                          className: "bg-base-100 h-16 w-16 shrink-0 text-2xl",
                        }),
                        (0, e.jsxs)("div", {
                          children: [
                            (0, e.jsx)(M, {
                              to: `/user/${t.user.id}`,
                              className: "link link-hover block font-bold",
                              children: t.user.nickname || t.user.username,
                            }),
                            (0, e.jsx)("div", {
                              className: `badge ${
                                t.role === "Owner"
                                  ? "badge-primary"
                                  : t.role === "Admin"
                                  ? "badge-secondary"
                                  : ""
                              }`,
                              children: k[t.role],
                            }),
                          ],
                        }),
                      ],
                    }),
                    (0, e.jsxs)("div", {
                      className: "flex shrink-0 items-center gap-4",
                      children: [
                        s.value &&
                          (0, e.jsx)(T, { id: t.user.id, role: t.role }),
                        o.value &&
                          t.role === "Admin" &&
                          (0, e.jsx)(R, { id: t.user.id }),
                        m.value &&
                          t.role === "Member" &&
                          (0, e.jsx)(R, { id: t.user.id }),
                      ],
                    }),
                  ],
                }),
              }),
            },
            t.user.id
          )
        ),
      }),
    ],
  });
}
export { _ as CatchBoundary, v as ErrorBoundary, A as default };
