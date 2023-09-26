import { a as h } from "/build/_shared/chunk-WH23UYJB.js";
import { a as b } from "/build/_shared/chunk-4B3SKNWL.js";
import { a as l, d as p } from "/build/_shared/chunk-7WG4REHK.js";
import "/build/_shared/chunk-ANJHU2RD.js";
import { a as c } from "/build/_shared/chunk-6WF7NKYL.js";
import { a as m, b as n } from "/build/_shared/chunk-ZPF2YCTJ.js";
import { c as d } from "/build/_shared/chunk-33FVQFAB.js";
import "/build/_shared/chunk-ASHX7EDV.js";
import "/build/_shared/chunk-KLFOMCVP.js";
import { a as v } from "/build/_shared/chunk-XIHPQXCX.js";
import { f as i, j as r } from "/build/_shared/chunk-IYNQWWEV.js";
import { c as o } from "/build/_shared/chunk-P4KF3DFI.js";
import { d as a } from "/build/_shared/chunk-G5WX4PPA.js";
var f = a(v());
var e = a(o()),
  N = () => ({ title: "\u9996\u9875 - HITwh OJ" });
var g =
    "https://qm.qq.com/cgi-bin/qm/qr?k=uFHY05vPwIamUXG6L-xDQvhkA0acwZqA&jump_from=webapi&authKey=96ylLScWBoTxF6zMOsP7wdIbC/7PN1bMs5T74AIOpqeBE6h4NAGnYx/ngkxkVhyx",
  w = "https://git.hit.edu.cn/hitwhoj/hitwhoj/-/issues";
