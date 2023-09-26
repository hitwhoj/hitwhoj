import { a as R } from "/build/_shared/chunk-55TVTKSM.js";
import { a as U } from "/build/_shared/chunk-KAFADMKS.js";
import "/build/_shared/chunk-XCRF7VPJ.js";
import "/build/_shared/chunk-C6VOOSKL.js";
import { b as f } from "/build/_shared/chunk-WF674727.js";
import "/build/_shared/chunk-YFBG3YAE.js";
import "/build/_shared/chunk-KUDQOE27.js";
import "/build/_shared/chunk-NPZ34MRD.js";
import { a as _ } from "/build/_shared/chunk-6WF7NKYL.js";
import "/build/_shared/chunk-5CMXDJBZ.js";
import "/build/_shared/chunk-M6DBAY7B.js";
import { a as T, b as k } from "/build/_shared/chunk-ZPF2YCTJ.js";
import { a as N, b, c as D } from "/build/_shared/chunk-33FVQFAB.js";
import { c as v, d } from "/build/_shared/chunk-ASHX7EDV.js";
import {
  C as E,
  G as x,
  h as I,
  k as A,
} from "/build/_shared/chunk-KLFOMCVP.js";
import { a as q } from "/build/_shared/chunk-XIHPQXCX.js";
import { j as S } from "/build/_shared/chunk-IYNQWWEV.js";
import { b as y, c as p } from "/build/_shared/chunk-P4KF3DFI.js";
import { d as s } from "/build/_shared/chunk-G5WX4PPA.js";
var M = s(y());
var B = s(q());
var w = s(y());
var l = s(p());
function h(t) {
  let o = b(),
    i = f(),
    u = v([]);
  (0, w.useEffect)(() => {
    let r = new AbortController(),
      m = r.signal;
    return (
      fetch(`/team/${t.teamId}/problem/data`, { signal: m })
        .then((c) => c.json())
        .then((c) => (u.value = c.problems)),
      () => r.abort()
    );
  }, []);
  let n = v(""),
    P = d(() => u.value.filter(({ id: r }) => !t.existProblem.includes(r))),
    L = d(() =>
      P.value.filter(
        ({ title: r, tags: m, id: c }) =>
          c.toString().includes(n.value) ||
          r.includes(n.value) ||
          m.some(({ name: F }) => F.includes(n.value))
      )
    ),
    g = d(() => {
      let r = n.value.indexOf(".");
      if (r === -1) return 0;
      let m = parseInt(n.value.slice(0, r));
      return P.value.some((c) => c.id === m) ? m : 0;
    });
  return (
    (0, w.useEffect)(() => {
      o.actionSuccess &&
        ((n.value = ""), i.success("\u66F4\u65B0\u6210\u529F"));
    }, [o.actionSuccess]),
    (0, l.jsxs)(o.Form, {
      method: "post",
      className: "not-prose inline-flex gap-4",
      children: [
        (0, l.jsx)("input", {
          type: "hidden",
          name: "pid",
          value: g.value,
          required: !0,
        }),
        (0, l.jsxs)("label", {
          className: "input-group",
          children: [
            (0, l.jsxs)("div", {
              className: "dropdown",
              children: [
                (0, l.jsx)("input", {
                  className: "input input-bordered",
                  placeholder: "\u641C\u7D22\u9898\u76EE...",
                  list: "search-problem",
                  value: n.value,
                  disabled: o.isRunning,
                  onChange: (r) => (n.value = r.target.value),
                }),
                (0, l.jsx)("datalist", {
                  id: "search-problem",
                  children: L.value.map(({ id: r, title: m }) =>
                    (0, l.jsx)("option", { value: `${r}. ${m}` }, r)
                  ),
                }),
              ],
            }),
            (0, l.jsxs)("button", {
              className: "btn gap-2",
              type: "submit",
              name: "_action",
              value: t.createAction,
              disabled: o.isRunning || !g,
              children: [
                (0, l.jsx)(E, {}),
                "\u6DFB\u52A0\u56E2\u961F\u9898\u76EE",
              ],
            }),
          ],
        }),
      ],
    })
  );
}
var e = s(p());
function $(t) {
  let o = b();
  return (0, e.jsxs)(o.Form, {
    method: "post",
    className: "inline-flex gap-2",
    children: [
      (0, e.jsx)("input", { type: "hidden", name: "pid", value: t.pid }),
      (0, e.jsx)("button", {
        className: "btn btn-primary btn-error btn-square btn-sm",
        type: "submit",
        name: "_action",
        value: t.deleteAction,
        disabled: o.isRunning,
        children: (0, e.jsx)(x, {}),
      }),
      (0, e.jsx)("button", {
        className: "btn btn-ghost btn-square btn-sm",
        type: "submit",
        name: "_action",
        value: t.moveUpAction,
        disabled: t.first || o.isRunning,
        children: (0, e.jsx)(A, {}),
      }),
      (0, e.jsx)("button", {
        className: "btn btn-ghost btn-square btn-sm",
        type: "submit",
        name: "_action",
        value: t.moveDownAction,
        disabled: t.last || o.isRunning,
        children: (0, e.jsx)(I, {}),
      }),
    ],
  });
}
function C(t) {
  return (0, e.jsxs)(e.Fragment, {
    children: [
      (0, e.jsx)(h, {
        teamId: t.teamId,
        createAction: t.createAction,
        existProblem: t.problems.map(({ id: o }) => o),
      }),
      (0, e.jsxs)("table", {
        className: "not-prose table w-full",
        children: [
          (0, e.jsx)("thead", {
            children: (0, e.jsxs)("tr", {
              children: [
                (0, e.jsx)("th", { className: "w-16" }),
                (0, e.jsx)("th", { children: "\u56E2\u961F\u9898\u76EE" }),
                (0, e.jsx)("th", {
                  className: "w-16 text-center",
                  children: "\u64CD\u4F5C",
                }),
              ],
            }),
          }),
          (0, e.jsx)("tbody", {
            children: t.problems.map((o, i) =>
              (0, e.jsxs)(
                "tr",
                {
                  children: [
                    (0, e.jsx)("th", {
                      className: "text-center",
                      children: o.id,
                    }),
                    (0, e.jsx)("td", {
                      children: (0, e.jsx)(_, { problem: o }),
                    }),
                    (0, e.jsx)("td", {
                      children: (0, e.jsx)($, {
                        pid: o.id,
                        first: i === 0,
                        last: i === t.problems.length - 1,
                        deleteAction: t.deleteAction,
                        moveUpAction: t.moveUpAction,
                        moveDownAction: t.moveDownAction,
                      }),
                    }),
                  ],
                },
                o.id
              )
            ),
          }),
        ],
      }),
    ],
  });
}
var a = s(p());
var H = ({ data: t }) => ({
  title: `\u7F16\u8F91\u9898\u5355: ${t?.problemSet.title} - HITwh OJ`,
});
function O() {
  let t = D(),
    o = d(() => t.value.problemSet),
    i = N(),
    u = f();
  return (
    (0, M.useEffect)(() => {
      i.actionSuccess && u.success("\u66F4\u65B0\u6210\u529F");
    }, [i.actionSuccess]),
    (0, a.jsxs)(a.Fragment, {
      children: [
        (0, a.jsx)("h3", {
          children: "\u7F16\u8F91\u56E2\u961F\u9898\u5355\u4FE1\u606F",
        }),
        (0, a.jsxs)(S, {
          method: "post",
          className: "form-control gap-4",
          children: [
            (0, a.jsxs)("div", {
              className: "form-control w-full max-w-xs",
              children: [
                (0, a.jsx)("label", {
                  className: "label",
                  children: (0, a.jsx)("span", {
                    className: "label-text",
                    children: "\u6807\u9898",
                  }),
                }),
                (0, a.jsx)("input", {
                  className: "input input-bordered",
                  type: "text",
                  name: "title",
                  defaultValue: o.value.title,
                  disabled: i.isRunning,
                  required: !0,
                }),
              ],
            }),
            (0, a.jsx)(R, {
              label: "\u9898\u5355\u6807\u7B7E",
              name: "tag",
              defaultTags: o.value.tags.map(({ name: n }) => n),
            }),
            (0, a.jsxs)("div", {
              className: "form-control",
              children: [
                (0, a.jsx)("label", {
                  className: "label",
                  children: (0, a.jsx)("span", {
                    className: "label-text",
                    children: "\u7B80\u4ECB",
                  }),
                }),
                (0, a.jsx)(U, {
                  name: "description",
                  defaultValue: o.value.description,
                }),
              ],
            }),
            (0, a.jsx)("div", {
              className: "form-control",
              children: (0, a.jsxs)("label", {
                className: "label cursor-pointer justify-start gap-2",
                children: [
                  (0, a.jsx)("input", {
                    className: "checkbox checkbox-primary",
                    type: "checkbox",
                    name: "private",
                    defaultChecked: o.value.private,
                    disabled: i.isRunning,
                  }),
                  (0, a.jsx)("span", {
                    className: "label-text",
                    children: "\u4FDD\u6301\u9898\u5355\u9690\u85CF",
                  }),
                ],
              }),
            }),
            (0, a.jsx)("div", {
              className: "form-control w-full max-w-xs",
              children: (0, a.jsx)("button", {
                className: "btn btn-primary",
                type: "submit",
                name: "_action",
                value: "updateInformation",
                disabled: i.isRunning,
                children: "\u786E\u8BA4\u4FEE\u6539",
              }),
            }),
          ],
        }),
        (0, a.jsx)("h3", { children: "\u9898\u76EE" }),
        (0, a.jsx)(C, {
          teamId: t.value.teamId,
          problems: o.value.problems.map(({ problem: n }) => n),
          createAction: "createProblem",
          deleteAction: "deleteProblem",
          moveUpAction: "moveProblemUp",
          moveDownAction: "moveProblemDown",
        }),
      ],
    })
  );
}
export { k as CatchBoundary, T as ErrorBoundary, O as default, H as meta };
