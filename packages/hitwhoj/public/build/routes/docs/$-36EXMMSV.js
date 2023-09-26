import { a as f } from "/build/_shared/chunk-KUDQOE27.js";
import "/build/_shared/chunk-NPZ34MRD.js";
import "/build/_shared/chunk-5CMXDJBZ.js";
import { a, b as u } from "/build/_shared/chunk-ZPF2YCTJ.js";
import { c as s } from "/build/_shared/chunk-33FVQFAB.js";
import { d as i } from "/build/_shared/chunk-ASHX7EDV.js";
import "/build/_shared/chunk-KLFOMCVP.js";
import "/build/_shared/chunk-IYNQWWEV.js";
import { c as o } from "/build/_shared/chunk-P4KF3DFI.js";
import { a as m, d as n } from "/build/_shared/chunk-G5WX4PPA.js";
var v,
  l = m(() => {
    v =
      "ab".substr(-1) === "b"
        ? function (r, e, t) {
            return r.substr(e, t);
          }
        : function (r, e, t) {
            return e < 0 && (e = r.length + e), r.substr(e, t);
          };
  });
l();
var p = n(o());
var d = ({ data: r }) => ({ title: r?.title });
function c() {
  let r = s(),
    e = i(() => r.value.markdown);
  return (0, p.jsx)(f, { children: e.value });
}
export { u as CatchBoundary, a as ErrorBoundary, c as default, d as meta };
