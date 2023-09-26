import { a as o } from "/build/_shared/chunk-YFBG3YAE.js";
import { b as i, c as l } from "/build/_shared/chunk-P4KF3DFI.js";
import { d as t } from "/build/_shared/chunk-G5WX4PPA.js";
var r = t(i());
var a = t(l());
function p({ visible: e, className: n, ...s }) {
  return (
    (0, r.useEffect)(() => {
      o.value = !e;
    }, [e]),
    (0, r.useEffect)(() => () => void (o.value = !0), []),
    (0, a.jsx)("div", {
      className: `${
        e ? "visible" : "invisible scale-75 opacity-0"
      } text-base-content fixed top-0 left-0 z-10 h-screen w-screen transition ${
        n ?? ""
      }`,
      ...s,
    })
  );
}
export { p as a };
