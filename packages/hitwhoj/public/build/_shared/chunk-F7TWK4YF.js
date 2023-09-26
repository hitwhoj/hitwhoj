import { c as n } from "/build/_shared/chunk-P4KF3DFI.js";
import { d as r } from "/build/_shared/chunk-G5WX4PPA.js";
var a = r(n());
function c({ user: e, className: s, ...o }) {
  let t = e.nickname || e.username;
  return (0, a.jsx)("div", {
    className: `avatar placeholder rounded-box flex items-center justify-center overflow-hidden ${
      s ?? "h-16 w-16 text-3xl"
    }`,
    ...o,
    children: e.avatar
      ? (0, a.jsx)("img", { src: e.avatar, alt: t })
      : (0, a.jsx)("span", {
          className: "text-base-content",
          children: t.charAt(0),
        }),
  });
}
export { c as a };
