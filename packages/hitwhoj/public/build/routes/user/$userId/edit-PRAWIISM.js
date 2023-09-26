import { b as u } from "/build/_shared/chunk-WF674727.js";
import "/build/_shared/chunk-M6DBAY7B.js";
import { a as c, b as d } from "/build/_shared/chunk-ZPF2YCTJ.js";
import { a as o, c as m } from "/build/_shared/chunk-33FVQFAB.js";
import { d as l } from "/build/_shared/chunk-ASHX7EDV.js";
import "/build/_shared/chunk-KLFOMCVP.js";
import { a as N } from "/build/_shared/chunk-XIHPQXCX.js";
import { j as r } from "/build/_shared/chunk-IYNQWWEV.js";
import { b as v, c as i } from "/build/_shared/chunk-P4KF3DFI.js";
import { d as n } from "/build/_shared/chunk-G5WX4PPA.js";
var g = n(N());
var p = n(v()),
  e = n(i());
var R = ({ data: s }) => ({
  title: `\u7F16\u8F91\u7528\u6237: ${
    s?.user.nickname || s?.user.username
  } - HITwh OJ`,
});
function b() {
  let s = m(),
    t = l(() => s.value.user),
    a = o(),
    f = u();
  return (
    (0, p.useEffect)(() => {
      a.actionSuccess && f.success("\u66F4\u65B0\u6210\u529F");
    }, [a.actionSuccess]),
    (0, e.jsxs)(r, {
      method: "post",
      className: "form-control mx-auto w-full max-w-lg gap-4",
      children: [
        (0, e.jsxs)("div", {
          className: "form-control",
          children: [
            (0, e.jsx)("label", {
              className: "label",
              children: (0, e.jsx)("span", {
                className: "label-text",
                children:
                  "\u7528\u6237\u540D (\u5B57\u6BCD\u6570\u5B57\u4E0B\u5212\u7EBF)",
              }),
            }),
            (0, e.jsx)("input", {
              className: "input input-bordered",
              type: "text",
              name: "username",
              defaultValue: t.value.username,
              disabled: a.isRunning,
              required: !0,
              pattern: "\\w+",
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
                children: "\u7528\u6237\u6635\u79F0",
              }),
            }),
            (0, e.jsx)("input", {
              className: "input input-bordered",
              type: "text",
              name: "nickname",
              defaultValue: t.value.nickname,
              disabled: a.isRunning,
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
                children: "\u4E2A\u6027\u7B7E\u540D",
              }),
            }),
            (0, e.jsx)("input", {
              className: "input input-bordered",
              type: "text",
              name: "bio",
              defaultValue: t.value.bio,
              disabled: a.isRunning,
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
                children: "\u7535\u5B50\u90AE\u7BB1",
              }),
            }),
            (0, e.jsx)("input", {
              className: "input input-bordered",
              type: "email",
              name: "email",
              defaultValue: t.value.email,
              disabled: a.isRunning,
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
                children:
                  "\u5934\u50CF\u5730\u5740 (\u6BD4\u8F83\u8BE1\u5F02\uFF0C\u4F30\u8BA1\u8981\u6539)",
              }),
            }),
            (0, e.jsx)("input", {
              className: "input input-bordered",
              type: "text",
              name: "avatar",
              defaultValue: t.value.avatar,
              placeholder: "https://",
              disabled: a.isRunning,
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
                children: "\u5DE5\u4F5C\u5355\u4F4D",
              }),
            }),
            (0, e.jsx)("input", {
              className: "input input-bordered",
              type: "text",
              name: "department",
              defaultValue: t.value.department,
              disabled: a.isRunning,
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
                children: "\u5B66\u53F7",
              }),
            }),
            (0, e.jsx)("input", {
              className: "input input-bordered",
              type: "text",
              name: "studentId",
              defaultValue: t.value.studentId,
              disabled: a.isRunning,
            }),
          ],
        }),
        (0, e.jsx)("div", {
          className: "form-control",
          children: (0, e.jsx)("button", {
            className: "btn btn-primary",
            type: "submit",
            disabled: a.isRunning,
            children: "\u786E\u8BA4\u4FEE\u6539",
          }),
        }),
      ],
    })
  );
}
export { d as CatchBoundary, c as ErrorBoundary, b as default, R as meta };
