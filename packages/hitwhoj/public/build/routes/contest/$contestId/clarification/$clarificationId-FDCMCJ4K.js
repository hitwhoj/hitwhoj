import { a as f } from "/build/_shared/chunk-PUHPCD76.js";
import { a as w } from "/build/_shared/chunk-QTGCURF2.js";
import { a as v, e as b } from "/build/_shared/chunk-7WG4REHK.js";
import "/build/_shared/chunk-F7TWK4YF.js";
import "/build/_shared/chunk-YFBG3YAE.js";
import { a as p, c as m } from "/build/_shared/chunk-33FVQFAB.js";
import { d as r } from "/build/_shared/chunk-ASHX7EDV.js";
import { i as u } from "/build/_shared/chunk-KLFOMCVP.js";
import { a as I } from "/build/_shared/chunk-XIHPQXCX.js";
import { c, f as l, j as a } from "/build/_shared/chunk-IYNQWWEV.js";
import { c as d } from "/build/_shared/chunk-P4KF3DFI.js";
import { d as n } from "/build/_shared/chunk-G5WX4PPA.js";
var N = n(I());
var t = n(d());
function h() {
  let { contestId: y } = c(),
    s = m(),
    e = r(() => s.value.clarification),
    R = r(() => s.value.canReply),
    i = p();
  return (0, t.jsx)(f, {
    visible: !0,
    className: "bg-base-100 overflow-auto",
    children: (0, t.jsxs)("div", {
      className: "mx-auto w-full max-w-2xl p-4",
      children: [
        (0, t.jsx)("div", {
          children: (0, t.jsxs)(l, {
            className: "btn btn-ghost gap-2",
            to: `/contest/${y}/clarification`,
            children: [
              (0, t.jsx)(u, {}),
              (0, t.jsx)("span", { children: "\u8FD4\u56DE" }),
            ],
          }),
        }),
        (0, t.jsxs)("h2", { children: ["\u53CD\u9988 #", e.value.id] }),
        (0, t.jsx)("table", {
          children: (0, t.jsxs)("tbody", {
            children: [
              (0, t.jsxs)("tr", {
                children: [
                  (0, t.jsx)("th", { children: "\u63D0\u4EA4\u8005" }),
                  (0, t.jsx)("td", {
                    children: (0, t.jsx)(w, { user: e.value.user }),
                  }),
                ],
              }),
              (0, t.jsxs)("tr", {
                children: [
                  (0, t.jsx)("th", { children: "\u521B\u5EFA\u65F6\u95F4" }),
                  (0, t.jsx)("td", { children: v(e.value.createdAt) }),
                ],
              }),
              (0, t.jsxs)("tr", {
                children: [
                  (0, t.jsx)("th", { children: "\u72B6\u6001" }),
                  (0, t.jsx)("td", {
                    children: e.value.resolved
                      ? "\u5DF2\u89E3\u51B3"
                      : "\u672A\u89E3\u51B3",
                  }),
                ],
              }),
            ],
          }),
        }),
        (0, t.jsx)("blockquote", {
          className: "break-words",
          children: e.value.content,
        }),
        (0, t.jsx)("h3", { children: "\u56DE\u590D" }),
        e.value.replies.length === 0
          ? (0, t.jsx)("p", {
              className: "italic opacity-60",
              children: "\u6682\u65E0\u56DE\u590D",
            })
          : e.value.replies.map((o) =>
              (0, t.jsxs)(
                "p",
                {
                  className: "flex flex-col break-words",
                  children: [
                    (0, t.jsx)("span", { children: o.content }),
                    (0, t.jsx)("span", {
                      className: "text-xs opacity-60",
                      children: b(o.createdAt),
                    }),
                  ],
                },
                o.id
              )
            ),
        R.value
          ? (0, t.jsxs)(t.Fragment, {
              children: [
                (0, t.jsx)("h3", { children: "\u88C1\u5224\u64CD\u4F5C" }),
                e.value.resolved
                  ? (0, t.jsx)("p", {
                      className: "alert alert-success",
                      children: "\u53CD\u9988\u5DF2\u7ECF\u89E3\u51B3",
                    })
                  : (0, t.jsxs)(t.Fragment, {
                      children: [
                        (0, t.jsxs)("div", {
                          className: "flex justify-end gap-4",
                          children: [
                            (0, t.jsx)(a, {
                              method: "post",
                              className: "inline-block",
                              children: (0, t.jsx)("button", {
                                className: "btn btn-primary",
                                type: "submit",
                                name: "_action",
                                value: "Apply",
                                disabled: i.isRunning,
                                children: "\u8BA4\u9886\u7ED9\u81EA\u5DF1",
                              }),
                            }),
                            (0, t.jsx)(a, {
                              method: "post",
                              className: "inline-block",
                              children: (0, t.jsx)("button", {
                                className: "btn btn-success",
                                type: "submit",
                                name: "_action",
                                value: "Resolve",
                                disabled: i.isRunning,
                                children: "\u6807\u8BB0\u4E3A\u89E3\u51B3",
                              }),
                            }),
                          ],
                        }),
                        (0, t.jsxs)(a, {
                          method: "post",
                          className: "form-control gap-4",
                          children: [
                            (0, t.jsxs)("div", {
                              className: "form-control",
                              children: [
                                (0, t.jsx)("label", {
                                  className: "label",
                                  children: (0, t.jsx)("span", {
                                    className: "label-text",
                                    children: "\u56DE\u590D\u5185\u5BB9",
                                  }),
                                }),
                                (0, t.jsx)("textarea", {
                                  className: "textarea textarea-bordered h-24",
                                  name: "content",
                                  required: !0,
                                }),
                              ],
                            }),
                            (0, t.jsx)("div", {
                              className: "flex justify-end",
                              children: (0, t.jsx)("button", {
                                className: "btn btn-primary",
                                type: "submit",
                                name: "_action",
                                value: "Reply",
                                disabled: i.isRunning,
                                children: "\u63D0\u4EA4\u56DE\u590D",
                              }),
                            }),
                          ],
                        }),
                      ],
                    }),
              ],
            })
          : !e.value.resolved &&
            (0, t.jsx)("div", {
              className: "alert alert-info",
              children:
                "\u8BF7\u8010\u5FC3\u7B49\u5F85\u88C1\u5224\u56DE\u590D",
            }),
      ],
    }),
  });
}
export { h as default };
