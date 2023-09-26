import { a as M } from "/build/_shared/chunk-JCTKAXWK.js";
import { a as P } from "/build/_shared/chunk-QTGCURF2.js";
import "/build/_shared/chunk-F7TWK4YF.js";
import { b as u } from "/build/_shared/chunk-WF674727.js";
import "/build/_shared/chunk-M6DBAY7B.js";
import { a as y, b as w } from "/build/_shared/chunk-ZPF2YCTJ.js";
import { b as l, c as g } from "/build/_shared/chunk-33FVQFAB.js";
import { d } from "/build/_shared/chunk-ASHX7EDV.js";
import { o as f, y as h } from "/build/_shared/chunk-KLFOMCVP.js";
import { a as v } from "/build/_shared/chunk-XIHPQXCX.js";
import "/build/_shared/chunk-IYNQWWEV.js";
import { b as C, c as b } from "/build/_shared/chunk-P4KF3DFI.js";
import { d as c } from "/build/_shared/chunk-G5WX4PPA.js";
var N = c(v()),
  o = c(M());
var p = c(C()),
  t = c(b());
function T({ id: s }) {
  let e = l(),
    a = u();
  return (
    (0, p.useEffect)(() => {
      e.actionSuccess && a.success("\u8E22\u51FA\u6210\u529F");
    }, [e.actionSuccess]),
    (0, t.jsxs)(e.Form, {
      method: "post",
      className: "tooltip tooltip-error",
      "data-tip": "\u8E22\u51FA\u56E2\u961F",
      children: [
        (0, t.jsx)("input", { type: "hidden", name: "member", value: s }),
        (0, t.jsx)("button", {
          type: "submit",
          name: "_action",
          value: "DeleteMember",
          disabled: e.isRunning,
          className: "btn btn-square btn-error btn-sm",
          children: (0, t.jsx)(h, {}),
        }),
      ],
    })
  );
}
function E({ id: s, role: e }) {
  let a = l(),
    r = u();
  (0, p.useEffect)(() => {
    a.actionSuccess &&
      r.success("\u8BBE\u5B9A\u6210\u5458\u89D2\u8272\u6210\u529F");
  }, [a.actionSuccess]);
  let n = e === o.ContestParticipantRole.Jury,
    m = e === o.ContestParticipantRole.Contestant;
  return (0, t.jsxs)(a.Form, {
    method: "post",
    className: "dropdown dropdown-hover",
    children: [
      (0, t.jsx)("input", { type: "hidden", name: "member", value: s }),
      (0, t.jsx)("input", {
        type: "hidden",
        name: "_action",
        value: "ChangeRole",
      }),
      (0, t.jsx)("span", {
        className: "btn btn-square btn-sm",
        children: (0, t.jsx)(f, {}),
      }),
      (0, t.jsxs)("ul", {
        className:
          "dropdown-content menu rounded-box bg-base-300 w-72 p-2 shadow-2xl",
        children: [
          (0, t.jsx)("li", {
            className: n ? "disabled" : "",
            children: (0, t.jsx)("button", {
              type: "submit",
              name: "role",
              value: o.ContestParticipantRole.Jury,
              disabled: n || a.isRunning,
              children: "\u8BBE\u7F6E\u4E3A\u88C1\u5224",
            }),
          }),
          (0, t.jsx)("li", {
            className: m ? "disabled" : "",
            children: (0, t.jsx)("button", {
              type: "submit",
              name: "role",
              value: o.ContestParticipantRole.Contestant,
              disabled: m || a.isRunning,
              children: "\u8BBE\u7F6E\u4E3A\u666E\u901A\u6210\u5458",
            }),
          }),
        ],
      }),
    ],
  });
}
function R() {
  let s = g(),
    e = d(() => s.value.members),
    a = d(() => {
      let r = e.value.filter(
          ({ role: i }) => i === o.ContestParticipantRole.Mod
        ),
        n = e.value.filter(
          ({ role: i }) => i === o.ContestParticipantRole.Jury
        ),
        m = e.value.filter(
          ({ role: i }) => i === o.ContestParticipantRole.Contestant
        );
      return [...r, ...n, ...m];
    });
  return (0, t.jsxs)("table", {
    className: "not-prose table-compact table w-full",
    children: [
      (0, t.jsx)("thead", {
        children: (0, t.jsxs)("tr", {
          children: [
            (0, t.jsx)("th", { children: "\u6210\u5458" }),
            (0, t.jsx)("th", { children: "\u89D2\u8272" }),
            (0, t.jsx)("th", { children: "\u64CD\u4F5C" }),
          ],
        }),
      }),
      (0, t.jsx)("tbody", {
        children: a.value.map(({ user: r, role: n }) =>
          (0, t.jsxs)(
            "tr",
            {
              children: [
                (0, t.jsx)("td", { children: (0, t.jsx)(P, { user: r }) }),
                (0, t.jsx)("td", {
                  children:
                    n === o.ContestParticipantRole.Mod
                      ? (0, t.jsx)("span", {
                          className: "badge badge-primary",
                          children: "\u7BA1\u7406\u5458",
                        })
                      : n === o.ContestParticipantRole.Jury
                      ? (0, t.jsx)("span", {
                          className: "badge badge-secondary",
                          children: "\u88C1\u5224",
                        })
                      : (0, t.jsx)("span", {
                          className: "badge",
                          children: "\u53C2\u8D5B\u9009\u624B",
                        }),
                }),
                n != o.ContestParticipantRole.Mod
                  ? (0, t.jsxs)("td", {
                      className: "space-x-3",
                      children: [
                        (0, t.jsx)(E, { id: r.id, role: n }),
                        (0, t.jsx)(T, { id: r.id }),
                      ],
                    })
                  : (0, t.jsx)("td", { children: "-" }),
              ],
            },
            r.id
          )
        ),
      }),
    ],
  });
}
export { w as CatchBoundary, y as ErrorBoundary, R as default };
