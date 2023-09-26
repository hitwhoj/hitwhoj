import { a as t } from "/build/_shared/chunk-F7TWK4YF.js";
import { f as o } from "/build/_shared/chunk-IYNQWWEV.js";
import { c as s } from "/build/_shared/chunk-P4KF3DFI.js";
import { d as n } from "/build/_shared/chunk-G5WX4PPA.js";
var a = n(s());
function r({ user: e }) {
  return (0, a.jsxs)("div", {
    className: "dropdown dropdown-top dropdown-hover",
    children: [
      (0, a.jsx)(o, {
        tabIndex: 0,
        className: "link",
        to: `/user/${e.id}`,
        children: e.nickname
          ? (0, a.jsxs)(a.Fragment, {
              children: [
                e.nickname,
                " ",
                (0, a.jsxs)("span", {
                  style: { color: "rgb(var(--gray-6))" },
                  children: ["(", e.username, ")"],
                }),
              ],
            })
          : e.username,
      }),
      (0, a.jsxs)("div", {
        tabIndex: 0,
        className:
          "dropdown-content rounded-box bg-base-300 flex w-72 gap-4 p-4 shadow-2xl",
        children: [
          (0, a.jsx)(t, {
            user: e,
            className: "bg-base-100 h-16 w-16 flex-shrink-0 text-3xl",
          }),
          (0, a.jsxs)("div", {
            className: "whitespace-normal",
            children: [
              (0, a.jsx)("div", {
                className: "text-lg font-bold",
                children: e.nickname || e.username,
              }),
              (0, a.jsx)("div", {
                className: "text-base-content",
                children:
                  e.bio ||
                  (0, a.jsx)("span", {
                    className: "italic",
                    children: "\u6CA1\u6709\u7B7E\u540D",
                  }),
              }),
            ],
          }),
        ],
      }),
    ],
  });
}
export { r as a };
