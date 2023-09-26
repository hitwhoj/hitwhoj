import { a as p } from "/build/_shared/chunk-MDGTQBQV.js";
import "/build/_shared/chunk-M6DBAY7B.js";
import { c as n } from "/build/_shared/chunk-33FVQFAB.js";
import { d as i } from "/build/_shared/chunk-ASHX7EDV.js";
import { a as u } from "/build/_shared/chunk-XIHPQXCX.js";
import "/build/_shared/chunk-IYNQWWEV.js";
import { c as o } from "/build/_shared/chunk-P4KF3DFI.js";
import { d as e } from "/build/_shared/chunk-G5WX4PPA.js";
var v = e(u()),
  f = e(p()),
  t = e(o());
var N = () => ({ title: "\u8BC4\u6D4B\u673A\u7BA1\u7406 - HITwh OJ" });
function l() {
  let r = n(),
    d = i(() => r.value.judges),
    s = i(() => r.value.states);
  return (0, t.jsxs)(t.Fragment, {
    children: [
      (0, t.jsx)("h1", { children: "\u8BC4\u6D4B\u673A\u7BA1\u7406" }),
      (0, t.jsxs)("div", {
        className: "stats w-full",
        children: [
          (0, t.jsxs)("div", {
            className: "stat",
            children: [
              (0, t.jsx)("div", {
                className: "stat-title",
                children: "\u5728\u7EBF\u8BC4\u6D4B\u673A",
              }),
              (0, t.jsx)("div", {
                className: "stat-value",
                children: s.value.filter(
                  ({ state: a }) => a.status === "Online"
                ).length,
              }),
            ],
          }),
          (0, t.jsxs)("div", {
            className: "stat",
            children: [
              (0, t.jsx)("div", {
                className: "stat-title",
                children: "\u6389\u7EBF\u8BC4\u6D4B\u673A",
              }),
              (0, t.jsx)("div", {
                className: "stat-value",
                children: s.value.filter(
                  ({ state: a }) => a.status === "Offline"
                ).length,
              }),
            ],
          }),
        ],
      }),
      d.value.map((a) => {
        let m = s.value.find((c) => c.id === a.id)?.state;
        return (0, t.jsx)(
          "div",
          {
            className: "not-prose card bg-base-200 my-4",
            children: (0, t.jsxs)("div", {
              className: "card-body",
              children: [
                (0, t.jsx)("h2", { className: "card-title", children: a.name }),
                (0, t.jsxs)("p", {
                  className: "flex gap-4",
                  children: [
                    m?.status === "Online"
                      ? (0, t.jsx)("span", {
                          className: "text-success",
                          children: "\u5728\u7EBF",
                        })
                      : (0, t.jsx)("span", {
                          className: "text-error",
                          children: "\u79BB\u7EBF",
                        }),
                    (0, t.jsxs)("span", {
                      className: "opacity-60",
                      children: [a.ip, ":", a.port],
                    }),
                  ],
                }),
                (0, t.jsx)("div", {
                  className: "card-actions justify-end",
                  children: (0, t.jsx)("button", {
                    className: "btn btn-primary",
                    onClick: () => alert("TODO: \u8FD8\u6CA1\u5199"),
                    children: "\u91CD\u8FDE",
                  }),
                }),
              ],
            }),
          },
          a.id
        );
      }),
    ],
  });
}
export { l as default, N as meta };
