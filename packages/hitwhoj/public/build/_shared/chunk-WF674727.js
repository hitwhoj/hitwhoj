import { b as n } from "/build/_shared/chunk-ASHX7EDV.js";
var s = n([]),
  e = (t) => {
    (s.value = [...s.value, t]),
      setTimeout(() => {
        s.value = s.value.slice(1);
      }, 5e3);
  },
  o = (t) => e({ type: "info", message: t }),
  r = (t) => e({ type: "success", message: t }),
  a = (t) => e({ type: "error", message: t }),
  i = (t) => e({ type: "warning", message: t });
function g() {
  return { info: o, success: r, error: a, warning: i };
}
export { s as a, g as b };
