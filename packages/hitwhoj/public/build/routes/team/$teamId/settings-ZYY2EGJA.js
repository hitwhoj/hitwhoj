import { a as I } from "/build/_shared/chunk-JCTKAXWK.js";
import { a as E } from "/build/_shared/chunk-KAFADMKS.js";
import "/build/_shared/chunk-XCRF7VPJ.js";
import "/build/_shared/chunk-C6VOOSKL.js";
import { b as d } from "/build/_shared/chunk-WF674727.js";
import "/build/_shared/chunk-YFBG3YAE.js";
import "/build/_shared/chunk-KUDQOE27.js";
import "/build/_shared/chunk-NPZ34MRD.js";
import "/build/_shared/chunk-5CMXDJBZ.js";
import "/build/_shared/chunk-M6DBAY7B.js";
import { a as h, b as w } from "/build/_shared/chunk-ZPF2YCTJ.js";
import { b as c, c as b } from "/build/_shared/chunk-33FVQFAB.js";
import { c as v, d as s } from "/build/_shared/chunk-ASHX7EDV.js";
import { y as f } from "/build/_shared/chunk-KLFOMCVP.js";
import { a as x } from "/build/_shared/chunk-XIHPQXCX.js";
import "/build/_shared/chunk-IYNQWWEV.js";
import { b as P, c as p } from "/build/_shared/chunk-P4KF3DFI.js";
import { d as i } from "/build/_shared/chunk-G5WX4PPA.js";
var R = i(x());
var n = i(I());
var u = i(P()),
  e = i(p());
function _({
  name: t,
  description: o,
  invitationType: r,
  invitationCode: m,
  allowMembersInvite: g,
}) {
  let a = c(),
    T = d();
  (0, u.useEffect)(() => {
    a.actionSuccess &&
      T.success("\u66F4\u65B0\u56E2\u961F\u4FE1\u606F\u6210\u529F");
  }, [a.actionSuccess]);
  let l = v(r);
  return (0, e.jsxs)(a.Form, {
    method: "post",
    className: "form-control gap-4",
    children: [
      (0, e.jsxs)("div", {
        className: "form-control w-full max-w-xs",
        children: [
          (0, e.jsx)("label", {
            className: "label",
            children: (0, e.jsx)("span", {
              className: "label-text",
              children: "\u56E2\u961F\u540D\u79F0",
            }),
          }),
          (0, e.jsx)("input", {
            className: "input input-bordered",
            name: "name",
            defaultValue: t,
            disabled: a.isRunning,
            required: !0,
          }),
        ],
      }),
      (0, e.jsxs)("div", {
        className: "form-control",
        children: [
          (0, e.jsx)("label", {
            className: "label",
            children: (0, e.jsx)("span", {
              className: "label-text",
              children: "\u56E2\u961F\u63CF\u8FF0",
            }),
          }),
          (0, e.jsx)(E, { name: "description", defaultValue: o }),
        ],
      }),
      (0, e.jsxs)("div", {
        className: "form-control",
        children: [
          (0, e.jsx)("label", {
            className: "label",
            children: (0, e.jsx)("span", {
              className: "label-text",
              children: "\u9080\u8BF7\u5236",
            }),
          }),
          (0, e.jsxs)("div", {
            className: "flex gap-4",
            children: [
              (0, e.jsxs)("select", {
                className: "select select-bordered",
                name: "invitation",
                value: l.value,
                onChange: (y) => (l.value = y.target.value),
                disabled: a.isRunning,
                children: [
                  (0, e.jsx)("option", {
                    value: n.InvitationType.FREE,
                    children: "\u6240\u6709\u4EBA\u5747\u53EF\u52A0\u5165",
                  }),
                  (0, e.jsx)("option", {
                    value: n.InvitationType.CODE,
                    children: "\u9700\u8981\u586B\u5199\u9080\u8BF7\u7801",
                  }),
                  (0, e.jsx)("option", {
                    value: n.InvitationType.NONE,
                    children: "\u7981\u6B62\u4EFB\u4F55\u4EBA\u52A0\u5165",
                  }),
                ],
              }),
              l.value === n.InvitationType.CODE &&
                (0, e.jsx)("input", {
                  className: "input input-bordered",
                  name: "code",
                  defaultValue: m,
                  placeholder: "\u9080\u8BF7\u7801",
                  disabled: a.isRunning,
                  required: !0,
                }),
            ],
          }),
        ],
      }),
      (0, e.jsx)("div", {
        className: "form-control",
        children: (0, e.jsxs)("label", {
          className: "label cursor-pointer justify-start gap-2",
          children: [
            (0, e.jsx)("input", {
              className: "checkbox checkbox-primary",
              type: "checkbox",
              name: "allow_invite",
              defaultChecked: g,
              disabled: a.isRunning,
            }),
            (0, e.jsx)("span", {
              className: "label-text",
              children:
                "\u5141\u8BB8\u56E2\u961F\u6210\u5458\u9080\u8BF7\u5176\u4ED6\u7528\u6237\u76F4\u63A5\u52A0\u5165",
            }),
          ],
        }),
      }),
      (0, e.jsx)("div", {
        className: "form-control w-full max-w-xs",
        children: (0, e.jsx)("button", {
          className: "btn btn-primary",
          type: "submit",
          disabled: a.isRunning,
          name: "_action",
          value: "EditProfile",
          children: "\u786E\u8BA4\u66F4\u65B0",
        }),
      }),
    ],
  });
}
function S() {
  let t = c(),
    o = d();
  return (
    (0, u.useEffect)(() => {
      t.actionSuccess && o.success("\u6210\u529F\u9000\u51FA\u56E2\u961F");
    }, [t.actionSuccess]),
    (0, e.jsx)(t.Form, {
      method: "post",
      children: (0, e.jsxs)("button", {
        className: "btn btn-error gap-2",
        type: "submit",
        disabled: t.isRunning,
        name: "_action",
        value: "ExitTeam",
        children: [
          (0, e.jsx)(f, {}),
          (0, e.jsx)("span", { children: "\u9000\u51FA\u56E2\u961F" }),
        ],
      }),
    })
  );
}
function N() {
  let t = b(),
    o = s(() => t.value.profile),
    r = s(() => t.value.hasLeavePerm),
    m = s(() => t.value.hasEditPerm);
  return (0, e.jsxs)(e.Fragment, {
    children: [
      m.value &&
        (0, e.jsxs)(e.Fragment, {
          children: [
            (0, e.jsx)("h2", { children: "\u56E2\u961F\u8BBE\u7F6E" }),
            (0, e.jsx)(_, { ...o.value }),
          ],
        }),
      r.value &&
        (0, e.jsxs)(e.Fragment, {
          children: [
            (0, e.jsx)("h2", { children: "\u5371\u9669\u533A\u57DF" }),
            (0, e.jsx)(S, {}),
          ],
        }),
    ],
  });
}
export { w as CatchBoundary, h as ErrorBoundary, N as default };
