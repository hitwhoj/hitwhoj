import { a as l } from "/build/_shared/chunk-KU4RERCW.js";
import { a as I } from "/build/_shared/chunk-JCTKAXWK.js";
import { a as v } from "/build/_shared/chunk-2QKU57KM.js";
import { a as P } from "/build/_shared/chunk-55TVTKSM.js";
import { a as y } from "/build/_shared/chunk-KAFADMKS.js";
import "/build/_shared/chunk-XCRF7VPJ.js";
import "/build/_shared/chunk-C6VOOSKL.js";
import { b as f } from "/build/_shared/chunk-WF674727.js";
import "/build/_shared/chunk-YFBG3YAE.js";
import "/build/_shared/chunk-KUDQOE27.js";
import "/build/_shared/chunk-NPZ34MRD.js";
import "/build/_shared/chunk-6WF7NKYL.js";
import "/build/_shared/chunk-5CMXDJBZ.js";
import "/build/_shared/chunk-M6DBAY7B.js";
import { a as w, b as g } from "/build/_shared/chunk-ZPF2YCTJ.js";
import { a as u, c as b } from "/build/_shared/chunk-33FVQFAB.js";
import { c as p, d } from "/build/_shared/chunk-ASHX7EDV.js";
import "/build/_shared/chunk-KLFOMCVP.js";
import { a as k } from "/build/_shared/chunk-XIHPQXCX.js";
import { j as m } from "/build/_shared/chunk-IYNQWWEV.js";
import { b as N, c } from "/build/_shared/chunk-P4KF3DFI.js";
import { d as s } from "/build/_shared/chunk-G5WX4PPA.js";
var n = s(I());
var A = s(k());
var h = s(N()),
  e = s(c());
