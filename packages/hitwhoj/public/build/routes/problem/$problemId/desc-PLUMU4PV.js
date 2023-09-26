import { a as d } from "/build/_shared/chunk-KUDQOE27.js";
import "/build/_shared/chunk-NPZ34MRD.js";
import "/build/_shared/chunk-5CMXDJBZ.js";
import { a as p, b as s } from "/build/_shared/chunk-ZPF2YCTJ.js";
import { c as l } from "/build/_shared/chunk-33FVQFAB.js";
import { d as n } from "/build/_shared/chunk-ASHX7EDV.js";
import "/build/_shared/chunk-KLFOMCVP.js";
import { a as u } from "/build/_shared/chunk-XIHPQXCX.js";
import { f as a } from "/build/_shared/chunk-IYNQWWEV.js";
import { c as m } from "/build/_shared/chunk-P4KF3DFI.js";
import { d as i } from "/build/_shared/chunk-G5WX4PPA.js";
var c = i(u());
var r = i(m());
var b = ({ data: e }) => ({
  title: `\u9898\u76EE: ${e?.problem.title} - HITwh OJ`,
  description: e?.problem.description,
});
function f() {
  let e = l(),
    o = n(() => e.value.problem);
  return (0, r.jsxs)(r.Fragment, {
    children: [
      (0, r.jsx)(d, { children: o.value.description }),
      o.value.files.length > 0 &&
        (0, r.jsxs)(r.Fragment, {
          children: [
            (0, r.jsx)("h2", { children: "\u76F8\u5173\u6587\u4EF6" }),
            (0, r.jsx)("ul", {
              children: o.value.files.map((t) =>
                (0, r.jsx)(
                  "li",
                  {
                    children: (0, r.jsx)(a, {
                      className: "link",
                      to: `/file/${t.id}`,
                      target: "_blank",
                      children: t.filename,
                    }),
                  },
                  t.id
                )
              ),
            }),
          ],
        }),
    ],
  });
}
export { s as CatchBoundary, p as ErrorBoundary, f as default, b as meta };
