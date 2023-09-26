import { a as b, c as i } from "/build/_shared/chunk-ASHX7EDV.js";
import { F as v, K as g } from "/build/_shared/chunk-KLFOMCVP.js";
import { c as u } from "/build/_shared/chunk-P4KF3DFI.js";
import { d as s } from "/build/_shared/chunk-G5WX4PPA.js";
var a = s(u());
function d(l) {
  let t = i(l.defaultTags),
    e = i("");
  return (0, a.jsxs)("div", {
    className: "form-control gap-2",
    children: [
      (l.label || l.alt) &&
        (0, a.jsxs)("label", {
          className: "label",
          children: [
            l.label &&
              (0, a.jsx)("span", {
                className: "label-text",
                children: l.label,
              }),
            l.alt &&
              (0, a.jsx)("span", {
                className: "label-text-alt",
                children: l.alt,
              }),
          ],
        }),
      (0, a.jsx)("div", {
        className: "flex flex-wrap gap-2",
        children: t.value.map((n) =>
          (0, a.jsxs)(
            "div",
            {
              className: "badge inline-flex gap-1",
              children: [
                (0, a.jsx)("input", { type: "hidden", name: l.name, value: n }),
                (0, a.jsx)(v, {}),
                n,
                (0, a.jsx)(g, {
                  className: "cursor-pointer",
                  onClick: () => {
                    t.value = t.value.filter((c) => c !== e.value);
                  },
                }),
              ],
            },
            n
          )
        ),
      }),
      (0, a.jsxs)("div", {
        className: "flex gap-4",
        children: [
          (0, a.jsx)("input", {
            type: "text",
            className: "input input-bordered",
            value: e.value,
            onChange: (n) => (e.value = n.target.value),
          }),
          (0, a.jsx)("button", {
            className: "btn btn-primary",
            type: "button",
            onClick: () => {
              e.value &&
                b(() => {
                  (t.value = [...t.value, e.value]), (e.value = "");
                });
            },
            children: "\u6DFB\u52A0\u6807\u7B7E",
          }),
        ],
      }),
    ],
  });
}
export { d as a };