var D = ({ data: r }) => ({
  title: `\u7F16\u8F91\u6BD4\u8D5B: ${r?.contest.title} - HITwh OJ`,
});
function T() {
  let r = b(),
    t = d(() => r.value.contest),
    i = p(t.value.registrationType),
    a = u(),
    x = f();
  return (
    (0, h.useEffect)(() => {
      a.actionSuccess && x.success("\u66F4\u65B0\u6210\u529F");
    }, [a.actionSuccess]),
    (0, e.jsxs)(e.Fragment, {
      children: [
        (0, e.jsx)("h2", { children: "\u4FEE\u6539\u6BD4\u8D5B\u4FE1\u606F" }),
        (0, e.jsxs)(m, {
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
                    children: "\u6807\u9898",
                  }),
                }),
                (0, e.jsx)("input", {
                  className: "input input-bordered",
                  type: "text",
                  name: "title",
                  defaultValue: t.value.title,
                  required: !0,
                  disabled: a.isRunning,
                }),
              ],
            }),
            (0, e.jsx)(P, {
              label: "\u6BD4\u8D5B\u6807\u7B7E",
              name: "tag",
              defaultTags: t.value.tags.map(({ name: o }) => o),
            }),
            (0, e.jsxs)("div", {
              className: "form-control",
              children: [
                (0, e.jsx)("label", {
                  className: "label",
                  children: (0, e.jsx)("span", {
                    className: "label-text",
                    children: "\u4ECB\u7ECD",
                  }),
                }),
                (0, e.jsx)(y, {
                  name: "description",
                  defaultValue: t.value.description,
                }),
              ],
            }),
            (0, e.jsxs)("div", {
              className: "form-control w-full max-w-xs",
              children: [
                (0, e.jsxs)("label", {
                  className: "label",
                  children: [
                    (0, e.jsx)("span", {
                      className: "label-text",
                      children: "\u5F00\u59CB\u65F6\u95F4",
                    }),
                    (0, e.jsx)("span", {
                      className: "label-text-alt",
                      children:
                        Intl.DateTimeFormat().resolvedOptions().timeZone,
                    }),
                  ],
                }),
                (0, e.jsx)("input", {
                  className: "input input-bordered",
                  type: "datetime-local",
                  name: "beginTime",
                  defaultValue: l(new Date(t.value.beginTime).getTime()),
                  required: !0,
                  disabled: a.isRunning,
                }),
              ],
            }),
            (0, e.jsxs)("div", {
              className: "form-control w-full max-w-xs",
              children: [
                (0, e.jsxs)("label", {
                  className: "label",
                  children: [
                    (0, e.jsx)("span", {
                      className: "label-text",
                      children: "\u7ED3\u675F\u65F6\u95F4",
                    }),
                    (0, e.jsx)("span", {
                      className: "label-text-alt",
                      children:
                        Intl.DateTimeFormat().resolvedOptions().timeZone,
                    }),
                  ],
                }),
                (0, e.jsx)("input", {
                  className: "input input-bordered",
                  type: "datetime-local",
                  name: "endTime",
                  defaultValue: l(new Date(t.value.endTime).getTime()),
                  required: !0,
                  disabled: a.isRunning,
                }),
                (0, e.jsx)("input", {
                  type: "hidden",
                  name: "timezone",
                  value: new Date().getTimezoneOffset(),
                  required: !0,
                }),
              ],
            }),
            (0, e.jsxs)("div", {
              className: "form-control w-full max-w-xs",
              children: [
                (0, e.jsx)("label", {
                  className: "label",
                  children: (0, e.jsx)("span", {
                    className: "label-text",
                    children: "\u6BD4\u8D5B\u8D5B\u5236",
                  }),
                }),
                (0, e.jsx)("select", {
                  className: "select select-bordered",
                  name: "system",
                  required: !0,
                  disabled: a.isRunning,
                  defaultValue: t.value.system,
                  children: Object.keys(n.ContestSystem).map((o) =>
                    (0, e.jsx)(
                      "option",
                      { value: o, children: n.ContestSystem[o] },
                      o
                    )
                  ),
                }),
              ],
            }),
            (0, e.jsxs)("div", {
              className: "form-control w-full max-w-xs",
              children: [
                (0, e.jsx)("label", {
                  className: "label",
                  children: (0, e.jsx)("span", {
                    className: "label-text",
                    children: "\u62A5\u540D\u65B9\u5F0F",
                  }),
                }),
                (0, e.jsxs)("div", {
                  className: "flex gap-4",
                  children: [
                    (0, e.jsxs)("select", {
                      className: "select select-bordered",
                      name: "registrationType",
                      value: i.value,
                      onChange: (o) => (i.value = o.target.value),
                      disabled: a.isRunning,
                      children: [
                        (0, e.jsx)("option", {
                          value: n.ContestRegistrationType.Public,
                          children:
                            "\u5141\u8BB8\u4EFB\u4F55\u4EBA\u62A5\u540D",
                        }),
                        (0, e.jsx)("option", {
                          value: n.ContestRegistrationType.Password,
                          children:
                            "\u9700\u8981\u586B\u5199\u9080\u8BF7\u7801",
                        }),
                        (0, e.jsx)("option", {
                          value: n.ContestRegistrationType.Disallow,
                          children: "\u4E0D\u5141\u8BB8\u62A5\u540D",
                        }),
                      ],
                    }),
                    i.value === "Password" &&
                      (0, e.jsx)("input", {
                        className: "input input-bordered",
                        type: "text",
                        name: "registrationPassword",
                        defaultValue: t.value.registrationPassword,
                        disabled: a.isRunning,
                        placeholder: "\u9080\u8BF7\u7801",
                        required: !0,
                      }),
                  ],
                }),
              ],
            }),
            (0, e.jsxs)("div", {
              className: "form-control",
              children: [
                (0, e.jsxs)("label", {
                  className: "label cursor-pointer justify-start gap-2",
                  children: [
                    (0, e.jsx)("input", {
                      className: "checkbox checkbox-primary",
                      type: "checkbox",
                      name: "private",
                      defaultChecked: t.value.private,
                      disabled: a.isRunning,
                    }),
                    (0, e.jsx)("span", {
                      className: "label-text",
                      children:
                        "\u4FDD\u6301\u6BD4\u8D5B\u9690\u85CF\uFF08\u53D6\u6D88\u52FE\u9009\u4E4B\u540E\u7528\u6237\u53EF\u4EE5\u5728\u9996\u9875\u770B\u5230\u8BE5\u6BD4\u8D5B\uFF09",
                    }),
                  ],
                }),
                (0, e.jsxs)("label", {
                  className: "label cursor-pointer justify-start gap-2",
                  children: [
                    (0, e.jsx)("input", {
                      className: "checkbox checkbox-primary",
                      type: "checkbox",
                      name: "joinAfterStart",
                      defaultChecked: t.value.allowJoinAfterStart,
                      disabled: a.isRunning,
                    }),
                    (0, e.jsx)("span", {
                      className: "label-text",
                      children:
                        "\u5141\u8BB8\u6BD4\u8D5B\u5F00\u59CB\u540E\u4E2D\u9014\u52A0\u5165",
                    }),
                  ],
                }),
              ],
            }),
            (0, e.jsx)("div", {
              className: "form-control w-full max-w-xs",
              children: (0, e.jsx)("button", {
                className: "btn btn-primary",
                type: "submit",
                name: "_action",
                value: "UpdateInformation",
                disabled: a.isRunning,
                children: "\u786E\u8BA4\u66F4\u65B0",
              }),
            }),
          ],
        }),
        (0, e.jsx)("h2", { children: "\u4FEE\u6539\u6BD4\u8D5B\u9898\u76EE" }),
        Date.now() > new Date(t.value.beginTime).getTime() &&
          (0, e.jsx)("p", {
            className: "alert alert-warning shadow-lg",
            children:
              "\u5982\u679C\u60A8\u5728\u6BD4\u8D5B\u5F00\u59CB\u540E\u4FEE\u6539\u9898\u76EE\uFF0C\u7CFB\u7EDF\u53EF\u80FD\u4F1A\u51FA\u73B0\u4E00\u4E9B\u5947\u5999\u7684\u7279\u6027",
          }),
        (0, e.jsx)(v, {
          problems: t.value.problems.map(({ problem: o }) => o),
          createAction: "CreateProblem",
          deleteAction: "DeleteProblem",
          moveUpAction: "MoveProblemUp",
          moveDownAction: "MoveProblemDown",
        }),
      ],
    })
  );
}
export { g as CatchBoundary, w as ErrorBoundary, T as default, D as meta };
