import { a as L, b as w, c as C } from "/build/_shared/chunk-H2W53GLY.js";
import { a as R } from "/build/_shared/chunk-RGCNEZEZ.js";
import { a as U } from "/build/_shared/chunk-LGBCQJ4S.js";
import { a as I } from "/build/_shared/chunk-PUHPCD76.js";
import "/build/_shared/chunk-7WG4REHK.js";
import { b as A } from "/build/_shared/chunk-WF674727.js";
import "/build/_shared/chunk-YFBG3YAE.js";
import "/build/_shared/chunk-5CMXDJBZ.js";
import "/build/_shared/chunk-M6DBAY7B.js";
import { a as T, b as F } from "/build/_shared/chunk-ZPF2YCTJ.js";
import { b as D, c as k } from "/build/_shared/chunk-33FVQFAB.js";
import { c as h, d as f } from "/build/_shared/chunk-ASHX7EDV.js";
import {
  C as y,
  K as N,
  d as x,
  i as b,
  j as P,
} from "/build/_shared/chunk-KLFOMCVP.js";
import { a as J } from "/build/_shared/chunk-XIHPQXCX.js";
import "/build/_shared/chunk-IYNQWWEV.js";
import { b as E, c as S } from "/build/_shared/chunk-P4KF3DFI.js";
import { d as m } from "/build/_shared/chunk-G5WX4PPA.js";
var j = m(J());
var H = m(L());
var B = m(U()),
  O = m(E()),
  _ = m(E());
var e = m(S());
var q = ({ data: a }) => ({
  title: `\u7F16\u8F91\u6570\u636E: ${a?.problem.title} - HITwh OJ`,
});
function v({ options: a, ...l }) {
  return (0, e.jsxs)("select", {
    className: "select select-bordered",
    ...l,
    children: [
      (0, e.jsx)("option", {
        value: "",
        disabled: !0,
        children: "\u9009\u62E9\u6587\u4EF6",
      }),
      a.map((t) => (0, e.jsx)("option", { value: t, children: t }, t)),
    ],
  });
}
var $ = 1e3,
  z = 268435456;
