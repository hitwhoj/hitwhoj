import { c as f } from "/build/_shared/chunk-7WG4REHK.js";
import { b as a } from "/build/_shared/chunk-33FVQFAB.js";
import { G as u, H as c } from "/build/_shared/chunk-KLFOMCVP.js";
import { f as s } from "/build/_shared/chunk-IYNQWWEV.js";
import { b as h, c as n } from "/build/_shared/chunk-P4KF3DFI.js";
import { b as y, d as o } from "/build/_shared/chunk-G5WX4PPA.js";
var g = y((R, F) => {
  F.exports = {};
});
var l = o(n());
function b({ file: m, deleteAction: i }) {
  let e = a();
  return (0, l.jsxs)(e.Form, {
    method: "post",
    encType: "multipart/form-data",
    children: [
      (0, l.jsx)("input", { type: "hidden", name: "fid", value: m.id }),
      (0, l.jsx)("button", {
        className: "btn btn-error btn-square btn-sm",
        type: "submit",
        name: "_action",
        value: i,
        disabled: e.isRunning,
        children: (0, l.jsx)(u, { className: "h-4 w-4" }),
      }),
    ],
  });
}
var t = o(n());
function N({ files: m, deleteAction: i }) {
  return (0, t.jsxs)("table", {
    className: "table-compact table",
    children: [
      (0, t.jsx)("thead", {
        children: (0, t.jsxs)("tr", {
          children: [
            (0, t.jsx)("td", { children: "\u6587\u4EF6\u540D" }),
            (0, t.jsx)("td", { children: "\u6587\u4EF6\u7C7B\u578B" }),
            (0, t.jsx)("td", { children: "\u6587\u4EF6\u5927\u5C0F" }),
            (0, t.jsx)("td", { children: "\u64CD\u4F5C" }),
          ],
        }),
      }),
      (0, t.jsx)("tbody", {
        children: m.map((e) =>
          (0, t.jsxs)(
            "tr",
            {
              children: [
                (0, t.jsx)("td", {
                  children: (0, t.jsx)(s, {
                    to: `/file/${e.id}`,
                    target: "_blank",
                    children: e.filename,
                  }),
                }),
                (0, t.jsx)("td", { children: e.mimetype }),
                (0, t.jsx)("td", { children: f(e.filesize) }),
                (0, t.jsx)("td", {
                  children: (0, t.jsx)(b, { file: e, deleteAction: i }),
                }),
              ],
            },
            e.id
          )
        ),
      }),
    ],
  });
}
var p = o(h());
var r = o(n());
function H({ uploadAction: m }) {
  let i = a(),
    e = (0, p.useRef)(null),
    d = (0, p.useRef)(null);
  return (
    (0, p.useEffect)(() => {
      i.actionSuccess && e.current?.reset();
    }, [i.actionSuccess]),
    (0, r.jsxs)(i.Form, {
      method: "post",
      encType: "multipart/form-data",
      ref: e,
      children: [
        (0, r.jsx)("input", {
          type: "file",
          name: "file",
          multiple: !0,
          hidden: !0,
          ref: d,
          onInput: () => i.submit(e.current),
        }),
        (0, r.jsx)("input", { type: "hidden", name: "_action", value: m }),
        (0, r.jsxs)("button", {
          className: "btn btn-primary gap-2",
          type: "button",
          onClick: () => d.current?.click(),
          disabled: i.isRunning,
          children: [
            (0, r.jsx)(c, {}),
            (0, r.jsx)("span", { children: "\u4E0A\u4F20\u6587\u4EF6\u634F" }),
          ],
        }),
      ],
    })
  );
}
export { g as a, N as b, H as c };
