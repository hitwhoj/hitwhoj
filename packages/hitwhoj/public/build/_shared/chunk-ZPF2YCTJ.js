import { J as t } from "/build/_shared/chunk-KLFOMCVP.js";
import { b as d, d as o, f as l } from "/build/_shared/chunk-IYNQWWEV.js";
import { c as i } from "/build/_shared/chunk-P4KF3DFI.js";
import { d as s } from "/build/_shared/chunk-G5WX4PPA.js";
var r = s(i());
function v({ error: e }) {
  let c = d();
  return (0, r.jsx)("div", {
    className: "grid h-full w-full place-items-center",
    children: (0, r.jsxs)("div", {
      className:
        "not-prose card card-compact bg-error text-error-content w-96 shadow-lg",
      children: [
        (0, r.jsx)("figure", {
          children: (0, r.jsx)("img", { src: "/error.png", alt: "error" }),
        }),
        (0, r.jsxs)("div", {
          className: "card-body",
          children: [
            (0, r.jsx)("h2", {
              className: "card-title",
              children:
                "\u7F51\u7AD9\u8C8C\u4F3C\u51FA\u73B0\u4E86\u4E00\u4E9B\u5F02\u5E38",
            }),
            (0, r.jsx)("p", { children: e.message }),
            (0, r.jsx)("p", {
              children:
                "\u60A8\u53EF\u4EE5\u5C1D\u8BD5\u5411\u7BA1\u7406\u5458\u53CD\u9988\u6B64\u95EE\u9898",
            }),
            (0, r.jsx)("div", {
              className: "card-actions justify-end",
              children: (0, r.jsx)("button", {
                className: "btn btn-primary",
                onClick: () => c(-1),
                children: "\u8FD4\u56DE\u4E0A\u4E00\u9875",
              }),
            }),
          ],
        }),
      ],
    }),
  });
}
var a = s(i());
function p() {
  let e = o();
  switch (e.status) {
    case 400:
      return (0, a.jsx)("div", {
        className: "not-prose alert alert-error mt-4",
        children: (0, a.jsxs)("div", {
          children: [
            (0, a.jsx)(t, { className: "h-6 w-6" }),
            (0, a.jsxs)("div", {
              children: [
                (0, a.jsx)("h3", {
                  className: "font-bold",
                  children: "\u9519\u8BEF",
                }),
                (0, a.jsx)("div", { className: "text-xs", children: e.data }),
              ],
            }),
          ],
        }),
      });
    case 401:
      return (0, a.jsxs)("div", {
        className: "not-prose alert alert-error mt-4",
        children: [
          (0, a.jsxs)("div", {
            children: [
              (0, a.jsx)(t, { className: "h-6 w-6" }),
              (0, a.jsxs)("div", {
                children: [
                  (0, a.jsx)("h3", {
                    className: "font-bold",
                    children: "\u672A\u767B\u5F55",
                  }),
                  (0, a.jsx)("div", {
                    className: "text-xs",
                    children:
                      "\u8BF7\u767B\u5F55\u540E\u518D\u8FDB\u884C\u5C1D\u8BD5",
                  }),
                ],
              }),
            ],
          }),
          (0, a.jsx)(l, {
            className: "btn btn-outline",
            to: "/login",
            children: "\u767B\u5F55",
          }),
        ],
      });
    case 403:
      return (0, a.jsx)("div", {
        className: "not-prose alert alert-error mt-4",
        children: (0, a.jsxs)("div", {
          children: [
            (0, a.jsx)(t, { className: "h-6 w-6" }),
            (0, a.jsxs)("div", {
              children: [
                (0, a.jsx)("h3", {
                  className: "font-bold",
                  children: "\u6743\u9650\u4E0D\u8DB3",
                }),
                (0, a.jsx)("div", { className: "text-xs", children: e.data }),
              ],
            }),
          ],
        }),
      });
    case 404:
      return (0, a.jsx)("div", {
        className: "not-prose alert alert-error mt-4",
        children: (0, a.jsxs)("div", {
          children: [
            (0, a.jsx)(t, { className: "h-6 w-6" }),
            (0, a.jsxs)("div", {
              children: [
                (0, a.jsx)("h3", {
                  className: "font-bold",
                  children: "\u672A\u627E\u5230",
                }),
                (0, a.jsx)("div", { className: "text-xs", children: e.data }),
              ],
            }),
          ],
        }),
      });
    default:
      return (0, a.jsx)("div", {
        className: "not-prose alert alert-error mt-4",
        children: (0, a.jsxs)("div", {
          children: [
            (0, a.jsx)(t, { className: "h-6 w-6" }),
            (0, a.jsxs)("div", {
              children: [
                (0, a.jsxs)("h3", {
                  className: "font-bold",
                  children: [e.status, " ", e.statusText],
                }),
                (0, a.jsx)("div", { className: "text-xs", children: e.data }),
              ],
            }),
          ],
        }),
      });
  }
}
export { v as a, p as b };
