import { a as g } from "/build/_shared/chunk-PUHPCD76.js";
import { a as v } from "/build/_shared/chunk-XCRF7VPJ.js";
import "/build/_shared/chunk-C6VOOSKL.js";
import "/build/_shared/chunk-YFBG3YAE.js";
import "/build/_shared/chunk-NPZ34MRD.js";
import { c as n } from "/build/_shared/chunk-ASHX7EDV.js";
import { k as i } from "/build/_shared/chunk-IYNQWWEV.js";
import { b as f, c as d } from "/build/_shared/chunk-P4KF3DFI.js";
import { d as s } from "/build/_shared/chunk-G5WX4PPA.js";
var u = s(f());
var e = s(d());
function p() {
  let t = n(`#include <stdio.h>
int main() {
  int a, b;
  scanf("%d%d", &a, &b);
  printf("%d\\n", a + b);
}
`),
    r = n("114 514"),
    o = n(""),
    l = n("cpp");
  return (
    (0, u.useEffect)(() => {
      let a = localStorage.getItem("playground.code");
      typeof a == "string" && (t.value = a);
      let c = localStorage.getItem("playground.language");
      typeof c == "string" && (l.value = c);
    }, []),
    i(
      (0, u.useCallback)(() => {
        localStorage.setItem("playground.code", t.value),
          localStorage.setItem("playground.language", l.value);
      }, [t.value, l.value])
    ),
    (0, e.jsx)(g, {
      visible: !0,
      className: "bg-base-100",
      children: (0, e.jsxs)("div", {
        className: "flex h-full flex-row",
        children: [
          (0, e.jsx)("div", {
            className: "flex-1",
            children: (0, e.jsx)(v, { code: t, language: l.value }),
          }),
          (0, e.jsxs)("div", {
            className: "w-96 overflow-auto p-4",
            children: [
              (0, e.jsx)("h2", { children: "\u9009\u62E9\u8BED\u8A00" }),
              (0, e.jsxs)("select", {
                className: "select select-bordered",
                value: l.value,
                onChange: (a) => (l.value = a.currentTarget.value),
                children: [
                  (0, e.jsx)("option", { value: "c", children: "C" }),
                  (0, e.jsx)("option", { value: "cpp", children: "C++" }),
                  (0, e.jsx)("option", { value: "python", children: "Python" }),
                ],
              }),
              (0, e.jsx)("h2", { children: "\u8F93\u5165" }),
              (0, e.jsx)("textarea", {
                className: "textarea textarea-bordered w-full",
                value: r.value,
                onChange: (a) => (r.value = a.target.value),
              }),
              (0, e.jsx)("button", {
                className: "btn",
                onClick: () => {
                  (o.value = "[INFO] Initializing..."),
                    import("/build/_shared/wasi-AZG6KXMA.js")
                      .then(
                        ({ runCode: a }) => (
                          (o.value = "[INFO] Downloading..."),
                          a(t.value, r.value, l.value)
                        )
                      )
                      .then((a) => (o.value = a));
                },
                children: "\u70B9\u51FB\u8FD0\u884C",
              }),
              o.value &&
                (0, e.jsxs)(e.Fragment, {
                  children: [
                    (0, e.jsx)("h2", { children: "\u8F93\u51FA" }),
                    (0, e.jsx)("pre", { children: o.value }),
                  ],
                }),
              (0, e.jsx)("div", {
                className: "alert alert-info mt-4",
                children:
                  "\u6CE8\u610F\uFF1A\u5B9E\u9A8C\u6027\u529F\u80FD\uFF0C\u76EE\u524D\u6682\u4E0D\u652F\u6301 bits/stdc++.h \u5934\u6587\u4EF6",
              }),
            ],
          }),
        ],
      }),
    })
  );
}
export { p as default };