function V(a) {
  let l = (0, _.useCallback)(() => {
      a.config.value = {
        ...a.config.value,
        subtasks: [...a.config.value.subtasks, { score: 20, cases: [] }],
      };
    }, [a.config.value]),
    t = f(() => {
      let i = a.config.value.subtasks.reduce((n, s) => n + s.score, 0),
        o = a.config.value.subtasks.some((n) => n.cases.length === 0),
        c = a.config.value.subtasks.some((n) =>
          n.cases.some((s) => s.input === "" || s.output === "")
        ),
        r = i !== 100,
        u = a.config.value.subtasks
          .flatMap((n) => n.cases.flatMap((s) => [s.input, s.output]))
          .filter((n) => n !== ""),
        p = new Set(u).size !== u.length;
      return {
        hasEmptySubtask: o,
        hasEmptyTask: c,
        hasInvalidScore: r,
        hasDuplicatedFile: p,
      };
    });
  return (0, e.jsxs)(e.Fragment, {
    children: [
      (0, e.jsxs)("div", {
        className: "form-control",
        children: [
          (0, e.jsx)("label", {
            className: "label",
            children: (0, e.jsx)("span", {
              className: "label-text",
              children: "\u65F6\u95F4\u9650\u5236 (ms)",
            }),
          }),
          (0, e.jsx)("input", {
            className: "input input-bordered",
            type: "number",
            value: a.config.value.time,
            onChange: (i) => {
              a.config.value = {
                ...a.config.value,
                time: Number(i.target.value),
              };
            },
            placeholder: $.toString(),
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
              children: "\u5185\u5B58\u9650\u5236 (byte)",
            }),
          }),
          (0, e.jsx)("input", {
            className: "input input-bordered",
            type: "number",
            value: a.config.value.memory,
            onChange: (i) => {
              a.config.value = {
                ...a.config.value,
                memory: Number(i.target.value),
              };
            },
            placeholder: z.toString(),
          }),
        ],
      }),
      (0, e.jsxs)("h3", {
        className: "flex items-center justify-between",
        children: [
          (0, e.jsx)("span", { children: "\u5B50\u4EFB\u52A1\u914D\u7F6E" }),
          (0, e.jsxs)("button", {
            className: "btn btn-primary gap-2",
            onClick: l,
            children: [
              (0, e.jsx)(y, {}),
              (0, e.jsx)("span", {
                children: "\u6DFB\u52A0\u5B50\u4EFB\u52A1",
              }),
            ],
          }),
        ],
      }),
      a.config.value.subtasks.map((i, o) => {
        let c = (n) => {
            a.config.value = {
              ...a.config.value,
              subtasks: [
                ...a.config.value.subtasks.slice(0, o),
                n,
                ...a.config.value.subtasks.slice(o + 1),
              ],
            };
          },
          r = () => {
            a.config.value = {
              ...a.config.value,
              subtasks: [
                ...a.config.value.subtasks.slice(0, o),
                ...a.config.value.subtasks.slice(o + 1),
              ],
            };
          },
          u = (n) => {
            c({ ...i, cases: i.cases.filter((s, g) => g !== n) });
          },
          p = () => {
            c({ ...i, cases: [...i.cases, { input: "", output: "" }] });
          };
        return (0, e.jsxs)(
          "div",
          {
            className: "collapse-open collapse overflow-visible",
            tabIndex: 0,
            children: [
              (0, e.jsxs)("div", {
                className: "collapse-title flex items-center justify-between",
                children: [
                  (0, e.jsxs)("span", {
                    className: "inline-flex items-center gap-2",
                    children: [
                      (0, e.jsxs)("span", {
                        children: ["\u5B50\u4EFB\u52A1 ", o + 1],
                      }),
                      (0, e.jsx)("div", {
                        className: "tooltip",
                        "data-tip": "\u5206\u503C",
                        children: (0, e.jsx)("input", {
                          className: "input input-bordered input-sm w-24",
                          type: "number",
                          value: i.score,
                          onChange: (n) => {
                            c({ ...i, score: Number(n.target.value) });
                          },
                        }),
                      }),
                    ],
                  }),
                  (0, e.jsxs)("span", {
                    className: "inline-flex items-center gap-2",
                    children: [
                      (0, e.jsx)("div", {
                        className: "tooltip",
                        "data-tip": "\u65B0\u5EFA\u6D4B\u8BD5\u70B9",
                        children: (0, e.jsx)("button", {
                          className:
                            "btn btn-square btn-success btn-ghost btn-sm",
                          onClick: p,
                          children: (0, e.jsx)(y, {
                            className: "text-success",
                          }),
                        }),
                      }),
                      (0, e.jsx)("div", {
                        className: "tooltip",
                        "data-tip": "\u5220\u9664\u5B50\u4EFB\u52A1",
                        children: (0, e.jsx)("button", {
                          className:
                            "btn btn-square btn-error btn-ghost btn-sm",
                          onClick: r,
                          children: (0, e.jsx)(N, { className: "text-error" }),
                        }),
                      }),
                    ],
                  }),
                ],
              }),
              (0, e.jsx)("div", {
                className: "collapse-content overflow-visible",
                children: i.cases.map((n, s) => {
                  let g = (d) => {
                    c({
                      ...i,
                      cases: [
                        ...i.cases.slice(0, s),
                        d,
                        ...i.cases.slice(s + 1),
                      ],
                    });
                  };
                  return (0, e.jsxs)(
                    "div",
                    {
                      className: "flex items-center gap-2",
                      children: [
                        (0, e.jsxs)("span", {
                          children: ["\u6D4B\u8BD5\u70B9 ", s + 1],
                        }),
                        (0, e.jsx)(b, {}),
                        (0, e.jsx)("div", {
                          className: "tooltip",
                          "data-tip": "\u8F93\u5165\u6587\u4EF6",
                          children: (0, e.jsx)(v, {
                            className: "select select-bordered select-sm",
                            value: n.input,
                            options: a.data,
                            onChange: (d) => {
                              g({ ...n, input: d.target.value });
                            },
                          }),
                        }),
                        (0, e.jsx)(P, {}),
                        (0, e.jsx)("div", {
                          className: "tooltip",
                          "data-tip": "\u8F93\u51FA\u6587\u4EF6",
                          children: (0, e.jsx)(v, {
                            className:
                              "select tooltip select-bordered select-sm",
                            value: n.output,
                            options: a.data,
                            onChange: (d) => {
                              g({ ...n, output: d.target.value });
                            },
                          }),
                        }),
                        (0, e.jsx)("div", {
                          className: "tooltip",
                          "data-tip": "\u5220\u9664\u6D4B\u8BD5\u70B9",
                          children: (0, e.jsx)("button", {
                            className:
                              "btn btn-square btn-error btn-ghost btn-sm",
                            children: (0, e.jsx)(N, {
                              className: "text-error cursor-pointer",
                              onClick: () => u(s),
                            }),
                          }),
                        }),
                      ],
                    },
                    s
                  );
                }),
              }),
            ],
          },
          o
        );
      }),
      (0, e.jsxs)("div", {
        className: "my-4 flex flex-col gap-2",
        children: [
          !a.config.value.subtasks.length &&
            (0, e.jsx)("div", {
              className: "alert alert-warning",
              children: "\u8FD8\u6CA1\u6709\u4EFB\u4F55\u5B50\u4EFB\u52A1",
            }),
          a.config.value.subtasks.length > 0 &&
            t.value.hasInvalidScore &&
            (0, e.jsx)("div", {
              className: "alert alert-warning",
              children:
                "\u5B50\u4EFB\u52A1\u5206\u6570\u4E4B\u548C\u4E0D\u7B49\u4E8E 100",
            }),
          t.value.hasEmptySubtask &&
            (0, e.jsx)("div", {
              className: "alert alert-warning",
              children: "\u5B58\u5728\u7A7A\u7684\u5B50\u4EFB\u52A1",
            }),
          t.value.hasEmptyTask &&
            (0, e.jsx)("div", {
              className: "alert alert-warning",
              children:
                "\u5B58\u5728\u672A\u9009\u62E9\u7684\u6D4B\u8BD5\u70B9",
            }),
          t.value.hasDuplicatedFile &&
            (0, e.jsx)("div", {
              className: "alert alert-warning",
              children:
                "\u5B58\u5728\u91CD\u590D\u4F7F\u7528\u7684\u6D4B\u8BD5\u6570\u636E",
            }),
        ],
      }),
    ],
  });
}
function W(a) {
  return (0, e.jsxs)(e.Fragment, {
    children: [
      (0, e.jsxs)("div", {
        className: "form-control",
        children: [
          (0, e.jsx)("label", {
            className: "label",
            children: (0, e.jsx)("span", {
              className: "label-text",
              children: "\u4EA4\u4E92\u4EE3\u7801",
            }),
          }),
          (0, e.jsx)(v, {
            options: a.data,
            value: a.config.value.interactive,
            onChange: (l) => {
              a.config.value = {
                ...a.config.value,
                interactive: l.target.value,
              };
            },
          }),
        ],
      }),
      (0, e.jsx)("div", {
        className: "my-4 flex flex-col gap-2",
        children:
          !a.config.value.interactive &&
          (0, e.jsx)("div", {
            className: "alert alert-warning",
            children: "\u8BF7\u9009\u62E9\u4EA4\u4E92\u4EE3\u7801",
          }),
      }),
    ],
  });
}
function X(a) {
  return (0, e.jsxs)(e.Fragment, {
    children: [
      (0, e.jsxs)("div", {
        className: "form-control",
        children: [
          (0, e.jsx)("label", {
            className: "label",
            children: (0, e.jsx)("span", {
              className: "label-text",
              children: "\u6570\u636E\u6784\u9020\u4EE3\u7801 (mkdata.cpp)",
            }),
          }),
          (0, e.jsx)(v, {
            options: a.data,
            value: a.config.value.mkdata,
            onChange: (l) => {
              a.config.value = { ...a.config.value, mkdata: l.target.value };
            },
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
              children: "\u6807\u51C6\u4EE3\u7801 (std.cpp)",
            }),
          }),
          (0, e.jsx)(v, {
            options: a.data,
            value: a.config.value.std,
            onChange: (l) => {
              a.config.value = { ...a.config.value, std: l.target.value };
            },
          }),
        ],
      }),
      (0, e.jsxs)("div", {
        className: "my-4 flex flex-col gap-2",
        children: [
          (!a.config.value.mkdata || !a.config.value.std) &&
            (0, e.jsx)("div", {
              className: "alert alert-warning",
              children:
                "\u8BF7\u9009\u62E9\u6570\u636E\u6784\u9020\u4EE3\u7801\u548C\u6807\u51C6\u4EE3\u7801",
            }),
          (0, e.jsx)("div", {
            className: "alert alert-warning",
            children:
              "TODO \u6211\u8FD8\u6CA1\u5199\u5B8C\uFF0C\u4F60\u5148\u522B\u6025",
          }),
        ],
      }),
    ],
  });
}
function Y(a) {
  return (0, e.jsxs)(e.Fragment, {
    children: [
      (0, e.jsxs)("div", {
        className: "form-control",
        children: [
          (0, e.jsx)("label", {
            className: "label",
            children: (0, e.jsx)("span", {
              className: "label-text",
              children: "\u7B54\u6848",
            }),
          }),
          (0, e.jsx)("input", {
            className: "input input-bordered",
            type: "text",
            value: a.config.value.answer,
            onChange: (l) => {
              a.config.value = { ...a.config.value, answer: l.target.value };
            },
          }),
        ],
      }),
      (0, e.jsx)("div", {
        className: "my-4 flex flex-col gap-2",
        children:
          !a.config.value.answer &&
          (0, e.jsx)("div", {
            className: "alert alert-warning",
            children: "\u8BF7\u8F93\u5165\u7B54\u6848",
          }),
      }),
    ],
  });
}
function G({ config: a, data: l }) {
  let t = h(a),
    i = D(),
    o = A();
  return (
    (0, O.useEffect)(() => {
      i.actionSuccess && o.success("\u66F4\u65B0\u914D\u7F6E\u6210\u529F");
    }, [i.actionSuccess]),
    (0, e.jsxs)("div", {
      className: "mb-24 flex flex-col gap-2",
      children: [
        (0, e.jsxs)("div", {
          className: "form-control",
          children: [
            (0, e.jsx)("label", {
              className: "label",
              children: (0, e.jsx)("span", {
                className: "label-text",
                children: "\u8BC4\u6D4B\u65B9\u5F0F",
              }),
            }),
            (0, e.jsxs)("select", {
              className: "select select-bordered w-full max-w-xs",
              value: t.value.type,
              onChange: (c) => {
                let r = c.target.value;
                r === "default"
                  ? (t.value = { type: "default", subtasks: [] })
                  : r === "interactive"
                  ? (t.value = { type: "interactive", interactive: "" })
                  : r === "dynamic"
                  ? (t.value = {
                      type: "dynamic",
                      mkdata: "",
                      std: "",
                      subtasks: [],
                    })
                  : (t.value = { type: "submit_answer", answer: "" });
              },
              children: [
                (0, e.jsx)("option", {
                  value: "default",
                  children: "\u9ED8\u8BA4",
                }),
                (0, e.jsx)("option", {
                  value: "interactive",
                  children: "\u4EA4\u4E92",
                }),
                (0, e.jsx)("option", {
                  value: "dynamic",
                  children: "\u52A8\u6001",
                }),
                (0, e.jsx)("option", {
                  value: "submit_answer",
                  children: "\u63D0\u7B54",
                }),
              ],
            }),
          ],
        }),
        t.value.type === "default" && (0, e.jsx)(V, { data: l, config: t }),
        t.value.type === "interactive" && (0, e.jsx)(W, { data: l, config: t }),
        t.value.type === "dynamic" && (0, e.jsx)(X, { data: l, config: t }),
        t.value.type === "submit_answer" &&
          (0, e.jsx)(Y, { data: l, config: t }),
        (0, e.jsxs)(i.Form, {
          method: "post",
          encType: "multipart/form-data",
          children: [
            (0, e.jsx)("textarea", {
              name: "config",
              value: JSON.stringify(t.value),
              hidden: !0,
              readOnly: !0,
            }),
            (0, e.jsx)("button", {
              className: "btn btn-primary w-full",
              type: "submit",
              name: "_action",
              value: "updateConfig",
              disabled: i.isRunning,
              children: "\u786E\u8BA4\u66F4\u65B0",
            }),
            (0, e.jsxs)("div", {
              className: "collapse collapse-arrow",
              children: [
                (0, e.jsx)("input", { type: "checkbox" }),
                (0, e.jsx)("div", {
                  className: "collapse-title text-xl font-medium",
                  children: "\u67E5\u770B\u751F\u6210 JSON \u6587\u4EF6",
                }),
                (0, e.jsx)("div", {
                  className: "collapse-content",
                  children: (0, e.jsx)(R, {
                    language: "json",
                    children: JSON.stringify(t.value, null, 2),
                  }),
                }),
              ],
            }),
          ],
        }),
      ],
    })
  );
}
function M() {
  let a = k(),
    l = f(() => a.value.problem.files),
    t = f(() => a.value.problem.data),
    i = f(() => a.value.config),
    o = f(() =>
      i.value ? JSON.parse(i.value) : { type: "default", subtasks: [] }
    ),
    c = f(() => t.value.filter(({ filename: u }) => u !== "config.json")),
    r = h(!1);
  return (0, e.jsxs)(e.Fragment, {
    children: [
      !i.value &&
        (0, e.jsx)("div", {
          className: "alert alert-warning",
          children:
            "\u60A8\u8FD8\u6CA1\u6709\u8FDB\u884C\u9898\u76EE\u7684\u8BC4\u6D4B\u914D\u7F6E\uFF0C\u9898\u76EE\u5F53\u524D\u65E0\u6CD5\u88AB\u8BC4\u6D4B",
        }),
      (0, e.jsxs)("h2", {
        className: "flex items-center justify-between",
        children: [
          (0, e.jsx)("span", { children: "\u6D4B\u8BD5\u6570\u636E" }),
          (0, e.jsxs)("span", {
            className: "inline-flex items-center gap-4",
            children: [
              (0, e.jsxs)("button", {
                className: "btn btn-primary gap-2",
                onClick: () => (r.value = !0),
                children: [
                  (0, e.jsx)("span", { children: "\u914D\u7F6E" }),
                  (0, e.jsx)(x, {}),
                ],
              }),
              (0, e.jsx)(C, { uploadAction: "uploadData" }),
            ],
          }),
        ],
      }),
      (0, e.jsx)("p", {
        children:
          "\u7528\u4E8E\u8BC4\u6D4B\u7684\u6570\u636E\u6587\u4EF6\u3002",
      }),
      (0, e.jsxs)("p", {
        children: [
          "\u5173\u4E8E\u8BC4\u6D4B\u7684\u914D\u7F6E\u6587\u4EF6 ",
          (0, e.jsx)("code", { children: "config.json" }),
          "\uFF0C\u60A8\u53EF\u4EE5\u9009\u62E9\u4F7F\u7528\u6211\u4EEC\u63D0\u4F9B\u7684\u5728\u7EBF\u7F16\u8F91\u5DE5\u5177\uFF0C\u4E5F\u53EF\u4EE5\u9009\u62E9\u624B\u52A8\u7F16\u8F91\u597D\u540E\u4E0A\u4F20\u3002",
        ],
      }),
      (0, e.jsx)(w, { files: c.value, deleteAction: "removeData" }),
      (0, e.jsxs)("h2", {
        className: "flex items-center justify-between",
        children: [
          (0, e.jsx)("span", { children: "\u9644\u52A0\u6587\u4EF6" }),
          (0, e.jsx)(C, { uploadAction: "uploadFile" }),
        ],
      }),
      (0, e.jsx)("p", {
        children:
          "\u9898\u76EE\u7684\u9644\u52A0\u8D44\u6599\uFF0C\u4F8B\u5982\u6837\u4F8B\u6570\u636E\u3001PDF \u9898\u9762\u7B49",
      }),
      (0, e.jsx)(w, { files: l.value, deleteAction: "removeFile" }),
      (0, e.jsx)(I, {
        visible: r.value,
        className: "bg-base-100 overflow-auto",
        children: (0, e.jsxs)("div", {
          className: "mx-auto w-full max-w-xl p-4",
          children: [
            (0, e.jsxs)("button", {
              className: "btn btn-ghost gap-2",
              onClick: () => (r.value = !1),
              children: [
                (0, e.jsx)(b, {}),
                (0, e.jsx)("span", { children: "\u8FD4\u56DE" }),
              ],
            }),
            (0, e.jsx)("h2", {
              children: "\u914D\u7F6E\u8BC4\u6D4B\u4FE1\u606F",
            }),
            (0, e.jsx)(G, {
              config: o.value,
              data: c.value.map(({ filename: u }) => u),
            }),
          ],
        }),
      }),
    ],
  });
}
export { F as CatchBoundary, T as ErrorBoundary, M as default, q as meta };
