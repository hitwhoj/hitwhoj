import { a as w } from "/build/_shared/chunk-XCRF7VPJ.js";
import { b } from "/build/_shared/chunk-WF674727.js";
import { d as g } from "/build/_shared/chunk-YFBG3YAE.js";
import { a as k } from "/build/_shared/chunk-KUDQOE27.js";
import { b as p } from "/build/_shared/chunk-33FVQFAB.js";
import { c as o } from "/build/_shared/chunk-ASHX7EDV.js";
import { f as v } from "/build/_shared/chunk-IYNQWWEV.js";
import { b as x, c as f } from "/build/_shared/chunk-P4KF3DFI.js";
import { d as l } from "/build/_shared/chunk-G5WX4PPA.js";
var h = l(x());
var e = l(f());
function F(i) {
  let a = p(),
    t = o(!1),
    d = o(""),
    n = o(i.defaultValue ?? "Write **Markdown** here."),
    c = g(),
    m = b();
  (0, h.useEffect)(() => {
    if (a.actionSuccess && a.data.value) {
      let s = `
![image.png](/file/${a.data.value[0]}/image.png)
`;
      (d.value = s), m.success("\u4E0A\u4F20\u56FE\u7247\u6210\u529F");
    }
  }, [a.actionSuccess]);
  let N = o("markdown");
  return (0, e.jsxs)("div", {
    className: "rounded-box border-base-300 overflow-hidden border",
    children: [
      i.name &&
        (0, e.jsx)("textarea", {
          name: i.name,
          value: n.value,
          hidden: !0,
          readOnly: !0,
        }),
      (0, e.jsxs)("div", {
        className: "flex items-center",
        children: [
          (0, e.jsxs)("div", {
            className: "tabs flex-1",
            children: [
              (0, e.jsx)("span", {
                className: `tab tab-bordered ${t.value ? "" : "tab-active"}`,
                onClick: () => (t.value = !1),
                children: "\u4EE3\u7801",
              }),
              (0, e.jsx)("span", {
                className: `tab tab-bordered ${t.value ? "tab-active" : ""}`,
                onClick: () => (t.value = !0),
                children: "\u9884\u89C8",
              }),
            ],
          }),
          (0, e.jsx)("div", {
            className: "px-4",
            children: (0, e.jsx)(v, {
              to: "/docs/help/markdown.md",
              target: "_blank",
              children: "\u4F7F\u7528\u8BF4\u660E",
            }),
          }),
        ],
      }),
      (0, e.jsx)("div", {
        className: "h-96 overflow-auto",
        children: t.value
          ? (0, e.jsx)("div", {
              className: "p-4",
              children: (0, e.jsx)(k, { children: n.value }),
            })
          : (0, e.jsx)("div", {
              className: "h-full",
              onPaste: (s) => {
                let u = s.clipboardData.files[0];
                if (u && u.type.indexOf("image") > -1 && c.value) {
                  let r = new FormData();
                  r.append("file", s.clipboardData.files[0]),
                    r.append("_action", "uploadFile"),
                    a.submit(r, {
                      action: `/user/${c.value}/files`,
                      encType: "multipart/form-data",
                      method: "post",
                    }),
                    m.info("\u4E0A\u4F20\u56FE\u7247\u4E2D...");
                }
              },
              children: (0, e.jsx)(w, {
                code: n,
                language: N.value,
                insertText: d,
              }),
            }),
      }),
    ],
  });
}
export { F as a };