function u() {
  let s = d();
  return (0, e.jsxs)(e.Fragment, {
    children: [
      (0, e.jsx)("h1", { children: "Welcome to HITwh OJ" }),
      (0, e.jsxs)("div", {
        className:
          "not-prose grid grid-cols-8 place-content-between gap-4 md:grid-cols-12",
        children: [
          (0, e.jsx)("div", {
            className:
              "card bg-info text-info-content col-span-8 md:col-span-12",
            children: (0, e.jsxs)("div", {
              className: "card-body",
              children: [
                (0, e.jsx)("h2", {
                  className: "card-title",
                  children: "\u7EB3\u65B0\u516C\u544A",
                }),
                (0, e.jsx)("p", {
                  children:
                    "HITwh OJ \u9879\u76EE\u7EC4\u548C HITwh FP \u9879\u76EE\u7EC4\u7EDD\u8D5E\u7EB3\u65B0\u4E2D\uFF01\uFF01\uFF01",
                }),
                (0, e.jsx)("p", {
                  children:
                    "\u9700\u8981\u719F\u6089 nodejs \u5F00\u53D1\u73AF\u5883\uFF0C\u6709 React \u5F00\u53D1\u7ECF\u9A8C\uFF0C\u6709\u70ED\u60C5\u5B66\u4E60\u6700\u65B0\u6700\u524D\u6CBF\u7684\u524D\u7AEF\u6280\u672F\u6808\u3002",
                }),
                (0, e.jsx)("p", {
                  children:
                    "\u8BE6\u60C5\u8BF7\u8054\u7CFB QQ 3224177294 \u6216\u8005\u53D1\u9001\u90AE\u4EF6\u5230 contact#hitwh.moe\u3002",
                }),
              ],
            }),
          }),
          (0, e.jsx)("div", {
            className: "card bg-base-200 col-span-8 row-span-2",
            children: (0, e.jsxs)("div", {
              className: "card-body",
              children: [
                (0, e.jsx)("h2", {
                  className: "card-title",
                  children: "\u901A\u77E5\u516C\u544A",
                }),
                (0, e.jsxs)("p", {
                  className: "flex items-center",
                  children: [
                    "\u6B22\u8FCE\u52A0\u5165 HITwh OJ \u53CD\u9988 QQ \u7FA4\uFF1A",
                    (0, e.jsx)("a", {
                      className: "underline",
                      href: g,
                      target: "_blank",
                      rel: "noreferrer",
                      children: "721141362",
                    }),
                  ],
                }),
                (0, e.jsx)("p", {
                  children: (0, e.jsx)("a", {
                    className: "underline",
                    href: w,
                    target: "_blank",
                    rel: "noreferrer",
                    children:
                      "\u5982\u679C\u60A8\u53D1\u73B0\u6709\u4EC0\u4E48 BUG\uFF0C\u53EF\u4EE5\u5728\u8FD9\u91CC\u63D0\u4EA4 issue",
                  }),
                }),
              ],
            }),
          }),
          (0, e.jsx)("div", {
            className: "stats bg-base-200 col-span-4",
            children: (0, e.jsxs)("div", {
              className: "stat",
              children: [
                (0, e.jsx)("div", {
                  className: "stat-title",
                  children: "\u4ECA\u5929",
                }),
                (0, e.jsx)("div", {
                  className: "stat-value",
                  children: new Date().toLocaleDateString("zh-CN"),
                }),
                (0, e.jsx)("div", {
                  className: "stat-desc",
                  children: new Date().toLocaleDateString("zh-CN", {
                    weekday: "long",
                  }),
                }),
              ],
            }),
          }),
          (0, e.jsx)("div", {
            className: "stats bg-base-200 col-span-4",
            children: (0, e.jsxs)("div", {
              className: "stat",
              children: [
                (0, e.jsx)("div", {
                  className: "stat-title",
                  children: "\u5FEB\u901F\u8DF3\u9898",
                }),
                (0, e.jsxs)(r, {
                  className: "input-group",
                  method: "post",
                  children: [
                    (0, e.jsx)("input", {
                      className: "input input-bordered input-sm w-2/3",
                      type: "text",
                      name: "pid",
                      required: !0,
                      placeholder: "\u8BF7\u8F93\u5165\u9898\u76EE\u7F16\u53F7",
                    }),
                    (0, e.jsx)("button", {
                      className: "btn btn-primary btn-sm w-1/3",
                      type: "submit",
                      children: "\u8DF3\u8F6C",
                    }),
                  ],
                }),
              ],
            }),
          }),
          (0, e.jsx)("div", {
            className: "card bg-base-200 col-span-8 md:col-span-6",
            children: (0, e.jsxs)("div", {
              className: "card-body",
              children: [
                (0, e.jsx)("h2", {
                  className: "card-title",
                  children: "\u8FD1\u671F\u6BD4\u8D5B",
                }),
                (0, e.jsx)("div", {
                  className: "flex flex-col gap-4",
                  children: s.value.contests.map((t) =>
                    (0, e.jsx)(
                      i,
                      {
                        className: "card bg-base-100",
                        to: `/contest/${t.id}`,
                        children: (0, e.jsxs)("div", {
                          className: "card-body",
                          children: [
                            (0, e.jsxs)("h2", {
                              className: "card-title",
                              children: [
                                t.title,
                                (0, e.jsx)(b, {
                                  beginTime: t.beginTime,
                                  endTime: t.endTime,
                                }),
                                (0, e.jsx)(h, { system: t.system }),
                              ],
                            }),
                            (0, e.jsxs)("p", {
                              children: [
                                "\u5F00\u59CB\u65F6\u95F4\uFF1A",
                                l(t.beginTime),
                                (0, e.jsx)("br", {}),
                                "\u6BD4\u8D5B\u65F6\u957F\uFF1A",
                                p(
                                  new Date(t.endTime).getTime() -
                                    new Date(t.beginTime).getTime()
                                ),
                              ],
                            }),
                          ],
                        }),
                      },
                      t.id
                    )
                  ),
                }),
              ],
            }),
          }),
          (0, e.jsx)("div", {
            className: "card bg-base-200 col-span-8 md:col-span-6",
            children: (0, e.jsxs)("div", {
              className: "card-body",
              children: [
                (0, e.jsx)("h2", {
                  className: "card-title",
                  children: "\u63A8\u8350\u9898\u76EE",
                }),
                (0, e.jsxs)("table", {
                  className: "table-compact table",
                  children: [
                    (0, e.jsx)("thead", {
                      children: (0, e.jsxs)("tr", {
                        children: [
                          (0, e.jsx)("th", { children: "\u9898\u76EE" }),
                          (0, e.jsx)("th", { children: "\u63D0\u4EA4\u6570" }),
                        ],
                      }),
                    }),
                    (0, e.jsx)("tbody", {
                      children: s.value.problems.map((t) =>
                        (0, e.jsxs)(
                          "tr",
                          {
                            children: [
                              (0, e.jsx)("td", {
                                children: (0, e.jsx)(c, { problem: t }),
                              }),
                              (0, e.jsx)("td", {
                                children: t._count.relatedRecords,
                              }),
                            ],
                          },
                          t.id
                        )
                      ),
                    }),
                  ],
                }),
              ],
            }),
          }),
        ],
      }),
    ],
  });
}
export { n as CatchBoundary, m as ErrorBoundary, u as default, N as meta };
