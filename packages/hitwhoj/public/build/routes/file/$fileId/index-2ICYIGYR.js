import { a as p, b as d } from "/build/_shared/chunk-ZPF2YCTJ.js";
import { c as s } from "/build/_shared/chunk-33FVQFAB.js";
import { d as n } from "/build/_shared/chunk-ASHX7EDV.js";
import { d as m, r as u } from "/build/_shared/chunk-KLFOMCVP.js";
import { a as c } from "/build/_shared/chunk-XIHPQXCX.js";
import { f as i } from "/build/_shared/chunk-IYNQWWEV.js";
import { c as l } from "/build/_shared/chunk-P4KF3DFI.js";
import { d as r } from "/build/_shared/chunk-G5WX4PPA.js";
var v = r(c());
var e = r(l());
var y = ({ data: o }) => ({
  title: `\u6587\u4EF6: ${o?.file.filename} - HITwh OJ`,
});
function f() {
  let o = s(),
    t = n(() => o.value.file),
    a = n(() => `/file/${t.value.id}/${t.value.filename}`);
  return (0, e.jsxs)(e.Fragment, {
    children: [
      t.value.mimetype.startsWith("audio/")
        ? (0, e.jsx)("audio", {
            controls: !0,
            src: a.value,
            style: { maxWidth: "100%" },
          })
        : t.value.mimetype.startsWith("video/")
        ? (0, e.jsx)("video", {
            controls: !0,
            src: a.value,
            style: { maxHeight: "80vh", maxWidth: "100%" },
          })
        : t.value.mimetype.startsWith("image/")
        ? (0, e.jsx)("img", { src: a.value, alt: t.value.filename })
        : null,
      (0, e.jsxs)("p", {
        className: "flex gap-4",
        children: [
          t.value.mimetype === "application/pdf" &&
            (0, e.jsxs)(i, {
              to: a.value,
              className: "btn btn-primary gap-2",
              reloadDocument: !0,
              children: [
                (0, e.jsx)(m, {}),
                (0, e.jsx)("span", {
                  children: "\u5728\u6807\u7B7E\u9875\u4E2D\u6253\u5F00",
                }),
              ],
            }),
          (0, e.jsxs)(i, {
            className: "btn btn-primary gap-2",
            to: a.value,
            target: "_blank",
            rel: "noreferrer noopener",
            "aria-label": "download",
            download: !0,
            children: [
              (0, e.jsx)(u, {}),
              (0, e.jsx)("span", { children: "\u4E0B\u8F7D" }),
            ],
          }),
        ],
      }),
    ],
  });
}
export { d as CatchBoundary, p as ErrorBoundary, f as default, y as meta };
